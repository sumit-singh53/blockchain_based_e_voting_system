from ..utils.crypto import hash_block


def mine_block(block, difficulty: int = 4):
    prefix = "0" * difficulty
    nonce = 0
    while True:
        block.nonce = nonce
        digest = hash_block(block)
        if digest.startswith(prefix):
            block.hash = digest
            return block
        nonce += 1
