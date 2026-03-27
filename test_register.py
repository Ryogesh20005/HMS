import requests
import json

# Test patient registration
payload = {
    "username": "patient123",
    "email": "patient123@test.com",
    "password": "Patient@123",
    "first_name": "John",
    "last_name": "Patient",
    "role": "patient"
}

print("Testing Patient Registration...")
response = requests.post(
    "http://localhost:8000/api/register/",
    json=payload,
    headers={"Content-Type": "application/json"}
)

print(f"Status Code: {response.status_code}")
print("Response:")
print(json.dumps(response.json(), indent=2))

# Now try to login with the registered credentials
if response.status_code == 201:
    print("\n" + "="*50)
    print("Testing Login with registered credentials...")
    login_payload = {
        "username": "patient123",
        "password": "Patient@123"
    }
    
    login_response = requests.post(
        "http://localhost:8000/api/login/",
        json=login_payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Login Status Code: {login_response.status_code}")
    print("Login Response:")
    print(json.dumps(login_response.json(), indent=2))
