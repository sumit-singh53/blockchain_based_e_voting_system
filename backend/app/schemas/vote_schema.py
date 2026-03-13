from datetime import datetime

from pydantic import BaseModel


class VoteCastRequest(BaseModel):
    election_id: str
    candidate_id: str


class VoteResponse(BaseModel):
    vote_id: str
    election_id: str
    candidate_id: str
    tx_hash: str | None = None
    created_at: datetime


class CandidateResult(BaseModel):
    candidate_id: str
    candidate_name: str
    party: str | None = None
    votes: int
    percentage: float


class ElectionResults(BaseModel):
    election_id: str
    election_name: str
    total_votes: int
    total_voters: int
    turnout_percentage: float
    results: list[CandidateResult]
