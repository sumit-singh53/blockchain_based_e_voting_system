from typing import Any, get_args
from uuid import uuid4

from fastapi import HTTPException, status

from ..core.database import get_connection
from ..models.election_model import ElectionStatus
from ..schemas.election_schema import ElectionCreate, ElectionResponse, ElectionStatusUpdate

VALID_STATUSES = set(get_args(ElectionStatus))


class ElectionService:
    def create_election(self, payload: ElectionCreate) -> ElectionResponse:
        election_id = str(uuid4())
        start_date = payload.start_date
        end_date = payload.end_date
        status_value = payload.status

        insert_sql = (
            "INSERT INTO elections (election_id, name, status, start_date, end_date) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        values = (election_id, payload.name, status_value, start_date, end_date)

        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_sql, values)
            conn.commit()
            cursor.close()

        return ElectionResponse(
            election_id=election_id,
            name=payload.name,
            status=status_value,
            start_date=start_date,
            end_date=end_date,
        )

    def list_elections(self, status_filter: str | None = None) -> list[ElectionResponse]:
        query = "SELECT election_id, name, status, start_date, end_date FROM elections"
        params: tuple[Any, ...] = ()
        if status_filter:
            if status_filter not in VALID_STATUSES:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status filter")
            query += " WHERE status = %s"
            params = (status_filter,)
        query += " ORDER BY start_date IS NULL, start_date"

        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params)
            rows = cursor.fetchall()
            cursor.close()

        return [self._serialize(row) for row in rows]

    def get_election(self, election_id: str) -> ElectionResponse:
        election = self._fetch_election(election_id)
        if not election:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Election not found")
        return election

    def update_status(self, election_id: str, payload: ElectionStatusUpdate) -> ElectionResponse:
        if payload.status not in VALID_STATUSES:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")

        update_sql = (
            "UPDATE elections SET status = %s, start_date = %s, end_date = %s WHERE election_id = %s"
        )
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                update_sql,
                (
                    payload.status,
                    payload.start_date,
                    payload.end_date,
                    election_id,
                ),
            )
            if cursor.rowcount == 0:
                cursor.close()
                conn.rollback()
                raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Election not found")
            conn.commit()
            cursor.close()

        return self.get_election(election_id)

    def _fetch_election(self, election_id: str) -> ElectionResponse | None:
        query = "SELECT election_id, name, status, start_date, end_date FROM elections WHERE election_id = %s"
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (election_id,))
            row = cursor.fetchone()
            cursor.close()
        if not row:
            return None
        return self._serialize(row)

    @staticmethod
    def _serialize(row: dict) -> ElectionResponse:
        return ElectionResponse(
            election_id=row["election_id"],
            name=row["name"],
            status=row["status"],
            start_date=row.get("start_date"),
            end_date=row.get("end_date"),
        )
