from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from ..core.database import IntegrityError

from ..core.chain_instance import Transaction, get_chain, persist_chain
from ..core.database import get_connection
from ..schemas.vote_schema import CandidateResult, ElectionResults, VoteCastRequest, VoteResponse


class VotingService:
    def cast_vote(self, voter_id: str, payload: VoteCastRequest) -> VoteResponse:
        election = self._get_election(payload.election_id)
        if not election:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Election not found")
        if election["status"] != "active":
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Election is not active")

        now = datetime.utcnow()

        def _parse_dt(val):
            """Parse an ISO string from SQLite into a datetime, or return None."""
            if val is None:
                return None
            if isinstance(val, datetime):
                return val
            try:
                return datetime.fromisoformat(str(val))
            except ValueError:
                return None

        start_dt = _parse_dt(election.get("start_date"))
        end_dt   = _parse_dt(election.get("end_date"))

        if start_dt and now < start_dt:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Election has not started yet")
        if end_dt and now > end_dt:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Election has ended")

        if not self._candidate_in_election(payload.candidate_id, payload.election_id):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Candidate not in this election")

        if self._has_voted(voter_id, payload.election_id):
            raise HTTPException(status.HTTP_409_CONFLICT, detail="You have already voted in this election")

        vote_id = str(uuid4())
        created_at = datetime.utcnow()

        from blockchain.utils.keys import Wallet
        # For scaffolding purposes: generate a one-off wallet for the anonymous voter
        wallet = Wallet()
        voter_public_key = wallet.public_key
        
        tx = Transaction(
            vote_id=vote_id,
            voter_id=voter_public_key,  # Now strictly a public key
            candidate_id=payload.candidate_id,
            election_id=payload.election_id,
            signature="", 
        )
        
        # Sign the transaction
        tx.signature = wallet.sign_transaction(tx.to_signable_dict())

        chain = get_chain()
        
        # Validate signature before adding to mempool
        if not tx.is_valid(voter_public_key):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Transaction signature invalid")
            
        chain.add_transaction(tx)
        # We NO LONGER mine the block instantly. We persist the mempool state.
        persist_chain()
        tx_hash = None

        # Persist vote record and mark voter
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO votes (vote_id, election_id, voter_id, candidate_id, tx_hash, created_at) "
                    "VALUES (%s, %s, %s, %s, %s, %s)",
                    (vote_id, payload.election_id, voter_id, payload.candidate_id, tx_hash, created_at),
                )
                # NOTE: We do NOT set has_voted=1 globally here.
                # The UNIQUE (voter_id, election_id) constraint properly enforces
                # one-vote-per-election. A voter may participate in multiple elections.
                conn.commit()
                cursor.close()
        except IntegrityError as exc:
            raise HTTPException(status.HTTP_409_CONFLICT, detail="You have already voted in this election") from exc

        return VoteResponse(
            vote_id=vote_id,
            election_id=payload.election_id,
            candidate_id=payload.candidate_id,
            tx_hash=tx_hash,
            created_at=created_at,
        )

    def get_results(self, election_id: str) -> ElectionResults:
        election = self._get_election(election_id)
        if not election:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Election not found")

        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT candidate_id, name, party FROM candidates WHERE election_id = %s",
                (election_id,),
            )
            candidates = cursor.fetchall()
            cursor.close()

        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT candidate_id, COUNT(*) AS vote_count FROM votes "
                "WHERE election_id = %s GROUP BY candidate_id",
                (election_id,),
            )
            tally = {row["candidate_id"]: row["vote_count"] for row in cursor.fetchall()}
            cursor.close()

        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM voters WHERE role = 'voter'")
            (total_voters,) = cursor.fetchone()
            cursor.close()

        total_votes = sum(tally.values())
        results = [
            CandidateResult(
                candidate_id=c["candidate_id"],
                candidate_name=c["name"],
                party=c.get("party"),
                votes=tally.get(c["candidate_id"], 0),
                percentage=round(tally.get(c["candidate_id"], 0) / total_votes * 100, 2) if total_votes else 0.0,
            )
            for c in candidates
        ]
        results.sort(key=lambda r: r.votes, reverse=True)

        return ElectionResults(
            election_id=election_id,
            election_name=election["name"],
            total_votes=total_votes,
            total_voters=total_voters,
            turnout_percentage=round(total_votes / total_voters * 100, 2) if total_voters else 0.0,
            results=results,
        )

    # ── private helpers ────────────────────────────────────────────────────────

    def _get_election(self, election_id: str) -> dict | None:
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT election_id, name, status, start_date, end_date FROM elections WHERE election_id = %s",
                (election_id,),
            )
            row = cursor.fetchone()
            cursor.close()
        return row

    def _candidate_in_election(self, candidate_id: str, election_id: str) -> bool:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT 1 FROM candidates WHERE candidate_id = %s AND election_id = %s",
                (candidate_id, election_id),
            )
            result = cursor.fetchone()
            cursor.close()
        return result is not None

    def _has_voted(self, voter_id: str, election_id: str) -> bool:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT 1 FROM votes WHERE voter_id = %s AND election_id = %s",
                (voter_id, election_id),
            )
            result = cursor.fetchone()
            cursor.close()
        return result is not None
