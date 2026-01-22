# 🚀 Drug Shortage Prediction System - Complete Testing Checklist

## Pre-Demo Testing Guide

Follow this checklist to verify everything is working before your hackathon demo.

---

## ✅ STEP 1: Server Status Check (5 min)

### Backend Server (Django)
```bash
# Check if running on port 8000
lsof -i :8000

# If not running, start it:
cd /Users/khushalpatil/Desktop/Drug/backend
source ../env/bin/activate
python manage.py runserver
```

**Expected Output**: 
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Frontend Server (React/Vite)
```bash
# Check if running on port 8080
lsof -i :8080

# If not running, start it:
cd /Users/khushalpatil/Desktop/Drug/frontend
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
```

**✓ Both servers must be running simultaneously**

---

## ✅ STEP 2: Database Connection Test (3 min)

```bash
cd /Users/khushalpatil/Desktop/Drug/backend
python manage.py shell
```

**Run in Python shell**:
```python
from django.db import connection
connection.ensure_connection()
print("✅ Database connected!")

from hospitals.models import Hospital
print(f"Hospitals in DB: {Hospital.objects.count()}")

from medicines.models import Medicine
print(f"Medicines in DB: {Medicine.objects.count()}")

from hospitals.models import Inventory
print(f"Inventory items: {Inventory.objects.count()}")

exit()
```

**Expected Results**:
- ✅ Database connected!
- At least 1 hospital ("sevashram")
- Medicine and Inventory counts displayed

**If issues**: Check `.env` file has `DATABASE_URL` set

---

## ✅ STEP 3: Authentication Test (5 min)

### Test 1: Login via Browser
1. Open browser: `http://localhost:8080/login`
2. Enter credentials:
   - Email: `test@admin.com`
   - Password: `admin123`
3. Click "Sign In"

**Expected**: 
- ✅ Redirects to `/dashboard`
- ✅ Shows email in top-right: `test@admin.com`
- ✅ Dashboard loads with stats

**If login fails**: 
```bash
# Create test user
cd backend
python manage.py shell -c "
from accounts.models import User
u, created = User.objects.get_or_create(
    email='test@admin.com',
    defaults={'username': 'testadmin', 'is_superuser': True, 'is_staff': True, 'role': 'SUPER_ADMIN'}
)
u.set_password('admin123')
u.save()
print('✅ Test user ready: test@admin.com / admin123')
"
```

### Test 2: API Authentication
```bash
# Get auth token
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@admin.com","password":"admin123"}'
```

**Expected**: JSON response with `access` and `refresh` tokens

---

## ✅ STEP 4: Hospital Management Test (5 min)

### Via Browser
1. Login to `http://localhost:8080/dashboard`
2. Click **"Hospitals"** in sidebar
3. Click **"Add Hospital"** button
4. Fill form:
   - Name: `Test General Hospital`
   - Registration: `REG123456`
   - City: `Mumbai`
   - State: `Maharashtra`
   - Contact: Your name
   - Email: `admin@test.com`
   - Phone: `9876543210`
   - Bed Capacity: `200`
   - Type: `Government`
5. Click **"Create"**

**Expected**:
- ✅ Success toast message
- ✅ Hospital appears in list
- ✅ Table shows: Name, City, State, Bed Capacity

### Via API
```bash
# Test hospital creation via API (save token from Step 3)
TOKEN="<YOUR_ACCESS_TOKEN>"

curl -X POST http://127.0.0.1:8000/api/hospitals/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Hospital",
    "registration_number": "API123",
    "address": "123 Test St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "contact_person": "Test Admin",
    "contact_email": "api@test.com",
    "contact_phone": "1234567890",
    "bed_capacity": 100,
    "hospital_type": "GOVERNMENT"
  }'
```

**Expected**: JSON response with created hospital data

---

## ✅ STEP 5: Medicine Management Test (5 min)

### Via Browser
1. Go to **Medicines** page
2. Click **"Add Medicine"**
3. Fill form:
   - Name: `Paracetamol 500mg`
   - Generic: `Acetaminophen`
   - Category: `Analgesic`
   - Manufacturer: `Test Pharma`
   - Drug Class: `OTC`
4. Click **"Create"**

**Expected**:
- ✅ Medicine appears in list
- ✅ Shows: Name, Generic, Category, Manufacturer

**Add 3-5 more medicines for testing**:
- Amoxicillin 250mg (Antibiotic)
- Insulin Glargine (Antidiabetic)
- Aspirin 75mg (Analgesic)
- Cetirizine 10mg (Antihistamine)

---

## ✅ STEP 6: Inventory Management Test (5 min)

### Via Browser
1. Go to **Inventory** page
2. Click **"Add Inventory"**
3. **Check Hospital Dropdown**:
   - ✅ Should show "sevashram" and any hospitals you created
   - ✅ If EMPTY → Login flow issue (see Step 3)
4. **Check Medicine Dropdown**:
   - ✅ Should show medicines from Step 5
5. Fill form:
   - Hospital: Select any
   - Medicine: Select any
   - Current Stock: `100`
   - Reorder Level: `50`
   - Max Capacity: `500`
   - Daily Usage Avg: `10`
6. Click **"Create"**

**Expected**:
- ✅ Inventory item appears in table
- ✅ Shows: Hospital, Medicine, Stock, Reorder Level, Status

**Create 5-10 inventory items with varying stock levels**:
- Some with high stock (200+) → Status: "In Stock"
- Some with low stock (30-50) → Status: "Low Stock"
- Some with very low stock (5-10) → Status: "Low Stock"

---

## ✅ STEP 7: ML Model Status Check (3 min)

```bash
cd /Users/khushalpatil/Desktop/Drug

# Check if model files exist
ls -lh ml_models/

# Expected files:
# - shortage_model.pkl
# - scaler.pkl
# - label_encoders.pkl
# - feature_columns.pkl
```

**If files missing**:
```bash
cd backend
python manage.py train_model
```

### Test Model API
```bash
# Check model status
curl http://127.0.0.1:8000/api/predictions/model-status/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**:
```json
{
  "model_loaded": true,
  "models_exist": true,
  "feature_count": 12,
  "status": "READY"
}
```

---

## ✅ STEP 8: ML Prediction Test (10 min)

### Test 1: Single Prediction (Low Stock - Should predict shortage)
```bash
TOKEN="<YOUR_TOKEN_FROM_STEP_3>"

curl -X POST http://127.0.0.1:8000/api/predictions/predict/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "hospital_id": 1,
    "current_stock": 30,
    "daily_consumption": 15,
    "reorder_level": 50,
    "drug_category": "Antibiotic",
    "hospital_type": "GOVERNMENT"
  }' | python -m json.tool
```

**Expected Output**:
```json
{
  "success": true,
  "prediction": {
    "shortage_prediction": true,
    "shortage_probability": 0.85,
    "risk_level": "CRITICAL",
    "recommendation": "EMERGENCY - Redistribute stock",
    "confidence": 0.85,
    "days_of_supply": 2.0
  }
}
```

### Test 2: Normal Stock (Should NOT predict shortage)
```bash
curl -X POST http://127.0.0.1:8000/api/predictions/predict/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "hospital_id": 1,
    "current_stock": 300,
    "daily_consumption": 10,
    "reorder_level": 50
  }' | python -m json.tool
```

**Expected**:
```json
{
  "shortage_probability": < 0.3,
  "risk_level": "LOW",
  "days_of_supply": 30.0
}
```

### Test 3: Batch Predictions
```bash
curl -X POST http://127.0.0.1:8000/api/predictions/batch-predict/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "inventories": [
      {
        "medicine_id": 1,
        "hospital_id": 1,
        "current_stock": 30,
        "daily_consumption": 15
      },
      {
        "medicine_id": 2,
        "hospital_id": 1,
        "current_stock": 200,
        "daily_consumption": 5
      }
    ]
  }' | python -m json.tool
```

**Expected**: Risk summary showing counts by level

---

## ✅ STEP 9: Alert System Test (5 min)

### Check if Alerts Created
1. Go to **Alerts** page in dashboard
2. **Expected**: If you ran predictions with HIGH/CRITICAL risk, alerts should appear

### Via Browser
```bash
# List all alerts
curl http://127.0.0.1:8000/api/alerts/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: JSON array of alerts (may be empty if no predictions run)

---

## ✅ STEP 10: End-to-End Demo Flow (10 min)

### Complete User Journey

1. **Login** (`test@admin.com` / `admin123`)
   - ✅ Successful login
   - ✅ Dashboard loads

2. **View Dashboard Overview**
   - ✅ Total Hospitals count
   - ✅ Total Medicines count  
   - ✅ Inventory Items count
   - ✅ Recent Alerts

3. **Manage Hospitals**
   - ✅ View list
   - ✅ Add new hospital
   - ✅ Edit existing
   - ✅ (Optional) Delete

4. **Manage Medicines**
   - ✅ View medicine catalog
   - ✅ Add medicines
   - ✅ Filter/Search

5. **Manage Inventory**
   - ✅ View inventory items
   - ✅ Add new inventory (hospital & medicine dropdowns work!)
   - ✅ Edit stock levels
   - ✅ See stock status badges

6. **Run Predictions**
   - ✅ Use API to predict shortages
   - ✅ View risk levels
   - ✅ Check recommendations

7. **View Alerts**
   - ✅ See auto-generated alerts
   - ✅ Acknowledge alerts
   - ✅ Resolve alerts

---

## 🔧 Common Issues & Fixes

### Issue 1: "Failed to fetch inventory data"
**Cause**: Not logged in or token expired
**Fix**: 
1. Logout and login again
2. Check browser console for 401 errors
3. Verify token in localStorage: `localStorage.getItem('access_token')`

### Issue 2: Hospital dropdown is empty
**Cause**: Backend permissions or no hospitals in DB
**Fix**:
```bash
cd backend
python manage.py shell -c "
from hospitals.models import Hospital
if Hospital.objects.count() == 0:
    Hospital.objects.create(
        name='Demo Hospital',
        registration_number='DEMO123',
        address='123 Main St',
        city='Mumbai',
        state='Maharashtra',
        pincode='400001',
        contact_person='Admin',
        contact_email='admin@demo.com',
        contact_phone='1234567890',
        bed_capacity=100,
        hospital_type='GOVERNMENT'
    )
    print('✅ Demo hospital created')
"
```

### Issue 3: ML predictions return 500 error
**Cause**: Model not trained
**Fix**:
```bash
cd backend
python manage.py train_model
```

### Issue 4: CORS errors in browser console
**Cause**: Backend not allowing frontend origin
**Fix**: Already configured in `settings.py`, restart backend server

### Issue 5: Database connection errors
**Cause**: `.env` file missing or DATABASE_URL incorrect
**Fix**:
```bash
# Check .env file exists
cat backend/.env

# Should contain:
# DATABASE_URL='postgresql://...'
```

---

## 📊 Success Criteria

Your system is **DEMO READY** if ALL these are ✅:

### Backend
- [ ] Django server running on port 8000
- [ ] Database connected (Neon PostgreSQL)
- [ ] Migrations applied
- [ ] At least 1 user exists (test@admin.com)
- [ ] ML model trained (99.5% accuracy)
- [ ] API endpoints responding

### Frontend  
- [ ] React app running on port 8080
- [ ] Login works
- [ ] Dashboard loads
- [ ] Hospital dropdown shows hospitals
- [ ] Medicine dropdown shows medicines
- [ ] Can create/edit inventory

### ML Model
- [ ] Model files exist in `ml_models/`
- [ ] `/api/predictions/model-status/` returns "READY"
- [ ] Predictions return risk levels
- [ ] Alerts auto-generated for high-risk items

### Full Flow
- [ ] Can login
- [ ] Can create hospital
- [ ] Can create medicine
- [ ] Can create inventory (with dropdowns working!)
- [ ] ML predictions work via API
- [ ] Alerts visible in dashboard

---

## 🎯 Demo Script (5 minutes)

### For Hackathon Judges:

**"Let me show you our AI-powered Drug Shortage Prediction System..."**

1. **Problem** (30 sec)
   - "Hospitals face critical drug shortages"
   - "Traditional tracking is reactive, not predictive"

2. **Solution** (1 min)
   - "We built an ML-powered system with 99.5% accuracy"
   - Login to dashboard
   - Show hospital management

3. **Core Features** (2 min)
   - **Inventory Tracking**: Add/edit inventory items
   - **ML Predictions**: Run API call showing shortage prediction
   - **Auto Alerts**: Show HIGH/CRITICAL risk alerts
   - **Risk Classification**: LOW → MEDIUM → HIGH → CRITICAL

4. **Technical Stack** (1 min)
   - React + TypeScript frontend
   - Django REST API backend
   - XGBoost ML model (99.5% accuracy)
   - PostgreSQL database (Neon cloud)
   - 12 engineered features for predictions

5. **Impact** (30 sec)
   - "Predicts shortages 7 days in advance"
   - "Auto-generates alerts for redistribution"
   - "Prevents stockouts, saves lives"

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd /Users/khushalpatil/Desktop/Drug/backend
source ../env/bin/activate
python manage.py runserver

# Terminal 2: Start Frontend
cd /Users/khushalpatil/Desktop/Drug/frontend
npm run dev

# Terminal 3: Test ML Model
cd /Users/khushalpatil/Desktop/Drug/backend
python manage.py shell -c "
from predictions.forecaster import predictor_instance
print('Model Status:', 'READY' if predictor_instance.model else 'NOT_LOADED')
"
```

---

## ✅ Final Checklist

Before demo:
- [ ] Both servers running
- [ ] Test login works
- [ ] At least 3 hospitals in system
- [ ] At least 5 medicines in catalog
- [ ] At least 10 inventory items created
- [ ] ML model trained and ready
- [ ] Run 2-3 test predictions
- [ ] Check alerts are displaying
- [ ] Browser console has no errors
- [ ] Network tab shows successful API calls

**Everything checked? You're ready to demo!** 🎉
