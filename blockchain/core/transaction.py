from dataclasses import dataclass, field
from datetime import datetime


def default_timestamp() -> str:
    return datetime.utcnow().isoformat()


@dataclass
class Transaction:
    voter_id: str
    candidate_id: str
    election_id: str
    signature: str
    timestamp: str = field(default_factory=default_timestamp)
