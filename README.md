# Blockchain-based e-Voting System

A full-stack monorepo for a **transparent, secure, and auditable electronic voting platform** built with a React frontend, a FastAPI backend, and a custom blockchain module for vote integrity experiments.

This project is organized to support the complete voting lifecycle:
- voter and admin workflows,
- election and candidate management,
- vote recording APIs,
- blockchain inspection and verification,
- containerized local development.

> Current maturity: the repository already includes the core project structure and several backend modules, while some features are still scaffolded or in progress.

## What this repository contains

### Core modules

| Module | Purpose |
|--------|---------|
| `frontend/` | React + Vite + Tailwind application for voter, admin, and public-facing interfaces |
| `backend/` | FastAPI application exposing authentication, voter, election, candidate, vote, admin, and blockchain APIs |
| `blockchain/` | Python blockchain primitives, proof-of-work logic, transaction models, and storage helpers |
| `infrastructure/` | Docker build assets for local deployment |
| `docs/` | Supporting documentation for repository structure and future architecture notes |
| `scripts/` | Automation helpers reserved for future setup and maintenance tasks |
| `tests/` | Placeholder for unit, integration, and end-to-end tests |

### Highlights

- **Frontend stack:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend stack:** FastAPI, Pydantic v2, PyJWT, bcrypt, MySQL connector
- **Blockchain layer:** block, transaction, proof-of-work, hashing, and storage abstractions
- **DevOps readiness:** Docker Compose setup for frontend and backend services

## Repository explanation

If you are opening this project for the first time, here is the quick mental map:

- `frontend/src/pages/` contains page-level UI separated by audience (`admin/`, `auth/`, `public/`, `voter/`)
- `frontend/src/components/` contains reusable UI, layout, blockchain, and voting widgets
- `frontend/src/context/` stores shared state providers such as authentication and election context
- `frontend/src/services/` centralizes API communication for auth, candidates, blockchain, and other features
- `backend/app/api/` defines the HTTP routes
- `backend/app/controllers/` handles request orchestration between routes and services
- `backend/app/services/` contains business logic for auth, elections, voters, admin features, and blockchain interactions
- `backend/app/models/` and `backend/app/schemas/` define data models and request/response contracts
- `backend/app/core/` stores configuration, dependencies, database wiring, and security helpers
- `blockchain/core/` contains the main blockchain domain classes such as blocks and transactions
- `blockchain/consensus/` contains proof-of-work logic
- `blockchain/storage/` is reserved for persistence of the chain

For a more detailed folder-by-folder explanation, see [`docs/REPOSITORY_STRUCTURE.md`](docs/REPOSITORY_STRUCTURE.md).

## Project structure

```text
blockchain_based_e_voting_system/
├── backend/                # FastAPI backend service
├── blockchain/             # Custom blockchain implementation
├── docs/                   # Repository documentation
├── frontend/               # React client application
├── infrastructure/         # Docker and deployment assets
├── scripts/                # Helper scripts
├── tests/                  # Automated tests (planned/partial)
├── .env.example            # Example environment variables
├── docker-compose.yml      # Local multi-service orchestration
├── project status.md       # Delivery snapshot and roadmap
└── README.md               # Main project overview
```

## Local setup

### 1. Prepare environment variables

Create a `.env` file in the project root from `.env.example` and update values as needed.

Important variables:

| Variable | Description |
|----------|-------------|
| `API_HOST` | Backend bind host |
| `API_PORT` | Backend port |
| `SECRET_KEY` | JWT signing key |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime |
| `MYSQL_HOST` | MySQL host |
| `MYSQL_PORT` | MySQL port |
| `MYSQL_USER` | MySQL user |
| `MYSQL_PASSWORD` | MySQL password |
| `MYSQL_DATABASE` | Database name |
| `VITE_API_BASE_URL` | Frontend API base URL |

### 2. Prepare the database

Make sure MySQL is running and create a database named `blockchain-database` unless you change the value in `.env`.

### 3. Install dependencies

#### Backend

- Create a virtual environment inside `backend/`
- Install packages from `backend/requirements.txt`

#### Frontend

- Install packages from `frontend/package.json`

### 4. Start the application

You can run the system in either of these ways:

- **Locally**: run the FastAPI backend and Vite frontend separately
- **With Docker**: use `docker-compose.yml` to launch both services together

By default:
- frontend runs on `http://localhost:5173`
- backend runs on `http://localhost:8000`
- API base path is `/api`

## Current implementation status

The repository already includes:

- frontend scaffolding for auth, admin, voter, and public routes,
- backend route/controller/service layers for major voting features,
- a custom blockchain package with core entities and mining logic,
- containerization support for local development.

Areas that are still evolving include deeper API integration, automated tests, vote finalization flows, blockchain persistence, and production hardening.

You can also review the delivery snapshot in [`project status.md`](project%20status.md).

## Suggested GitHub repository description

If you want a short description for the GitHub repository “About” section, this works well:

**Blockchain-based e-voting system using React, FastAPI, MySQL, and a custom blockchain layer for transparent and auditable digital elections.**

## License

This project is licensed under the terms described in [`LICENSE`](LICENSE).
