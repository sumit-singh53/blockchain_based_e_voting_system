#!/usr/bin/env python3
"""
seed_admin.py – Create or reset the admin account.

Usage:
  cd backend
  source venv/bin/activate
  python seed_admin.py

The admin credentials will be printed to stdout.
"""
import sys
from pathlib import Path

# Ensure project root is on sys.path so `blockchain` package is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import sqlite3
import bcrypt
from datetime import datetime
from uuid import uuid4

DB_PATH = Path(__file__).resolve().parent / "evoting.db"

ADMIN_EMAIL    = "admin@evoting.com"
ADMIN_PASSWORD = "Admin@12345"
ADMIN_NAME     = "System Administrator"

def seed():
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA foreign_keys=OFF")

    # Ensure the voters table exists (in case DB was just created)
    conn.executescript("""
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
            description  TEXT NULL
        );
        CREATE TABLE IF NOT EXISTS votes (
            vote_id      TEXT PRIMARY KEY,
            election_id  TEXT NOT NULL,
            voter_id     TEXT NOT NULL,
            candidate_id TEXT NOT NULL,
            tx_hash      TEXT NULL,
            created_at   TEXT NOT NULL,
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

    conn.execute("PRAGMA foreign_keys=ON")

    # Remove any existing admin account with this email
    conn.execute("DELETE FROM voters WHERE email = ?", (ADMIN_EMAIL,))

    password_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
    voter_id = str(uuid4())
    now = datetime.utcnow().isoformat()

    conn.execute(
        "INSERT INTO voters (voter_id, name, email, password_hash, role, has_voted, registration_date) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (voter_id, ADMIN_NAME, ADMIN_EMAIL, password_hash, "admin", 0, now),
    )
    conn.commit()
    conn.close()

    print("=" * 50)
    print("  Admin account seeded successfully!")
    print("=" * 50)
    print(f"  Email    : {ADMIN_EMAIL}")
    print(f"  Password : {ADMIN_PASSWORD}")
    print(f"  Role     : admin")
    print(f"  ID       : {voter_id}")
    print("=" * 50)

if __name__ == "__main__":
    seed()
