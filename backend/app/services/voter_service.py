from typing import Any, Dict, List

from fastapi import HTTPException, status
from ..core.database import IntegrityError

from ..core.database import get_connection
from ..schemas.voter_schema import RoleLiteral, VoterAdminUpdate, VoterProfileUpdate, VoterResponse

ALLOWED_ROLES: set[RoleLiteral] = {"voter", "admin"}


class VoterService:
    def list_voters(self, role: str | None = None, has_voted: bool | None = None) -> List[VoterResponse]:
        query = "SELECT voter_id, name, email, role, has_voted, registration_date FROM voters"
        conditions: list[str] = []
        params: list[Any] = []

        if role:
            if role not in ALLOWED_ROLES:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid role filter")
            conditions.append("role = %s")
            params.append(role)

        if has_voted is not None:
            conditions.append("has_voted = %s")
            params.append(1 if has_voted else 0)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += " ORDER BY registration_date DESC"

        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, tuple(params))
            rows = cursor.fetchall()
            cursor.close()

        return [self._serialize(row) for row in rows]

    def get_voter(self, voter_id: str) -> VoterResponse:
        voter = self._fetch_by_id(voter_id)
        if not voter:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Voter not found")
        return voter

    def update_voter_admin(self, voter_id: str, payload: VoterAdminUpdate) -> VoterResponse:
        updates = self._build_update_fields(payload)
        if not updates:
            return self.get_voter(voter_id)
        self._execute_update(voter_id, updates)
        return self.get_voter(voter_id)

    def update_profile(self, voter_id: str, payload: VoterProfileUpdate) -> VoterResponse:
        updates = {}
        if payload.name is not None:
            updates["name"] = payload.name.strip()
        if payload.email is not None:
            updates["email"] = payload.email.lower()
        if not updates:
            return self.get_voter(voter_id)
        self._execute_update(voter_id, updates)
        return self.get_voter(voter_id)

    def _build_update_fields(self, payload: VoterAdminUpdate) -> Dict[str, Any]:
        updates: Dict[str, Any] = {}
        if payload.name is not None:
            updates["name"] = payload.name.strip()
        if payload.email is not None:
            updates["email"] = payload.email.lower()
        if payload.role is not None:
            if payload.role not in ALLOWED_ROLES:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid role supplied")
            updates["role"] = payload.role
        if payload.has_voted is not None:
            updates["has_voted"] = 1 if payload.has_voted else 0
        return updates

    def _execute_update(self, voter_id: str, updates: Dict[str, Any]) -> None:
        assignments = [f"{column} = %s" for column in updates.keys()]
        params = list(updates.values()) + [voter_id]
        query = f"UPDATE voters SET {', '.join(assignments)} WHERE voter_id = %s"

        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, tuple(params))
                if cursor.rowcount == 0:
                    cursor.close()
                    conn.rollback()
                    raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Voter not found")
                conn.commit()
                cursor.close()
        except IntegrityError as exc:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already in use") from exc

    def _fetch_by_id(self, voter_id: str) -> VoterResponse | None:
        query = "SELECT voter_id, name, email, role, has_voted, registration_date FROM voters WHERE voter_id = %s"
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (voter_id,))
            row = cursor.fetchone()
            cursor.close()
        if not row:
            return None
        return self._serialize(row)

    @staticmethod
    def _serialize(row: Dict[str, Any]) -> VoterResponse:
        return VoterResponse(
            voter_id=row["voter_id"],
            name=row["name"],
            email=row["email"],
            role=row["role"],
            has_voted=bool(row["has_voted"]),
            registration_date=row["registration_date"],
        )
