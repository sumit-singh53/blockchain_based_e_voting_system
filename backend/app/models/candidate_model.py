from pydantic import BaseModel


class Candidate(BaseModel):
    id: str
    name: str
    party: str
    manifesto: str | None = None
