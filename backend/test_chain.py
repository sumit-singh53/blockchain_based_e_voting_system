import urllib.request
import json

base_url = "http://localhost:8000/api"

req = urllib.request.Request(
    f"{base_url}/auth/login",
    data=json.dumps({"email": "admin@evoting.com", "password": "Admin@12345"}).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as response:
    token = json.loads(response.read().decode())["access_token"]

req = urllib.request.Request(f"{base_url}/blockchain/chain", headers={"Authorization": f"Bearer {token}"})
with urllib.request.urlopen(req) as response:
    chain_data = json.loads(response.read().decode())
    print(json.dumps(chain_data, indent=2))
