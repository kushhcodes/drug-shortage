import os
import django
import sys
import json
import requests

# Setup Django Environment to check DB directly
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospitals.models import Inventory
from predictions.forecaster import predictor_instance

def debug_system():
    print("🔍 DIAGNOSTIC REPORT")
    print("====================")
    
    # 1. Check Database
    count = Inventory.objects.count()
    print(f"1. Database Inventory Count: {count}")
    
    if count == 0:
        print("❌ CRITICAL: No inventory items found. Run 'python seed_data.py'!")
        return

    # 2. Check ML Model Loading
    print(f"\n2. ML Model Status:")
    if predictor_instance.model:
        print("✅ Model is LOADED in memory.")
    else:
        print("⚠️ Model is NOT loaded. Attempting load...")
        predictor_instance.load_model()
        if predictor_instance.model:
            print("✅ Model loaded successfully.")
        else:
            print("❌ FAILED to load model. Training new one...")
            try:
                predictor_instance.train_model()
                print("✅ Model trained and loaded.")
            except Exception as eobj:
                print(f"❌ Training failed: {eobj}")
                return

    # 3. Simulate Frontend Payload construction
    print(f"\n3. Simulating Frontend Payload Construction:")
    inventory_items = Inventory.objects.all()[:5] # Take 5 items
    payload = []
    for item in inventory_items:
        daily_usage = float(item.average_daily_usage) if item.average_daily_usage else 1.0
        payload.append({
            'medicine_id': item.medicine.id,
            'hospital_id': item.hospital.id,
            'current_stock': item.current_stock,
            'daily_consumption': daily_usage,
            'reorder_level': item.reorder_level
        })
    
    print(f"   Sample Payload Item: {payload[0]}")
    
    # 4. Test Logic Direct Call
    print(f"\n4. Testing Direct Logic Call (bypassing API view):")
    try:
        preds = predictor_instance.batch_predict(payload)
        print(f"   ✅ Direct Prediction Success. Got {len(preds)} results.")
        print(f"   Sample Result: {preds[0]['risk_level']}")
    except Exception as e:
        print(f"   ❌ Direct Prediction Logic Failed: {e}")

    # 5. Test HTTP API Endpoint
    print(f"\n5. Testing HTTP API Call (http://127.0.0.1:8000/api/predictions/batch-predict/):")
    # We need a token for this usually, but let's see if we can get a login token first
    try:
        # Login
        auth_resp = requests.post('http://127.0.0.1:8000/api/auth/login/', json={
            'email': 'test@admin.com', 
            'password': 'admin123'
        })
        
        if auth_resp.status_code != 200:
            print(f"   ❌ Login Failed: {auth_resp.status_code} - {auth_resp.text}")
            # Try registering if login fails (maybe DB was wiped)
            print("   ⚠️ Attempting to recreate admin user...")
            from django.contrib.auth import get_user_model
            User = get_user_model()
            if not User.objects.filter(email='test@admin.com').exists():
                User.objects.create_superuser('test_admin', 'test@admin.com', 'admin123')
                print("   ✅ Created admin user. Re-trying login...")
                auth_resp = requests.post('http://127.0.0.1:8000/api/auth/login/', json={
                    'email': 'test@admin.com', 
                    'password': 'admin123'
                })
        
        if auth_resp.status_code == 200:
            token = auth_resp.json()['access']
            print("   ✅ Login Successful.")
            
            # Call Batch Predict
            headers = {'Authorization': f'Bearer {token}'}
            api_payload = {'inventories': payload}
            
            resp = requests.post(
                'http://127.0.0.1:8000/api/predictions/batch-predict/',
                json=api_payload,
                headers=headers
            )
            
            print(f"   API Response Code: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print(f"   ✅ API returned success: {data.get('success')}")
                print(f"   Total predictions in response: {data.get('total_predictions')}")
            else:
                print(f"   ❌ API Request Failed: {resp.text}")
        else:
             print("   ❌ Could not authenticate.")

    except Exception as e:
        print(f"   ❌ Connection Failed (Is server running?): {e}")

if __name__ == "__main__":
    debug_system()
