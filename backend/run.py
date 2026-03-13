import sys
from pathlib import Path

# Ensure the project root (parent of `backend/`) is on sys.path so the
# top-level `blockchain` package can be resolved when running via uvicorn.
_project_root = Path(__file__).resolve().parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
