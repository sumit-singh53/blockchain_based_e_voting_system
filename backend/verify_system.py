"""
verify_system.py — End-to-end API smoke test for the e-voting backend.
Run from: backend/
  python verify_system.py
"""
import urllib.request
import urllib.error
import json
from pathlib import Path

BASE = "http://127.0.0.1:8000/api"

def post_json(endpoint, body, token=None):
    data = json.dumps(body).encode()
    req = urllib.request.Request(f"{BASE}{endpoint}", data=data,
                                  headers={"Content-Type": "application/json"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def get_json(endpoint, token=None):
    req = urllib.request.Request(f"{BASE}{endpoint}")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def check(label, cond, detail=""):
    marker = "✅" if cond else "❌"
    print(f"  {marker} {label}" + (f" — {detail}" if detail else ""))
    return cond

def main():
    print("\n=== E-Voting System Verification ===\n")
    errors = 0

    # 1. Elections reachable + description field present
    print("[1] Elections Endpoint")
    elections = get_json("/elections")
    ok = check("Returns 2 elections", len(elections) == 2, f"got {len(elections)}")
    ok &= check("description field present", all(e.get("description") is not None for e in elections))
    errors += 0 if ok else 1

    # 2. Admin login
    print("\n[2] Admin Login")
    try:
        resp = post_json("/auth/login", {"email": "admin@evoting.com", "password": "Admin@12345"})
        ok = check("Login succeeds", "access_token" in resp)
        admin_token = resp.get("access_token", "")
        ok &= check("Role is admin", resp.get("role") == "admin")
    except Exception as e:
        print(f"  ❌ Login failed: {e}")
        admin_token = ""
        errors += 1

    # 3. Admin dashboard stats
    print("\n[3] Admin Dashboard Stats")
    if admin_token:
        stats = get_json("/admin/dashboard", admin_token)
        check("2 elections", stats["total_elections"] == 2, f"{stats['total_elections']}")
        check("100 votes cast", stats["total_votes_cast"] == 100, f"{stats['total_votes_cast']}")
        check("50 voters who voted", stats["voters_who_voted"] == 50, f"{stats['voters_who_voted']}")
        check("Blockchain valid", stats["chain_valid"] is True)
        check("Voters excludes admin (100)", stats["total_voters"] == 100, f"{stats['total_voters']}")
        check("0 pending transactions", stats["pending_transactions"] == 0, f"{stats['pending_transactions']}")

    # 4. Voter login
    print("\n[4] Voter Login")
    try:
        resp = post_json("/auth/login", {"email": "simvoter_1_A@example.com", "password": "SimPassword123!"})
        voter_token = resp.get("access_token", "")
        ok = check("Voter login OK", bool(voter_token))
    except Exception as e:
        print(f"  ❌ Voter login failed: {e}")
        voter_token = ""
        errors += 1

    # 5. Voter sees same elections
    print("\n[5] Voter Sees Elections (sync with admin)")
    if voter_token:
        ve = get_json("/elections", voter_token)
        check("Voter sees 2 elections (same as admin)", len(ve) == 2, f"{len(ve)}")

    # 6. Vote results visible
    print("\n[6] Election Results")
    if voter_token and elections:
        eid = elections[0]["election_id"]
        r = get_json(f"/votes/results/{eid}", voter_token)
        check(f"Results for '{r['election_name']}'", True)
        check("Has candidate results", len(r.get("results", [])) >= 2)
        check("Turnout > 0%", r["turnout_percentage"] > 0, f"{r['turnout_percentage']}%")
        for c in r["results"]:
            print(f"     {c['candidate_name']}: {c['votes']} votes ({c['percentage']}%)")

    # 7. File locations
    print("\n[7] File Locations")
    root = Path(__file__).parent
    check("evoting.db in backend/", (root / "evoting.db").exists())
    check("chain.json in backend/", (root / "chain.json").exists())
    check("NO stale root evoting.db", not (root.parent / "evoting.db").exists())
    check("NO stale root chain.json", not (root.parent / "chain.json").exists())

    print(f"\n{'All checks passed ✅' if errors == 0 else f'{errors} sections had errors ❌'}\n")

if __name__ == "__main__":
    main()
