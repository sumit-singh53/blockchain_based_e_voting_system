from pydantic import BaseModel, Field


class CandidateCreate(BaseModel):
    election_id: str
    name: str = Field(..., min_length=1)
    party: str | None = None
    description: str | None = None


class CandidateUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    party: str | None = None
    description: str | None = None


class CandidateResponse(BaseModel):
    candidate_id: str
    election_id: str
    name: str
    party: str | None = None
    description: str | None = None
