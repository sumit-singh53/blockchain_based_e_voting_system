from ..schemas.vote_schema import ElectionResults, VoteCastRequest, VoteResponse
from ..services.voting_service import VotingService


class VoteController:
    """Coordinate vote casting and result retrieval."""

    def __init__(self, service: VotingService | None = None) -> None:
        self.service = service or VotingService()

    def cast_vote(self, voter_id: str, payload: VoteCastRequest) -> VoteResponse:
        return self.service.cast_vote(voter_id, payload)

    def get_results(self, election_id: str) -> ElectionResults:
        return self.service.get_results(election_id)
