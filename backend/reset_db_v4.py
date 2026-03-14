import sqlite3
import json
from uuid import uuid4
from datetime import datetime, timedelta
from pathlib import Path

# Load the FastAPI DB initialization
from app.core.database import init_db

DB_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/backend/app/evoting.db")
CHAIN_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/chain.json")
MEMPOOL_PATH = Path("/Users/bishun/Desktop/blockchain_based_e_voting_system/mempool.json")

def reset():
    print("Clearing JSON files...")
    with open(MEMPOOL_PATH, "w") as f:
        json.dump([], f)
    if CHAIN_PATH.exists():
        CHAIN_PATH.unlink()
        
    print("Initializing Database Schemas...")
    init_db()

    print("Connecting to DB...")
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA foreign_keys = OFF")

    for table in ["votes", "audit_logs", "candidates", "elections"]:
        conn.execute(f"DELETE FROM {table}")

    conn.execute("DELETE FROM voters WHERE email != 'admin@evoting.com'")
    conn.execute("UPDATE voters SET has_voted = 0 WHERE email = 'admin@evoting.com'")

    conn.execute("PRAGMA foreign_keys = ON")
    conn.commit()

    print("Setting up two pristine elections...")
    e1_id = str(uuid4())
    now = datetime.utcnow()
    conn.execute(
        "INSERT INTO elections (election_id, name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        (e1_id, "Presidential Election 2026", "National vote for the President of the Republic.", "active", now.isoformat(), (now + timedelta(days=7)).isoformat())
    )
    conn.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e1_id, "Alice Smith", "Progressive Party"))
    conn.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e1_id, "Bob Jones", "Conservative Alliance"))

    e2_id = str(uuid4())
    conn.execute(
        "INSERT INTO elections (election_id, name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        (e2_id, "National Assembly Council", "Voting for the local district representative.", "active", now.isoformat(), (now + timedelta(days=7)).isoformat())
    )
    conn.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e2_id, "Charlie Brown", "Independent"))
    conn.execute("INSERT INTO candidates (candidate_id, election_id, name, party) VALUES (?, ?, ?, ?)", (str(uuid4()), e2_id, "Diana Prince", "Justice League"))

    conn.commit()
    conn.close()
    print("Reset complete.")

if __name__ == "__main__":
    reset()
