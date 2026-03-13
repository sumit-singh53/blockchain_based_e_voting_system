import hashlib
import json


def hash_block(block) -> str:
    block_string = json.dumps(
        {
            "index": block.index,
            "previous_hash": block.previous_hash,
            "transactions": [tx.__dict__ for tx in block.transactions],
            "nonce": block.nonce,
            "timestamp": block.timestamp,
        },
        sort_keys=True,
    )
    return hashlib.sha256(block_string.encode("utf-8")).hexdigest()
