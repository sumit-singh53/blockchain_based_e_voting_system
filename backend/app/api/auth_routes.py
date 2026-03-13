from fastapi import APIRouter, status

from ..controllers.auth_controller import AuthController
from ..schemas.auth_schema import AuthResponse, LoginRequest, RegisterRequest, RegisterResponse

router = APIRouter(tags=["Authentication"])
controller = AuthController()


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest) -> RegisterResponse:
    return controller.register(payload)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest) -> AuthResponse:
    return controller.login(payload)


@router.get("/auth/health")
def auth_health() -> dict:
    return {"service": "auth", "status": "ok"}
