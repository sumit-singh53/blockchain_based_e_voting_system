from fastapi import APIRouter, Depends, Query, status

from ..controllers.candidate_controller import CandidateController
from ..core.dependencies import get_current_user, require_roles
from ..schemas.candidate_schema import CandidateCreate, CandidateResponse, CandidateUpdate

router = APIRouter(prefix="/candidates", tags=["Candidates"])
controller = CandidateController()


@router.get("/", response_model=list[CandidateResponse])
def list_candidates(
    election_id: str | None = Query(default=None),
    _user: dict = Depends(get_current_user),
) -> list[CandidateResponse]:
    return controller.list_candidates(election_id)


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(
    candidate_id: str,
    _user: dict = Depends(get_current_user),
) -> CandidateResponse:
    return controller.get_candidate(candidate_id)


@router.post("/", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(
    payload: CandidateCreate,
    _user: dict = Depends(require_roles("admin")),
) -> CandidateResponse:
    return controller.create_candidate(payload)


@router.patch("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: str,
    payload: CandidateUpdate,
    _user: dict = Depends(require_roles("admin")),
) -> CandidateResponse:
    return controller.update_candidate(candidate_id, payload)


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: str,
    _user: dict = Depends(require_roles("admin")),
) -> None:
    controller.delete_candidate(candidate_id)
