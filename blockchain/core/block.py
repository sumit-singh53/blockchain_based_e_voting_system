from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from .transaction import Transaction


def default_timestamp() -> str:
    return datetime.utcnow().isoformat()


@dataclass
class Block:
    index: int
    previous_hash: str
    transactions: List[Transaction]
    nonce: int = 0
    timestamp: str = field(default_factory=default_timestamp)
    hash: str | None = None
