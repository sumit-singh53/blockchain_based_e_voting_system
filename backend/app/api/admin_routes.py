from fastapi import APIRouter, Depends, Query

from ..controllers.admin_controller import AdminController
from ..core.dependencies import require_roles

router = APIRouter(prefix="/admin", tags=["Admin"])
controller = AdminController()


@router.get("/dashboard")
def admin_dashboard(_user: dict = Depends(require_roles("admin"))) -> dict:
    return controller.get_dashboard_stats()


@router.get("/recent-votes")
def recent_votes(
    limit: int = Query(default=20, ge=1, le=100),
    _user: dict = Depends(require_roles("admin")),
) -> list:
    return controller.get_recent_votes(limit)
