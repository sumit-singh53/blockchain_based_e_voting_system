import requests

url = "http://localhost:8000/api/auth/login"
payload = {
    "email": "admin@evoting.com",
    "password": "Admin@12345"
}
response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
