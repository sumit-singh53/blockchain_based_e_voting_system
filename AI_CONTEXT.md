# 🤖 AI Context & Project Overview

This document serves as a "brain dump" and comprehensive onboarding context for any AI assistant interacting with this monorepo. **AI Agents: Read this file FIRST before undertaking any task.**

## 1. Project Identity
- **Name:** Blockchain-based e-Voting System
- **Path:** `/Users/bishun/Desktop/blockchain_based_e_voting_system`
- **Goal:** Provide a secure, verifiable, and transparent electronic voting platform. 

## 2. Tech Stack & Architecture
This is a monorepo consisting of three core interconnected layers:
1. **Frontend (`/frontend`)**: React 18, Vite, Tailwind CSS, React Router, Axios. 
   - *State Management:* Context API (`AuthContext`, `ElectionContext`).
   - *Routing:* Separated into `/auth` (Login/Register), `/admin` (Dashboards), `/voter` (Voting Flows).
2. **Backend (`/backend`)**: FastAPI, Python 3.10+, Pydantic. 
   - *Database:* SQLite database (`evoting.db` in project root). Originally MySQL, we migrated to SQLite to reduce dependencies.
   - *Auth:* PyJWT for stateless bearer tokens (access and refresh logic).
3. **Blockchain Layer (`/blockchain`)**: Custom Python implementation.
   - *Features:* Proof-of-Work consensus, custom cryptographic hashing, `Transaction` structures matching vote casts.
   - *Persistence:* Uses `chain.json` and `mempool.json` in the project root to persist blocks and pending transactions.

## 3. Current Implementation State *[as of March 2026]*
- **Database Operations:** Fully integrated. Candidates and Votes are stored relationsally in SQLite while cryptographically secured in the blockchain tree.
- **Vote Flow:** A Voter authenticates, casts a vote `/votes/cast`. The vote is validated, cryptographically signed, stored in the SQLite `votes` table, and appended securely to the Blockchain mempool (`mempool.json`).
- **Mining Flow:** An Admin can call `/blockchain/mine` to bundle mempool transactions into a new Block, run the Proof-of-Work, and append it to `chain.json`. The SQLite table is then updated with the resulting `tx_hash`.
- **Frontend Interacting:** Hooks (`useVoting`, `useCandidates`, `useElections`) and Axios interceptors seamlessly inject tokens and process these endpoints.

## 4. How to Run the Ecosystem
**Terminal 1: Backend**
```bash
cd backend
source venv/bin/activate
python run.py
# Running on http://localhost:8000
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

## 5. Coding Standards for the AI
1. **Frontend:** Do not use `fetch`, strictly use the centralized `apiClient` (`/frontend/src/services/api.js`) to handle token lifecycles implicitly. Rely on Lucide React for icons and Tailwind CSS for styling.
2. **Backend:** Follow FastAPI dependency injection and controller/service separation. 
3. **Database:** Only interact with SQLite (`evoting.db`). Use exact explicit columns and `conn.commit()` after cursors when writing SQL. Avoid generic SQLAlchemy ORM paradigms as we are using raw SQL queries with `cursor.execute()`. 
4. **Tooling:** Always assume macOS (zsh) environment constraints.

---
*End of Context payload. If an objective is requested by the User, confirm understanding of this document before navigating directories blindly.*
