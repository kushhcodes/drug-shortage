# 📡 Drug Shortage Prediction System - API Documentation & Postman Guide

This document lists all available API endpoints and provides a **step-by-step guide** on how to test each one using **Postman**.

**Base URL**: `http://localhost:8000/api`

---

## ⚡️ Postman Setup Guide

### 1. Create a Collection
1.  Open Postman.
2.  Click **"New"** > **"Collection"**.
3.  Name it: `Drug Shortage API`.

### 2. Set Environment Variables (Optional but Recommended)
1.  Click the **"Eye" icon** (top right) > **"Add"**.
2.  Name: `Local Dev`.
3.  Add Variable: `base_url` -> Current Value: `http://localhost:8000/api`.
4.  Add Variable: `token` -> Leave blank for now.
5.  Click **Save** and select "Local Dev" from the dropdown.

---

## 1. Authentication

### Step 0: Register (Create Account)
*   **Request Type**: `POST`
*   **URL**: `{{base_url}}/auth/register/` (or `http://localhost:8000/api/auth/register/`)
*   **Body**: Select **raw** > **JSON**.
    ```json
    {
        "email": "admin@hospital.com",
        "username": "hospital_admin_01",
        "password": "StrongPassword123!",
        "password_confirm": "StrongPassword123!",
        "first_name": "City",            
        "last_name": "Hospital",        
        "phone": "+15550000000",
        "role": "HOSPITAL_ADMIN",
        "hospital_id": null
    }
    ```
    *(Note: Address and complex Hospital details are currently stored locally or can be added via the 'Create Hospital' API after login)*
*   **Action**: Click **Send**.
*   **Result**: 
    ```json
    {
        "message": "User registered successfully",
        "user": { ... },
        "tokens": { "refresh": "...", "access": "..." }
    }
    ```

### Step 1: Login (Get Token)
*   **Request Type**: `POST`
*   **URL**: `{{base_url}}/auth/login/` (or `http://localhost:8000/api/auth/login/`)
*   **Body**: Select **raw** > **JSON**.
    ```json
    {
        "email": "test@admin.com",
        "password": "admin123"
    }
    ```
*   **Action**: Click **Send**.
*   **Result**: Copy the `access` token from the response.
    *   *Tip: In Postman "Tests" tab, add this to auto-save token:*
        ```javascript
        var jsonData = pm.response.json();
        pm.environment.set("token", jsonData.access);
        ```

### Step 2: Get Profile (Verify Token)
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/auth/profile/`
*   **Auth**: Click **"Authorization"** tab > Type: **Bearer Token** > Token: `{{token}}` (or paste token manually).
*   **Action**: Click **Send**.
*   **Result**: You should see your user details (e.g., "test@admin.com").

---

## 2. Hospitals

### Step 3: List All Hospitals
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/hospitals/`
*   **Auth**: Inherit from parent (or add Bearer Token).
*   **Action**: Click **Send**.
*   **Result**: A list of hospitals like "City General Hospital".

---

## 3. Inventory

### Step 4: List Inventory Items
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/hospitals/inventory/`
*   **Auth**: Bearer Token.
*   **Action**: Click **Send**.
*   **Result**: A list of medicines in stock. Identify an item's `id` for the next test.

---

## 4. Medicines

### Step 5: List Medicines Catalog
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/medicines/`
*   **Auth**: Bearer Token.
*   **Action**: Click **Send**.
*   **Result**: List of all available drugs (e.g., "Paracetamol").

---

## 5. Alerts

### Step 6: Check Active Alerts
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/alerts/`
*   **Auth**: Bearer Token.
*   **Action**: Click **Send**.
*   **Result**: List of current shortages (might be empty initially).

---

## 6. Predictions (Machine Learning)

### Step 7: Check Model Status
*   **Request Type**: `GET`
*   **URL**: `{{base_url}}/predictions/model-status/`
*   **Auth**: Bearer Token.
*   **Action**: Click **Send**.
*   **Result**: `{"status": "READY", "model_loaded": true}`

### Step 8: Run a Prediction (The "Magic" Step)
*   **Request Type**: `POST`
*   **URL**: `{{base_url}}/predictions/predict/`
*   **Auth**: Bearer Token.
*   **Body**: Select **raw** > **JSON**.
    ```json
    {
        "medicine_id": 1,
        "hospital_id": 1,
        "current_stock": 25,
        "daily_consumption": 15
    }
    ```
    *(Note: Adjust IDs if needed based on Step 3 & 4 results)*
*   **Action**: Click **Send**.
*   **Expected Result**:
    ```json
    {
        "success": true,
        "prediction": {
            "shortage_prediction": true,
            "risk_level": "CRITICAL",
            "recommendation": "EMERGENCY - Redistribute stock",
            ...
        }
    }
    ```
