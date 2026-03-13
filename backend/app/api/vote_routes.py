from fastapi import APIRouter, Depends, status

from ..controllers.vote_controller import VoteController
from ..core.dependencies import get_current_user, require_roles
from ..schemas.vote_schema import ElectionResults, VoteCastRequest, VoteResponse

router = APIRouter(prefix="/votes", tags=["Votes"])
controller = VoteController()


@router.post("/cast", response_model=VoteResponse, status_code=status.HTTP_201_CREATED)
def cast_vote(
    payload: VoteCastRequest,
    current_user: dict = Depends(require_roles("voter")),
) -> VoteResponse:
    return controller.cast_vote(current_user["voter_id"], payload)


@router.get("/results/{election_id}", response_model=ElectionResults)
def get_results(
    election_id: str,
    _user: dict = Depends(get_current_user),
) -> ElectionResults:
    return controller.get_results(election_id)
