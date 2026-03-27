import requests
import json

# Register as admin
print("=" * 50)
print("REGISTERING AS ADMIN")
print("=" * 50)

admin_payload = {
    "username": "admin_user",
    "email": "admin@hospital.com",
    "password": "Admin@123",
    "first_name": "Hospital",
    "last_name": "Admin",
    "role": "admin"
}

response = requests.post(
    "http://localhost:8000/api/register/",
    json=admin_payload,
    headers={"Content-Type": "application/json"}
)

print(f"Registration Status: {response.status_code}")
if response.status_code == 201:
    data = response.json()
    print(f"✓ Admin registered successfully")
    print(f"  Username: {data['user']['username']}")
    print(f"  Email: {data['user']['email']}")
    print(f"  Role: {data['user']['role']}")
    
    # Now test login
    print("\n" + "=" * 50)
    print("TESTING LOGIN AS ADMIN")
    print("=" * 50)
    
    login_payload = {
        "username": "admin_user",
        "password": "Admin@123"
    }
    
    login_response = requests.post(
        "http://localhost:8000/api/login/",
        json=login_payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Login Status: {login_response.status_code}")
    if login_response.status_code == 200:
        login_data = login_response.json()
        print(f"✓ Login successful!")
        print(f"  Username: {login_data['user']['username']}")
        print(f"  Role: {login_data['user']['role']}")
        print(f"\n✓ You can now login at http://localhost:3000 with:")
        print(f"  Username: admin_user")
        print(f"  Password: Admin@123")
    else:
        print(f"✗ Login failed: {login_response.json()}")
else:
    print(f"✗ Registration failed: {response.status_code}")
    print(f"  Error: {response.json()}")
