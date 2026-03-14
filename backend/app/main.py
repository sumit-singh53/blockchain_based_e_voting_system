import sys
from pathlib import Path

# Add project root to sys.path so the top-level `blockchain` package is importable
# regardless of the working directory when the server is started.
_project_root = Path(__file__).resolve().parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import (
    admin_routes,
    auth_routes,
    blockchain_routes,
    candidate_routes,
    election_routes,
    voter_routes,
    vote_routes,
)
from .core.config import settings

app = FastAPI(title=settings.app_name, redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix=settings.api_v1_prefix)
app.include_router(voter_routes.router, prefix=settings.api_v1_prefix)
app.include_router(candidate_routes.router, prefix=settings.api_v1_prefix)
app.include_router(election_routes.router, prefix=settings.api_v1_prefix)
app.include_router(vote_routes.router, prefix=settings.api_v1_prefix)
app.include_router(admin_routes.router, prefix=settings.api_v1_prefix)
app.include_router(blockchain_routes.router, prefix=settings.api_v1_prefix)


@app.get("/")
def root() -> dict:
    return {"message": "Blockchain eVoting API"}
