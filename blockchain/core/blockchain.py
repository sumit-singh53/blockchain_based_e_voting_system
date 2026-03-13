from __future__ import annotations

from typing import List

from .block import Block
from .transaction import Transaction
from ..consensus.proof_of_work import mine_block
from ..utils.crypto import hash_block


class Blockchain:
    def __init__(self, difficulty: int = 2) -> None:
        self.chain: List[Block] = []
        self.mempool: List[Transaction] = []
        self.difficulty = difficulty

    def create_genesis_block(self) -> Block:
        genesis = Block(index=0, previous_hash="0" * 64, transactions=[])
        genesis = mine_block(genesis, self.difficulty)
        self.chain.append(genesis)
        return genesis

    def add_block(self, block: Block) -> Block:
        if not self.chain:
            self.create_genesis_block()
        block.previous_hash = self.chain[-1].hash or "0" * 64
        block = mine_block(block, self.difficulty)
        self.chain.append(block)
        return block

    def add_transaction(self, transaction: Transaction) -> None:
        self.mempool.append(transaction)

    def mine_pending_transactions(self) -> Block | None:
        """Bundle all pending mempool transactions into a new mined block."""
        if not self.mempool:
            return None
        block = Block(
            index=len(self.chain),
            previous_hash=self.chain[-1].hash if self.chain else "0" * 64,
            transactions=list(self.mempool),
        )
        block = mine_block(block, self.difficulty)
        self.chain.append(block)
        self.mempool.clear()
        return block

    def validate_chain(self) -> bool:
        """Return True if every block's hash and linkage are valid."""
        for i in range(1, len(self.chain)):
            cur = self.chain[i]
            prev = self.chain[i - 1]
            if cur.hash != hash_block(cur):
                return False
            if cur.previous_hash != prev.hash:
                return False
        return True

    def to_dict(self) -> list:
        return [
            {
                "index": b.index,
                "previous_hash": b.previous_hash,
                "transactions": [tx.__dict__ for tx in b.transactions],
                "nonce": b.nonce,
                "timestamp": b.timestamp,
                "hash": b.hash,
            }
            for b in self.chain
        ]
