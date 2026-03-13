from fastapi import APIRouter, Depends, Query, status

from ..core.dependencies import require_roles
from ..schemas.election_schema import ElectionCreate, ElectionResponse, ElectionStatusUpdate
from ..services.election_service import ElectionService

router = APIRouter(prefix="/elections", tags=["Elections"])
service = ElectionService()


@router.post("/", response_model=ElectionResponse, status_code=status.HTTP_201_CREATED)
def create_election(
    payload: ElectionCreate,
    current_user: dict = Depends(require_roles("admin")),
) -> ElectionResponse:
    _ = current_user
    return service.create_election(payload)


@router.get("/", response_model=list[ElectionResponse])
def list_elections(status: str | None = Query(default=None)) -> list[ElectionResponse]:
    return service.list_elections(status)


@router.get("/{election_id}", response_model=ElectionResponse)
def get_election(election_id: str) -> ElectionResponse:
    return service.get_election(election_id)


@router.patch("/{election_id}/status", response_model=ElectionResponse)
def update_status(
    election_id: str,
    payload: ElectionStatusUpdate,
    current_user: dict = Depends(require_roles("admin")),
) -> ElectionResponse:
    _ = current_user
    return service.update_status(election_id, payload)
