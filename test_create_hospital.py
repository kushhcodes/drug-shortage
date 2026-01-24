import requests
import json

# Setup
BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/auth/login/'
HOSPITALS_URL = f'{BASE_URL}/hospitals/'

# 1. Login to get token
print("1. Logging in...")
login_payload = {'email': 'test@admin.com', 'password': 'admin123'}
try:
    auth_resp = requests.post(LOGIN_URL, json=login_payload)
    if auth_resp.status_code != 200:
        print(f"❌ Login Failed: {auth_resp.text}")
        exit(1)
    
    token = auth_resp.json()['access']
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    print("✅ Logged in.")

except Exception as e:
    print(f"❌ Connection error: {e}")
    exit(1)

# 2. Try Create Hospital
print("\n2. Creating Hospital...")
payload = {
    "name": "Mynk Clinic Debug",
    "registration_number": "REG-DEBUG-001",
    "hospital_type": "PRIVATE",
    "bed_capacity": 100,
    "address": "Karadva - Dindoli Rd",
    "city": "Surat",
    "state": "Gujarat",
    "pincode": "394210",
    "contact_person": "Mynk Chn",
    "contact_email": "mynk@gmail.com",
    "contact_phone": "123456789012"
}

resp = requests.post(HOSPITALS_URL, json=payload, headers=headers)

if resp.status_code == 201:
    print("✅ Hospital Created Successfully!")
    print(json.dumps(resp.json(), indent=2))
else:
    print(f"❌ Failed to Create Hospital. Status: {resp.status_code}")
    print(f"Response: {resp.text}")
