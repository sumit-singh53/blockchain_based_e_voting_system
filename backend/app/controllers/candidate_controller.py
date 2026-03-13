from ..schemas.candidate_schema import CandidateCreate, CandidateUpdate
from ..services.candidate_service import CandidateService


class CandidateController:
    """Manage candidate lifecycle."""

    def __init__(self, service: CandidateService | None = None) -> None:
        self.service = service or CandidateService()

    def list_candidates(self, election_id: str | None):
        return self.service.list_candidates(election_id)

    def get_candidate(self, candidate_id: str):
        return self.service.get_candidate(candidate_id)

    def create_candidate(self, payload: CandidateCreate):
        return self.service.create_candidate(payload)

    def update_candidate(self, candidate_id: str, payload: CandidateUpdate):
        return self.service.update_candidate(candidate_id, payload)

    def delete_candidate(self, candidate_id: str) -> None:
        self.service.delete_candidate(candidate_id)
