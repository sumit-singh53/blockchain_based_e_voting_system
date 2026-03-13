from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class Voter(BaseModel):
    voter_id: str = Field(..., description="Public voter identifier")
    name: str
    email: EmailStr
    password_hash: str
    role: str = "voter"
    has_voted: bool = False
    registration_date: datetime

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }
