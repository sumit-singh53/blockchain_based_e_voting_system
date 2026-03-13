"""
Singleton wrapper that loads the blockchain from disk on start-up and exposes
the shared in-memory chain to the rest of the backend.

The project root is added to sys.path here so the top-level `blockchain`
package is importable regardless of how the server is launched.
"""
import sys
from pathlib import Path

# backend/app/core/ → backend/app/ → backend/ → project root
_project_root = Path(__file__).resolve().parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from blockchain.core.blockchain import Blockchain  # noqa: E402
from blockchain.core.transaction import Transaction  # noqa: E402  (re-exported)
from blockchain.storage.chain_storage import ChainStorage  # noqa: E402

_CHAIN_FILE = _project_root / "chain.json"
_storage = ChainStorage(path=str(_CHAIN_FILE))
_chain = Blockchain(difficulty=2)

# Load persisted chain or create genesis block
_loaded = _storage.load()
if _loaded:
    _chain.chain = _loaded
else:
    _chain.create_genesis_block()


def get_chain() -> Blockchain:
    return _chain


def persist_chain() -> None:
    _storage.save(_chain.chain)


__all__ = ["get_chain", "persist_chain", "Transaction"]
