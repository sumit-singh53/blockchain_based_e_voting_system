import json
from pathlib import Path

from ..core.block import Block
from ..core.transaction import Transaction


class ChainStorage:
    def __init__(self, path: str = "./chain.json") -> None:
        self.path = Path(path)

    def save(self, chain: list[Block]) -> None:
        payload = [
            {
                "index": b.index,
                "previous_hash": b.previous_hash,
                "transactions": [tx.__dict__ for tx in b.transactions],
                "nonce": b.nonce,
                "timestamp": b.timestamp,
                "hash": b.hash,
            }
            for b in chain
        ]
        self.path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def load(self) -> list[Block]:
        if not self.path.exists():
            return []
        data = json.loads(self.path.read_text(encoding="utf-8"))
        blocks: list[Block] = []
        for item in data:
            txs = [
                Transaction(
                    voter_id=tx["voter_id"],
                    candidate_id=tx["candidate_id"],
                    election_id=tx["election_id"],
                    signature=tx["signature"],
                    timestamp=tx["timestamp"],
                )
                for tx in item.get("transactions", [])
            ]
            block = Block(
                index=item["index"],
                previous_hash=item["previous_hash"],
                transactions=txs,
                nonce=item["nonce"],
                timestamp=item["timestamp"],
            )
            block.hash = item.get("hash")
            blocks.append(block)
        return blocks
