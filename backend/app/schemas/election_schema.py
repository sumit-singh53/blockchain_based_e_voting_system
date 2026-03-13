from datetime import datetime

from pydantic import BaseModel, Field

from ..models.election_model import ElectionStatus


class ElectionCreate(BaseModel):
    name: str = Field(..., min_length=3)
    status: ElectionStatus = "draft"
    start_date: datetime | None = None
    end_date: datetime | None = None


class ElectionResponse(BaseModel):
    election_id: str
    name: str
    status: ElectionStatus
    start_date: datetime | None = None
    end_date: datetime | None = None


class ElectionStatusUpdate(BaseModel):
    status: ElectionStatus
    start_date: datetime | None = None
    end_date: datetime | None = None
