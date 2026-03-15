from ..core.chain_instance import get_chain, persist_chain


class BlockchainService:
    def get_chain(self) -> list:
        return get_chain().to_dict()

    def get_block(self, index: int) -> dict | None:
        chain = get_chain()
        if index < 0 or index >= len(chain.chain):
            return None
        b = chain.chain[index]
        return {
            "index": b.index,
            "previous_hash": b.previous_hash,
            "transactions": [tx.__dict__ for tx in b.transactions],
            "nonce": b.nonce,
            "timestamp": b.timestamp,
            "hash": b.hash,
        }

    def validate_chain(self) -> bool:
        return get_chain().validate_chain()

    def mine_pending(self) -> dict | None:
        chain = get_chain()
        block = chain.mine_pending_transactions()
        if block is None:
            return None
        persist_chain()
        
        # Update MySQL `votes` table with the new tx_hash for all mined transactions
        from ..core.database import get_connection
        with get_connection() as conn:
            cursor = conn.cursor()
            for tx in block.transactions:
                cursor.execute(
                    "UPDATE votes SET tx_hash = %s WHERE vote_id = %s",
                    (block.hash, getattr(tx, "vote_id", None))
                )
            conn.commit()
            cursor.close()
        return {
            "index": block.index,
            "hash": block.hash,
            "transactions_count": len(block.transactions),
            "nonce": block.nonce,
            "timestamp": block.timestamp,
        }

    def get_pending_transactions(self) -> list:
        return [tx.__dict__ for tx in get_chain().mempool]

    def get_stats(self) -> dict:
        chain = get_chain()
        return {
            "block_count": len(chain.chain),
            "pending_transactions": len(chain.mempool),
            "is_valid": chain.validate_chain(),
        }
