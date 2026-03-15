#!/usr/bin/env python3
"""
seed_voters.py – Create sample voters for demonstration.

Usage:
  cd backend
  source venv/bin/activate
  python seed_voters.py <number_of_voters>
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

def seed_voters(count=5):
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA foreign_keys=ON")

    password = "Password123"
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    now = datetime.utcnow().isoformat()

    added = 0
    for i in range(1, count + 1):
        voter_id = str(uuid4())
        name = f"Test Voter {i}"
        email = f"voter{i}@example.com"
        
        try:
            conn.execute(
                "INSERT INTO voters (voter_id, name, email, password_hash, role, has_voted, registration_date) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (voter_id, name, email, password_hash, "voter", 0, now),
            )
            added += 1
            print(f"Created voter: {email} / pw: {password}")
        except sqlite3.IntegrityError:
            print(f"Voter {email} already exists. Skipping.")

    conn.commit()
    conn.close()

    print("=" * 50)
    print(f"  Successfully seeded {added} sample voters!")
    print("=" * 50)

if __name__ == "__main__":
    count = 10
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            pass
    seed_voters(count)
