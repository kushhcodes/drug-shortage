import requests
import json

BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/auth/login/'
HOSPITALS_URL = f'{BASE_URL}/hospitals/'

# 1. Login
print("1. Logging in...")
login_payload = {'email': 'test@admin.com', 'password': 'admin123'} # Using Super Admin
try:
    auth_resp = requests.post(LOGIN_URL, json=login_payload)
    token = auth_resp.json()['access']
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    print("✅ Logged in.")
except Exception as e:
    print(f"❌ Login Error: {e}")
    exit(1)

# 2. Create Dummy Hospital to Delete
print("\n2. Creating Dummy Hospital...")
import time
payload = {
    "name": "To Delete Hospital",
    "registration_number": f"REG-DEL-{int(time.time())}", # Unique
    "hospital_type": "PRIVATE",
    "bed_capacity": 100,
    "address": "Delete Rd",
    "city": "Deletetown",
    "state": "Void",
    "pincode": "000000",
    "contact_person": "Deleter",
    "contact_email": "delete@void.com",
    "contact_phone": "0000000000"
}

resp = requests.post(HOSPITALS_URL, json=payload, headers=headers)
if resp.status_code != 201:
    print(f"❌ Creation Failed: {resp.text}")
    exit(1)

hospital_id = resp.json()['id']
print(f"✅ Created Hospital ID: {hospital_id}")

# 3. Delete It
print(f"\n3. Deleting Hospital {hospital_id}...")
del_resp = requests.delete(f"{HOSPITALS_URL}{hospital_id}/", headers=headers)

if del_resp.status_code == 204:
    print("✅ Delete Successful (204 No Content)")
else:
    print(f"❌ Delete Failed. Status: {del_resp.status_code}")
    print(f"Response: {del_resp.text}")
