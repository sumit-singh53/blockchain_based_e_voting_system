from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

ElectionStatus = Literal["draft", "scheduled", "active", "completed", "archived"]


class Election(BaseModel):
    election_id: str
    name: str = Field(..., min_length=3)
    status: ElectionStatus = "draft"
    start_date: datetime | None = None
    end_date: datetime | None = None
