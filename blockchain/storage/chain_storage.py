import json
from pathlib import Path

from ..core.block import Block
from ..core.transaction import Transaction

class ChainStorage:
    def __init__(self, path: str = "./chain.json", mempool_path: str = "./mempool.json") -> None:
        self.path = Path(path)
        self.mempool_path = Path(mempool_path)

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

    def save_mempool(self, mempool: list[Transaction]) -> None:
        payload = [tx.__dict__ for tx in mempool]
        self.mempool_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def load(self) -> list[Block]:
        if not self.path.exists():
            return []
        data = json.loads(self.path.read_text(encoding="utf-8"))
        blocks: list[Block] = []
        for item in data:
            txs = [
                Transaction(
                    vote_id=tx.get("vote_id", ""),  # default if missing
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

    def load_mempool(self) -> list[Transaction]:
        if not self.mempool_path.exists():
            return []
        data = json.loads(self.mempool_path.read_text(encoding="utf-8"))
        mempool: list[Transaction] = []
        for tx in data:
            mempool.append(
                Transaction(
                    vote_id=tx.get("vote_id", ""),
                    voter_id=tx["voter_id"],
                    candidate_id=tx["candidate_id"],
                    election_id=tx["election_id"],
                    signature=tx["signature"],
                    timestamp=tx["timestamp"],
                )
            )
        return mempool
