import requests
import json

BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/auth/login/'
INVENTORY_URL = f'{BASE_URL}/hospitals/inventory/'
PREDICT_URL = f'{BASE_URL}/predictions/batch-predict/'

# 1. Login
print("1. Logging in...")
try:
    auth_resp = requests.post(LOGIN_URL, json={'email': 'test@admin.com', 'password': 'admin123'})
    token = auth_resp.json()['access']
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    print("✅ Logged in.")
except Exception as e:
    print(f"❌ Login Failed: {e}")
    exit(1)

# 2. Fetch Inventory
print("\n2. Fetching Inventory...")
inv_resp = requests.get(INVENTORY_URL, headers=headers)
if inv_resp.status_code != 200:
    print(f"❌ Failed to fetch inventory: {inv_resp.text}")
    exit(1)

inventory = inv_resp.json()
print(f"✅ Found {len(inventory)} inventory items.")

if len(inventory) == 0:
    print("❌ ERROR: Inventory is empty. Predictions will not run.")
    exit(1)

# 3. Construct Payload (frontend logic)
print("\n3. Constructing Payload...")
payload = []
for item in inventory:
    # Logic from DashboardPredictions.tsx
    daily = float(item.get('average_daily_usage', 1))
    if daily == 0: daily = 1 # Fallback
    
    payload.append({
        'medicine_id': item['medicine'], # Frontend uses item.medicine (ID)
        'hospital_id': item['hospital'],
        'current_stock': item['current_stock'],
        'daily_consumption': daily,
        'reorder_level': item['reorder_level']
    })

print(f"   Payload has {len(payload)} items.")
print(f"   Sample: {payload[0]}")

# 4. Call Predict API
print("\n4. Calling Batch Predict API...")
pred_resp = requests.post(PREDICT_URL, json={'inventories': payload}, headers=headers)

if pred_resp.status_code == 200:
    data = pred_resp.json()
    print("✅ API Success!")
    print(f"   Success Flag: {data.get('success')}")
    print(f"   Total Predictions: {data.get('total_predictions')}")
    
    preds = data.get('predictions', [])
    if len(preds) > 0:
        print(f"   First Prediction: {preds[0]['risk_level']} (Prob: {preds[0]['shortage_probability']})")
    else:
        print("   ⚠️ Prediction list is empty!")
else:
    print(f"❌ API Failed: {pred_resp.status_code}")
    print(f"Response: {pred_resp.text}")
