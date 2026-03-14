from datetime import datetime, timedelta

import jwt

from .config import settings


def create_access_token(subject: str, role: str, expires_delta: timedelta | None = None) -> str:
    expires_delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {
        "sub": subject,
        "role": role,
        "type": "access",
        "exp": datetime.utcnow() + expires_delta,
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

def create_refresh_token(subject: str, role: str) -> str:
    expires_delta = timedelta(days=7)  # Refresh tokens last a week
    to_encode = {
        "sub": subject,
        "role": role,
        "type": "refresh",
        "exp": datetime.utcnow() + expires_delta,
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
