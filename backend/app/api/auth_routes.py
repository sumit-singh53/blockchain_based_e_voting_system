from fastapi import APIRouter, Depends, status

from ..controllers.auth_controller import AuthController
from ..core.dependencies import get_current_user
from ..core.rate_limiter import limit_by_ip
from ..schemas.auth_schema import AuthResponse, LoginRequest, RefreshRequest, RegisterRequest, RegisterResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
controller = AuthController()
register_rate_limit = limit_by_ip(max_requests=50, window_seconds=60)
login_rate_limit = limit_by_ip(max_requests=100, window_seconds=60)
refresh_rate_limit = limit_by_ip(max_requests=300, window_seconds=60)


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    _rate_limit: None = Depends(register_rate_limit),
) -> RegisterResponse:
    _ = _rate_limit
    return controller.register(payload)


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    _rate_limit: None = Depends(login_rate_limit),
) -> AuthResponse:
    _ = _rate_limit
    return controller.login(payload)


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    payload: RefreshRequest,
    _rate_limit: None = Depends(refresh_rate_limit),
) -> AuthResponse:
    _ = _rate_limit
    return controller.refresh(payload)


@router.get("/health")
def auth_health() -> dict:
    return {"service": "auth", "status": "ok"}
