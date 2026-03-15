"""
SQLite database layer — drop-in replacement for the previous MySQL layer.

Why a shim?
  All existing services are written against the mysql-connector-python API:
  - cursor(dictionary=True) → returns dict rows
  - %s placeholders (MySQL style)
  - conn.commit() / cursor.close()

This module provides SQLiteConnection and SQLiteCursor that mimic that API
exactly, so services don't need to change at all.
"""
import sqlite3
import re
from contextlib import contextmanager
from pathlib import Path
import threading

from .config import settings

# Database lives inside the backend/ directory — same folder as run.py
# This avoids the dual-DB / WAL desync issue caused by placing it at project root.
_backend_root = Path(__file__).resolve().parent.parent.parent  # backend/
DB_PATH = str(_backend_root / "evoting.db")


def _to_sqlite_sql(sql: str) -> str:
    """Convert MySQL-style %s placeholders to SQLite ? placeholders."""
    return sql.replace("%s", "?")


class SQLiteCursor:
    """Thin wrapper around sqlite3.Cursor that mimics mysql-connector cursor API."""

    def __init__(self, cursor: sqlite3.Cursor, dictionary: bool = False):
        self._cur = cursor
        self._dictionary = dictionary
        self.rowcount = 0

    def execute(self, sql: str, params=()) -> None:
        sql = _to_sqlite_sql(sql)
        self._cur.execute(sql, params)
        self.rowcount = self._cur.rowcount

    def fetchone(self):
        row = self._cur.fetchone()
        if row is None:
            return None
        if self._dictionary:
            cols = [d[0] for d in self._cur.description]
            return dict(zip(cols, row))
        return row

    def fetchall(self):
        rows = self._cur.fetchall()
        if self._dictionary:
            cols = [d[0] for d in self._cur.description]
            return [dict(zip(cols, r)) for r in rows]
        return rows

    def close(self):
        self._cur.close()


class SQLiteConnection:
    """Thin wrapper around sqlite3.Connection that mimics mysql-connector connection API."""

    def __init__(self, path: str):
        self._conn = sqlite3.connect(path, check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA foreign_keys=ON")

    def cursor(self, dictionary: bool = False) -> SQLiteCursor:
        return SQLiteCursor(self._conn.cursor(), dictionary=dictionary)

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        # We keep the connection open (pooling via context manager handles this)
        pass


# ---------------------------------------------------------------------------
# We must use thread-local connections because FastAPI executes synchronous
# routes in a threadpool. Sharing a single sqlite3 connection across concurrent
# threads causes native crashes and ERR_EMPTY_RESPONSE on the frontend.
# ---------------------------------------------------------------------------
_local = threading.local()


def _get_or_create_connection() -> SQLiteConnection:
    if not hasattr(_local, "conn"):
        _local.conn = SQLiteConnection(DB_PATH)
    return _local.conn


@contextmanager
def get_connection():
    conn = _get_or_create_connection()
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise


# ---------------------------------------------------------------------------
# IntegrityError re-export so services can catch it without importing sqlite3
# ---------------------------------------------------------------------------
class IntegrityError(Exception):
    pass


def _wrap_integrity(fn):
    """Decorator: convert sqlite3.IntegrityError → our IntegrityError."""
    import functools
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except sqlite3.IntegrityError as e:
            raise IntegrityError(str(e)) from e
    return wrapper


# Patch get_connection to wrap IntegrityError transparently
_original_get_connection = get_connection

@contextmanager
def get_connection():
    conn = _get_or_create_connection()
    try:
        yield conn
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise IntegrityError(str(e)) from e
    except Exception:
        conn.rollback()
        raise


# ---------------------------------------------------------------------------
# Schema initialisation
# ---------------------------------------------------------------------------
def init_tables() -> None:
    conn = _get_or_create_connection()
    cur = conn._conn.cursor()

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
    conn.commit()
    cur.close()


init_tables()
