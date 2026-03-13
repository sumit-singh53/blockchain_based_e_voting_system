from fastapi import APIRouter, Depends, Query

from ..controllers.voter_controller import VoterController
from ..core.dependencies import get_current_user, require_roles
from ..schemas.voter_schema import VoterAdminUpdate, VoterProfileUpdate, VoterResponse

router = APIRouter(prefix="/voters", tags=["Voters"])
controller = VoterController()


@router.get("/", response_model=list[VoterResponse])
def list_voters(
    role: str | None = Query(default=None),
    has_voted: bool | None = Query(default=None),
    current_user: dict = Depends(require_roles("admin")),
) -> list[VoterResponse]:
    _ = current_user
    return controller.list_voters(role, has_voted)


@router.get("/me", response_model=VoterResponse)
def get_me(current_user: dict = Depends(get_current_user)) -> VoterResponse:
    return controller.get_profile(current_user["voter_id"])


@router.patch("/me", response_model=VoterResponse)
def update_me(
    payload: VoterProfileUpdate,
    current_user: dict = Depends(get_current_user),
) -> VoterResponse:
    return controller.update_profile(current_user["voter_id"], payload)


@router.get("/{voter_id}", response_model=VoterResponse)
def get_voter(
    voter_id: str,
    current_user: dict = Depends(require_roles("admin")),
) -> VoterResponse:
    _ = current_user
    return controller.get_voter(voter_id)


@router.patch("/{voter_id}", response_model=VoterResponse)
def update_voter(
    voter_id: str,
    payload: VoterAdminUpdate,
    current_user: dict = Depends(require_roles("admin")),
) -> VoterResponse:
    _ = current_user
    return controller.update_voter(voter_id, payload)
