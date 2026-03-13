from ..schemas.auth_schema import AuthResponse, LoginRequest, RegisterRequest, RegisterResponse
from ..services.auth_service import AuthService


class AuthController:
    """Handle authentication flows (login, register)."""

    def __init__(self, service: AuthService | None = None) -> None:
        self.service = service or AuthService()

    def register(self, payload: RegisterRequest) -> RegisterResponse:
        voter = self.service.register_voter(payload)
        return RegisterResponse(**voter)

    def login(self, credentials: LoginRequest) -> AuthResponse:
        auth_payload = self.service.authenticate(credentials)
        return AuthResponse(**auth_payload)
