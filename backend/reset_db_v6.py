import sqlite3
import json
from uuid import uuid4
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/backend/evoting.db")
CHAIN_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/backend/chain.json")
MEMPOOL_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/backend/mempool.json")

def reset():
    print("Clearing JSON files...")
    with open(MEMPOOL_PATH, "w") as f:
        json.dump([], f)
    if CHAIN_PATH.exists():
        CHAIN_PATH.unlink()

    print("Connecting to DB...")
    # Ensure directory exists
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA foreign_keys = OFF")

    print("Dropping and recreating schema...")
    cur = conn.cursor()
    
    # Just recreate them manually to be 100% sure we aren't hitting the FastAPI thread-local block
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS voters (
            voter_id          TEXT PRIMARY KEY,
            name              TEXT NOT NULL,
            email             TEXT NOT NULL UNIQUE,
            password_hash     TEXT NOT NULL,
            role              TEXT NOT NULL DEFAULT 'voter',
            has_voted         INTEGER NOT NULL DEFAULT 0,
            registration_date TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS elections (
            election_id TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            description TEXT NULL,
            status      TEXT NOT NULL DEFAULT 'draft',
            start_date  TEXT NULL,
            end_date    TEXT NULL
        );

        CREATE TABLE IF NOT EXISTS candidates (
            candidate_id TEXT PRIMARY KEY,
            election_id  TEXT NOT NULL,
            name         TEXT NOT NULL,
            party        TEXT NULL,
            description  TEXT NULL,
            FOREIGN KEY (election_id) REFERENCES elections(election_id)
        );

        CREATE TABLE IF NOT EXISTS votes (
            vote_id      TEXT PRIMARY KEY,
            election_id  TEXT NOT NULL,
            voter_id     TEXT NOT NULL,
            candidate_id TEXT NOT NULL,
            tx_hash      TEXT NULL,
            created_at   TEXT NOT NULL,
            FOREIGN KEY (voter_id)     REFERENCES voters(voter_id),
            FOREIGN KEY (election_id)  REFERENCES elections(election_id),
            FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id),
            UNIQUE (voter_id, election_id)
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            log_id         TEXT PRIMARY KEY,
            actor_voter_id TEXT NULL,
            actor_role     TEXT NULL,
            action         TEXT NOT NULL,
            entity_type    TEXT NOT NULL,
            entity_id      TEXT NULL,
            details_json   TEXT NOT NULL,
            created_at     TEXT NOT NULL
        );
    """)

    cur.execute("DELETE FROM votes")
    cur.execute("DELETE FROM audit_logs")
    cur.execute("DELETE FROM candidates")
    cur.execute("DELETE FROM elections")
    cur.execute("DELETE FROM voters WHERE email != 'admin@evoting.com'")
    cur.execute("UPDATE voters SET has_voted = 0 WHERE email = 'admin@evoting.com'")

    conn.execute("PRAGMA foreign_keys = ON")
    conn.commit()

    print("Setting up two pristine elections...")
    e1_id = str(uuid4())
    now = datetime.utcnow()
    cur.execute(
        "INSERT INTO elections (election_id, name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        (e1_id, "Presidential Election 2026", "National vote for the President of the Republic.", "active", now.isoformat(), (now + timedelta(days=7)).isoformat())
    )
    cur.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e1_id, "Alice Smith", "Progressive Party"))
    cur.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e1_id, "Bob Jones", "Conservative Alliance"))

    e2_id = str(uuid4())
    cur.execute(
        "INSERT INTO elections (election_id, name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        (e2_id, "National Assembly Council", "Voting for the local district representative.", "active", now.isoformat(), (now + timedelta(days=7)).isoformat())
    )
    cur.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e2_id, "Charlie Brown", "Independent"))
    cur.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e2_id, "Diana Prince", "Libertarian Party"))

    conn.commit()
    conn.close()
    print("Reset complete.")

if __name__ == "__main__":
    reset()
