# Repository Structure

This document explains the purpose of the main folders and important files in the `blockchain_based_e_voting_system` repository.

## Root level

| Path | Purpose |
|------|---------|
| `README.md` | Main project overview, setup notes, and repository summary |
| `project status.md` | Progress snapshot, milestones, risks, and next steps |
| `docker-compose.yml` | Starts frontend and backend together for local development |
| `.env.example` | Template for required environment variables |
| `LICENSE` | Repository license |
| `docs/` | Supporting documentation |
| `scripts/` | Reserved for utility and automation scripts |
| `tests/` | Reserved for automated testing |

## `backend/`

The backend is a FastAPI service responsible for authentication, elections, voters, candidates, votes, admin actions, and blockchain-related endpoints.

### Important files

| Path | Purpose |
|------|---------|
| `backend/run.py` | Local entry point for starting the FastAPI app with Uvicorn |
| `backend/requirements.txt` | Python dependencies |
| `backend/Dockerfile` | Container build file for the backend service |

### `backend/app/`

| Path | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI application setup, router registration, and CORS configuration |
| `backend/app/api/` | API route definitions by domain |
| `backend/app/controllers/` | Request handlers coordinating API calls and service logic |
| `backend/app/services/` | Business logic layer |
| `backend/app/models/` | Internal data models |
| `backend/app/schemas/` | Validation and serialization schemas |
| `backend/app/core/` | Configuration, database, auth/security, and dependency helpers |
| `backend/app/utils/` | Reusable helper functions and validators |

### API layer

| File | Purpose |
|------|---------|
| `auth_routes.py` | Login/authentication endpoints |
| `voter_routes.py` | Voter-related endpoints |
| `candidate_routes.py` | Candidate endpoints |
| `election_routes.py` | Election lifecycle endpoints |
| `vote_routes.py` | Vote submission and vote-related endpoints |
| `admin_routes.py` | Administrative endpoints |
| `blockchain_routes.py` | Blockchain inspection/integration endpoints |

### Core layer

| File | Purpose |
|------|---------|
| `config.py` | Environment-based settings |
| `database.py` | Database connection utilities |
| `security.py` | Password hashing, JWT, and security helpers |
| `dependencies.py` | Shared dependency injection helpers |
| `chain_instance.py` | Access to the blockchain instance from the backend |

## `frontend/`

The frontend is a React + Vite application intended for admins, voters, and public users.

### Important files

| Path | Purpose |
|------|---------|
| `frontend/package.json` | Frontend scripts and dependencies |
| `frontend/index.html` | Main HTML entry point |
| `frontend/vite.config.js` | Vite configuration |
| `frontend/tailwind.config.js` | Tailwind CSS configuration |
| `frontend/postcss.config.js` | PostCSS configuration |

### `frontend/src/`

| Path | Purpose |
|------|---------|
| `App.jsx` | Root application component |
| `main.jsx` | React bootstrap entry point |
| `index.css` | Global styles |
| `components/` | Reusable components |
| `pages/` | Route-level pages grouped by user role or feature |
| `routes/` | Application routing and protected route handling |
| `context/` | Shared React context providers |
| `hooks/` | Custom React hooks |
| `services/` | HTTP/API integration layer |
| `utils/` | Frontend helper utilities |
| `assets/` | Images and icons |

### Frontend feature grouping

| Folder | Purpose |
|--------|---------|
| `pages/admin/` | Admin dashboards and management views |
| `pages/auth/` | Login, registration, and authentication pages |
| `pages/public/` | Public-facing pages |
| `pages/voter/` | Voter-specific interfaces |
| `components/blockchain/` | Blockchain-related UI widgets |
| `components/layout/` | Shared layout building blocks |
| `components/ui/` | Generic UI components |
| `components/voting/` | Voting-specific components |

## `blockchain/`

This package contains the custom blockchain implementation used to model blocks, transactions, consensus, and chain persistence.

### Main folders

| Path | Purpose |
|------|---------|
| `blockchain/core/` | Core blockchain entities such as blocks, transactions, and the chain |
| `blockchain/consensus/` | Consensus and mining logic |
| `blockchain/storage/` | Chain persistence mechanisms |
| `blockchain/utils/` | Cryptographic and hashing helpers |

### Important files

| File | Purpose |
|------|---------|
| `core/block.py` | Block definition |
| `core/blockchain.py` | Blockchain management logic |
| `core/transaction.py` | Transaction model |
| `consensus/proof_of_work.py` | Proof-of-work mining implementation |
| `storage/chain_storage.py` | Chain storage abstraction |
| `utils/crypto.py` | Cryptographic helper utilities |

## `infrastructure/`

| Path | Purpose |
|------|---------|
| `infrastructure/frontend.Dockerfile` | Docker image definition for the frontend development/runtime container |

## Notes

- `__pycache__/` folders are generated artifacts and are not part of the source design.
- The repository is structured as a monorepo so frontend, backend, and blockchain code can evolve together.
- Some modules are scaffolds for future implementation, so the directory structure is more complete than the current feature set.
