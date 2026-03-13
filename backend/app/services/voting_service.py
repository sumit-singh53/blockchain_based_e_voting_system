from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status
from mysql.connector import IntegrityError

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
        if election.get("start_date") and now < election["start_date"]:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Election has not started yet")
        if election.get("end_date") and now > election["end_date"]:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Election has ended")

        if not self._candidate_in_election(payload.candidate_id, payload.election_id):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Candidate not in this election")

        if self._has_voted(voter_id, payload.election_id):
            raise HTTPException(status.HTTP_409_CONFLICT, detail="You have already voted in this election")

        # Record vote on blockchain (voter identity anonymised)
        tx = Transaction(
            voter_id=f"anon_{voter_id[:8]}",
            candidate_id=payload.candidate_id,
            election_id=payload.election_id,
            signature=str(uuid4()),
        )
        chain = get_chain()
        chain.add_transaction(tx)
        block = chain.mine_pending_transactions()
        tx_hash = block.hash if block else None
        persist_chain()

        # Persist vote record and mark voter
        vote_id = str(uuid4())
        created_at = datetime.utcnow()
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO votes (vote_id, election_id, voter_id, candidate_id, tx_hash, created_at) "
                    "VALUES (%s, %s, %s, %s, %s, %s)",
                    (vote_id, payload.election_id, voter_id, payload.candidate_id, tx_hash, created_at),
                )
                cursor.execute("UPDATE voters SET has_voted = 1 WHERE voter_id = %s", (voter_id,))
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
