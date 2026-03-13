from ..schemas.voter_schema import VoterAdminUpdate, VoterProfileUpdate
from ..services.voter_service import VoterService


class VoterController:
    """Manage voter records and profiles."""

    def __init__(self, service: VoterService | None = None) -> None:
        self.service = service or VoterService()

    def list_voters(self, role: str | None, has_voted: bool | None):
        return self.service.list_voters(role, has_voted)

    def get_voter(self, voter_id: str):
        return self.service.get_voter(voter_id)

    def update_voter(self, voter_id: str, payload: VoterAdminUpdate):
        return self.service.update_voter_admin(voter_id, payload)

    def get_profile(self, voter_id: str):
        return self.service.get_voter(voter_id)

    def update_profile(self, voter_id: str, payload: VoterProfileUpdate):
        return self.service.update_profile(voter_id, payload)
