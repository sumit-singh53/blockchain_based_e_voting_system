import urllib.request
import json
import urllib.error

base_url = "http://localhost:8000/api"

# Login
req = urllib.request.Request(
    f"{base_url}/auth/login",
    data=json.dumps({"email": "admin@evoting.com", "password": "Admin@12345"}).encode(),
    headers={"Content-Type": "application/json"}
)
try:
    with urllib.request.urlopen(req) as response:
        login_res = json.loads(response.read().decode())
        token = login_res["access_token"]
except urllib.error.HTTPError as e:
    print(f"Login failed: {e.code} {e.read().decode()}")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# Get Dashboard
req = urllib.request.Request(f"{base_url}/admin/dashboard", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print("Dashboard Status: 200")
        print("Dashboard Response:", response.read().decode())
except urllib.error.HTTPError as e:
    print("Dashboard failed:", e.code, e.read().decode())

# Get Recent Votes
req = urllib.request.Request(f"{base_url}/admin/recent-votes", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print("Votes Status: 200")
        print("Votes Response:", response.read().decode())
except urllib.error.HTTPError as e:
    print("Votes failed:", e.code, e.read().decode())
