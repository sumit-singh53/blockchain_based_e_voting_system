from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


RoleLiteral = Literal["voter", "admin"]


class VoterResponse(BaseModel):
    voter_id: str
    name: str
    email: EmailStr
    role: RoleLiteral
    has_voted: bool
    registration_date: datetime


class VoterAdminUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    email: EmailStr | None = None
    role: RoleLiteral | None = None
    has_voted: bool | None = None


class VoterProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    email: EmailStr | None = None
