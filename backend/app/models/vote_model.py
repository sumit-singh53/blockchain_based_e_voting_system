from pydantic import BaseModel


class Vote(BaseModel):
    id: str
    election_id: str
    voter_id: str
    candidate_id: str
    timestamp: str
