from dataclasses import dataclass, field
from datetime import datetime


def default_timestamp() -> str:
    return datetime.utcnow().isoformat()


@dataclass
class Transaction:
    vote_id: str
    voter_id: str
    candidate_id: str
    election_id: str
    signature: str
    timestamp: str = field(default_factory=default_timestamp)

    def to_signable_dict(self) -> dict:
        """Return the transaction fields as a dict, excluding the signature."""
        return {
            "vote_id": getattr(self, "vote_id", ""),
            "voter_id": self.voter_id,
            "candidate_id": self.candidate_id,
            "election_id": self.election_id,
            "timestamp": self.timestamp,
        }

    def is_valid(self, public_key_hex: str) -> bool:
        """Verify the cryptographic signature using the voter's public key."""
        from blockchain.utils.keys import Wallet
        if not getattr(self, "signature", None):
            return False
        return Wallet.verify_signature(public_key_hex, self.signature, self.to_signable_dict())
