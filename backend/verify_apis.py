import json
import urllib.request
import urllib.error
import time

BASE_URL = "http://localhost:8000/api"

TIMESTAMP = int(time.time())
EMAIL = f"testfull_{TIMESTAMP}@example.com"
PASSWORD = "TestPass123!"
USERNAME = f"testuser_{TIMESTAMP}"

COLOR_GREEN = "\033[92m"
COLOR_RED = "\033[91m"
COLOR_YELLOW = "\033[93m"
COLOR_RESET = "\033[0m"

def log(message, success=True, warning=False):
    if warning:
        color = COLOR_YELLOW
        status = "WARNING"
    elif success:
        color = COLOR_GREEN
        status = "SUCCESS"
    else:
        color = COLOR_RED
        status = "FAILED"
    print(f"{color}[{status}] {message}{COLOR_RESET}")

def make_request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}/{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        req_data = json.dumps(data).encode('utf-8') if data else None
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body
    except Exception as e:
        return 0, str(e)

def verify_apis():
    print(f"Starting Comprehensive API Verification using {EMAIL}...\n")
    
    # --- 1. ACCOUNTS ---
    print("--- 1. ACCOUNTS ---")
    reg_data = {
        "email": EMAIL, "username": USERNAME, "password": PASSWORD, "password_confirm": PASSWORD,
        "first_name": "Test", "last_name": "User", "role": "HEALTH_AUTHORITY"
    }
    status, res = make_request("POST", "auth/register/", reg_data)
    if status == 201:
        log("Register: OK")
        token = res['tokens']['access']
    else:
        log(f"Register Failed: {res}", success=False)
        return

    status, res = make_request("GET", "auth/profile/", token=token)
    log(f"Profile: {'OK' if status == 200 else 'Failed'}", success=status==200)

    # --- 2. HOSPITALS ---
    print("\n--- 2. HOSPITALS ---")
    status, hospitals = make_request("GET", "hospitals/", token=token)
    if status == 200 and len(hospitals) > 0:
        log(f"List Hospitals: OK (Found {len(hospitals)})")
        hospital_id = hospitals[0]['id']
        
        # Detail
        s, r = make_request("GET", f"hospitals/{hospital_id}/", token=token)
        log(f"Hospital Detail ({hospital_id}): {'OK' if s == 200 else 'Failed'}", success=s==200)
        
        # Hospital Inventory
        s, r = make_request("GET", f"hospitals/{hospital_id}/inventory/", token=token)
        log(f"Hospital Inventory Action: {'OK' if s == 200 else 'Failed'}", success=s==200)

        # Hospital Low Stock
        s, r = make_request("GET", f"hospitals/{hospital_id}/low_stock/", token=token)
        log(f"Hospital Low Stock Action: {'OK' if s == 200 else 'Failed'}", success=s==200)
    else:
        log("List Hospitals: No hospitals found (cannot test details)", warning=True)
        hospital_id = None

    # --- 3. INVENTORY & TRANSACTIONS ---
    print("\n--- 3. INVENTORY & TRANSACTIONS ---")
    
    # Check if we need to seed inventory
    status, inventories = make_request("GET", "hospitals/inventory/", token=token)
    
    if status == 200 and len(inventories) == 0 and hospital_id:
        print("   Seeding Inventory Data...")
        # Get a medicine first
        s, meds = make_request("GET", "medicines/", token=token)
        if s == 200 and len(meds) > 0:
            med_id = meds[0]['id']
            seed_data = {
                "hospital": hospital_id,
                "medicine": med_id,
                "current_stock": 100,
                "reorder_level": 20,
                "max_capacity": 500,
                "average_daily_usage": "10.00"
            }
            s_seed, r_seed = make_request("POST", "hospitals/inventory/", data=seed_data, token=token)
            if s_seed == 201:
                log("Seeded Inventory successfully")
                inventories = [r_seed]
            else:
                log(f"Seeding failed: {r_seed}", success=False)
    
    inventory_id = None
    if status == 200:
        log(f"List Inventory: OK (Found {len(inventories)})")
        if len(inventories) > 0:
            inventory_id = inventories[0]['id']
            
            # Retry Hospital Actions that need inventory?
            # Actually, let's just re-test the failing one for debug
            if hospital_id:
                s, r = make_request("GET", f"hospitals/{hospital_id}/low_stock/", token=token)
                if s == 200:
                    log(f"Hospital Low Stock Action (Retry): OK", success=True)
                else:
                    log(f"Hospital Low Stock Action (Retry): Failed - {s} {r}", success=False)

            # Test Global Low Stock
            s, r = make_request("GET", "hospitals/inventory/low_stock/", token=token)
            log(f"Global Low Stock: {'OK' if s == 200 else 'Failed'}", success=s==200)
    else:
        log(f"List Inventory Failed: {status} - {inventories}", success=False)

    # Transaction Test (Need an inventory item)
    if inventory_id:
        trans_data = {
            "inventory_id": inventory_id,
            "transaction_type": "ADJUSTMENT",
            "quantity": -5, # Testing our negative logic fix
            "notes": "Automated verification test"
        }
        s, r = make_request("POST", "hospitals/transactions/", data=trans_data, token=token)
        if s == 201:
             log(f"Create Transaction (Adjustment -5): OK. New Stock: {r.get('new_stock')}")
        else:
             log(f"Create Transaction Failed: {s} - {r}", success=False)
        
        s, r = make_request("GET", "hospitals/transactions/", token=token)
        log(f"List Transactions: {'OK' if s == 200 else 'Failed'}", success=s==200)

    # --- 4. MEDICINES ---
    print("\n--- 4. MEDICINES ---")
    status, meds = make_request("GET", "medicines/", token=token)
    log(f"List Medicines: {'OK' if status == 200 else 'Failed'}", success=status==200)
    
    s, r = make_request("GET", "medicines/essential/", token=token)
    log(f"Essential Medicines: {'OK' if s == 200 else 'Failed'}", success=s==200)

    # --- 5. ALERTS ---
    print("\n--- 5. ALERTS ---")
    status, alerts = make_request("GET", "alerts/", token=token)
    log(f"List Alerts: {'OK' if status == 200 else 'Failed'}", success=status==200)
    
    if status == 200 and len(alerts) > 0:
        alert_id = alerts[0]['id']
        s, r = make_request("POST", f"alerts/{alert_id}/acknowledge/", token=token)
        log(f"Acknowledge Alert ({alert_id}): {'OK' if s == 200 else 'Failed'}", success=s==200)

    # --- 6. PREDICTIONS ---
    print("\n--- 6. PREDICTIONS ---")
    # Run Global Predictions
    s, r = make_request("POST", "predictions/run/", token=token)
    log(f"Run Global Predictions: {'OK' if s == 200 else 'Failed'}", success=s==200)
    
    # Predict Single Inventory
    if inventory_id:
        pred_data = {"inventory_id": inventory_id, "days_ahead": 60}
        s, r = make_request("POST", "predictions/inventory/", data=pred_data, token=token)
        log(f"Predict Specific Inventory: {'OK' if s == 200 else 'Failed'}", success=s==200)

if __name__ == "__main__":
    verify_apis()
