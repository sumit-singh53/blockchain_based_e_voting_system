from typing import Any, Dict, List
from uuid import uuid4

from fastapi import HTTPException, status
from ..core.database import IntegrityError

from ..core.database import get_connection
from ..schemas.candidate_schema import CandidateCreate, CandidateResponse, CandidateUpdate


class CandidateService:
    def create_candidate(self, payload: CandidateCreate) -> CandidateResponse:
        self._verify_election_exists(payload.election_id)
        candidate_id = str(uuid4())
        insert_sql = (
            "INSERT INTO candidates (candidate_id, election_id, name, party, description) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    insert_sql,
                    (candidate_id, payload.election_id, payload.name.strip(), payload.party, payload.description),
                )
                conn.commit()
                cursor.close()
        except IntegrityError as exc:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid election or duplicate entry") from exc

        return CandidateResponse(
            candidate_id=candidate_id,
            election_id=payload.election_id,
            name=payload.name.strip(),
            party=payload.party,
            description=payload.description,
        )

    def list_candidates(self, election_id: str | None = None, limit: int = 100, offset: int = 0) -> List[CandidateResponse]:
        query = "SELECT candidate_id, election_id, name, party, description FROM candidates"
        params: list = []
        if election_id:
            query += " WHERE election_id = %s"
            params.append(election_id)
        query += " ORDER BY name LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params)
            rows = cursor.fetchall()
            cursor.close()
        return [self._serialize(row) for row in rows]

    def get_candidate(self, candidate_id: str) -> CandidateResponse:
        row = self._fetch_by_id(candidate_id)
        if not row:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Candidate not found")
        return row

    def update_candidate(self, candidate_id: str, payload: CandidateUpdate) -> CandidateResponse:
        updates: Dict[str, Any] = {}
        if payload.name is not None:
            updates["name"] = payload.name.strip()
        if payload.party is not None:
            updates["party"] = payload.party
        if payload.description is not None:
            updates["description"] = payload.description
        if not updates:
            return self.get_candidate(candidate_id)

        assignments = ", ".join(f"{k} = %s" for k in updates)
        params = list(updates.values()) + [candidate_id]
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"UPDATE candidates SET {assignments} WHERE candidate_id = %s", params)
            if cursor.rowcount == 0:
                cursor.close()
                raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Candidate not found")
            conn.commit()
            cursor.close()
        return self.get_candidate(candidate_id)

    def delete_candidate(self, candidate_id: str) -> None:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM candidates WHERE candidate_id = %s", (candidate_id,))
            if cursor.rowcount == 0:
                cursor.close()
                raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Candidate not found")
            conn.commit()
            cursor.close()

    def _verify_election_exists(self, election_id: str) -> None:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM elections WHERE election_id = %s", (election_id,))
            exists = cursor.fetchone()
            cursor.close()
        if not exists:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Election not found")

    def _fetch_by_id(self, candidate_id: str) -> CandidateResponse | None:
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT candidate_id, election_id, name, party, description FROM candidates WHERE candidate_id = %s",
                (candidate_id,),
            )
            row = cursor.fetchone()
            cursor.close()
        if not row:
            return None
        return self._serialize(row)

    @staticmethod
    def _serialize(row: Dict[str, Any]) -> CandidateResponse:
        return CandidateResponse(
            candidate_id=row["candidate_id"],
            election_id=row["election_id"],
            name=row["name"],
            party=row.get("party"),
            description=row.get("description"),
        )
