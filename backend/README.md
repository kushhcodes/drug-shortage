# Drug Shortage Management System - Backend API

A Django REST Framework backend for predicting and managing drug shortages across hospitals.

## Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Hospital Endpoints](#hospital-endpoints)
  - [Inventory Endpoints](#inventory-endpoints)
  - [Medicine Endpoints](#medicine-endpoints)
  - [Alert Endpoints](#alert-endpoints)
  - [Prediction Endpoints](#prediction-endpoints)
- [User Roles](#user-roles)

---

## Authentication

All endpoints (except registration and login) require JWT authentication.

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## API Endpoints

### Auth Endpoints

Base URL: `/api/auth/`

---

#### `POST /api/auth/register/`

Register a new user account.

**Input:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "password_confirm": "string (required)",
  "first_name": "string (required)",
  "last_name": "string (required)",
  "phone": "string (optional)",
  "role": "HOSPITAL_ADMIN | PHARMACIST | HEALTH_AUTHORITY | SUPER_ADMIN",
  "hospital_id": "integer (optional, required for hospital staff)"
}
```

**Output (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890",
    "role": "HOSPITAL_ADMIN",
    "hospital": 1,
    "hospital_name": "City General Hospital",
    "is_active": true,
    "created_at": "2026-01-22T00:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ...",
    "access": "eyJ..."
  }
}
```

---

#### `POST /api/auth/login/`

Authenticate and get JWT tokens.

**Input:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Output (200):**
```json
{
  "refresh": "eyJ...",
  "access": "eyJ...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "HOSPITAL_ADMIN",
    "hospital_id": 1,
    "hospital_name": "City General Hospital"
  }
}
```

---

#### `POST /api/auth/logout/`

Logout and blacklist the refresh token.

**Input:**
```json
{
  "refresh": "string (refresh token)"
}
```

**Output (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

#### `POST /api/auth/token/refresh/`

Refresh the access token.

**Input:**
```json
{
  "refresh": "string (refresh token)"
}
```

**Output (200):**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

---

#### `GET /api/auth/profile/`

Get current user's profile.

**Input:** None (uses JWT token)

**Output (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "role": "HOSPITAL_ADMIN",
  "hospital": 1,
  "hospital_name": "City General Hospital",
  "is_active": true,
  "created_at": "2026-01-22T00:00:00Z"
}
```

---

#### `PATCH /api/auth/profile/`

Update current user's profile.

**Input:**
```json
{
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "phone": "string (optional)"
}
```

**Output (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

#### `POST /api/auth/change-password/`

Change the current user's password.

**Input:**
```json
{
  "old_password": "string",
  "new_password": "string (min 8 chars)",
  "new_password_confirm": "string"
}
```

**Output (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Hospital Endpoints

Base URL: `/api/hospitals/`

---

#### `GET /api/hospitals/`

List all hospitals (filtered by user's access level).

**Input:** None

**Output (200):**
```json
[
  {
    "id": 1,
    "name": "City General Hospital",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hospital_type": "GOVERNMENT",
    "bed_capacity": 500,
    "is_active": true
  }
]
```

---

#### `POST /api/hospitals/`

Create a new hospital.

**Input:**
```json
{
  "name": "string",
  "registration_number": "string (unique)",
  "address": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "latitude": "decimal (optional)",
  "longitude": "decimal (optional)",
  "contact_person": "string",
  "contact_email": "string",
  "contact_phone": "string",
  "bed_capacity": "integer (min 1)",
  "hospital_type": "GOVERNMENT | PRIVATE | CHARITABLE",
  "is_active": "boolean (default: true)"
}
```

**Output (201):** Full hospital object

---

#### `GET /api/hospitals/{id}/`

Get a specific hospital's details.

**Input:** Hospital ID in URL

**Output (200):** Full hospital object with `full_address` property

---

#### `PUT/PATCH /api/hospitals/{id}/`

Update a hospital.

**Input:** Any of the fields from POST (PATCH for partial update)

**Output (200):** Updated hospital object

---

#### `DELETE /api/hospitals/{id}/`

Delete a hospital.

**Output (204):** No content

---

#### `GET /api/hospitals/{id}/inventory/`

Get all inventory items for a specific hospital.

**Input:** Hospital ID in URL

**Output (200):**
```json
[
  {
    "id": 1,
    "hospital": 1,
    "hospital_name": "City General Hospital",
    "medicine": 1,
    "medicine_name": "Paracetamol 500mg",
    "current_stock": 1000,
    "reorder_level": 200,
    "max_capacity": 5000,
    "average_daily_usage": "50.00",
    "last_restocked_date": "2026-01-15",
    "stock_status": "NORMAL",
    "days_until_stockout": 20
  }
]
```

---

#### `GET /api/hospitals/{id}/low_stock/`

Get low stock items for a specific hospital.

**Input:** Hospital ID in URL

**Output (200):** Array of inventory items where `current_stock <= reorder_level`

---

### Inventory Endpoints

Base URL: `/api/hospitals/inventory/`

---

#### `GET /api/hospitals/inventory/`

List all inventory records (filtered by user's access level).

**Output (200):** Array of inventory objects

---

#### `POST /api/hospitals/inventory/`

Create a new inventory record.

**Input:**
```json
{
  "hospital": "integer",
  "medicine": "integer",
  "current_stock": "integer (min 0)",
  "reorder_level": "integer (min 0)",
  "max_capacity": "integer (min 1)",
  "average_daily_usage": "decimal (default: 0.00)",
  "last_restocked_date": "date (optional)"
}
```

**Output (201):** Created inventory object

---

#### `GET /api/hospitals/inventory/{id}/`

Get a specific inventory record.

**Output (200):** Full inventory object with computed properties

---

#### `PUT/PATCH /api/hospitals/inventory/{id}/`

Update an inventory record.

**Input (allowed fields):**
```json
{
  "current_stock": "integer",
  "reorder_level": "integer",
  "max_capacity": "integer",
  "average_daily_usage": "decimal",
  "last_restocked_date": "date"
}
```

**Output (200):** Updated inventory object

---

#### `GET /api/hospitals/inventory/low_stock/`

Get all low stock inventory items across accessible hospitals.

**Output (200):** Array of inventory items where `current_stock <= reorder_level`

---

#### `GET /api/hospitals/inventory/out_of_stock/`

Get all out of stock inventory items.

**Output (200):** Array of inventory items where `current_stock = 0`

---

### Inventory Transaction Endpoints

Base URL: `/api/hospitals/transactions/`

---

#### `GET /api/hospitals/transactions/`

List all inventory transactions.

**Output (200):**
```json
[
  {
    "id": 1,
    "inventory": 1,
    "medicine_name": "Paracetamol 500mg",
    "hospital_name": "City General Hospital",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "previous_stock": 500,
    "new_stock": 1000,
    "performed_by": 1,
    "performed_by_name": "John Doe",
    "notes": "Monthly restock",
    "transaction_date": "2026-01-20T10:00:00Z"
  }
]
```

---

#### `POST /api/hospitals/transactions/`

Create a new inventory transaction.

**Input:**
```json
{
  "inventory_id": "integer",
  "transaction_type": "PURCHASE | CONSUMPTION | TRANSFER_IN | TRANSFER_OUT | ADJUSTMENT | EXPIRED",
  "quantity": "integer",
  "notes": "string (optional)"
}
```

> **Note:** Quantity is automatically adjusted based on transaction type:
> - CONSUMPTION, TRANSFER_OUT, EXPIRED → becomes negative
> - PURCHASE, TRANSFER_IN → becomes positive
> - ADJUSTMENT → can be positive or negative

**Output (201):** Created transaction object

---

#### `GET /api/hospitals/transactions/recent/`

Get the 50 most recent transactions.

**Output (200):** Array of transaction objects ordered by date descending

---

### Medicine Endpoints

Base URL: `/api/medicines/`

---

#### `GET /api/medicines/`

List all active medicines.

**Output (200):**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "generic_name": "Paracetamol",
    "category": "ANALGESIC",
    "strength": "500mg",
    "manufacturer": "Cipla",
    "is_essential": true
  }
]
```

---

#### `POST /api/medicines/`

Create a new medicine.

**Input:**
```json
{
  "name": "string (unique)",
  "generic_name": "string",
  "category": "ANTIBIOTIC | ANALGESIC | ANTIVIRAL | CARDIOVASCULAR | DIABETES | RESPIRATORY | GASTROINTESTINAL | EMERGENCY | VACCINE | OTHER",
  "manufacturer": "string",
  "dosage_form": "string (e.g., Tablet, Syrup)",
  "strength": "string (e.g., 500mg)",
  "is_prescription_required": "boolean (default: true)",
  "is_essential": "boolean (default: false)",
  "is_seasonal": "boolean (default: false)",
  "peak_season_months": "string (optional, e.g., 'Jun-Aug')",
  "description": "string (optional)"
}
```

**Output (201):** Created medicine object

---

#### `GET /api/medicines/{id}/`

Get a specific medicine's details.

**Output (200):** Full medicine object

---

#### `PUT/PATCH /api/medicines/{id}/`

Update a medicine.

**Output (200):** Updated medicine object

---

#### `DELETE /api/medicines/{id}/`

Delete a medicine (soft delete - sets `is_active` to false).

**Output (204):** No content

---

#### `GET /api/medicines/essential/`

Get all essential medicines.

**Output (200):** Array of medicines where `is_essential = true`

---

#### `GET /api/medicines/by_category/?category={CATEGORY}`

Get medicines by category.

**Input (Query Param):** `category` - one of the category choices

**Output (200):** Array of medicines in that category

**Output (400):** `{"error": "Category parameter required"}` if missing

---

### Alert Endpoints

Base URL: `/api/alerts/`

---

#### `GET /api/alerts/`

List all alerts (filtered by user's access level).

**Output (200):**
```json
[
  {
    "id": 1,
    "hospital_name": "City General Hospital",
    "medicine_name": "Paracetamol 500mg",
    "severity": "HIGH",
    "status": "ACTIVE",
    "current_stock": 50,
    "predicted_stockout_date": "2026-01-25",
    "created_at": "2026-01-22T00:00:00Z"
  }
]
```

---

#### `POST /api/alerts/`

Create a new alert.

**Input:**
```json
{
  "hospital": "integer",
  "medicine": "integer",
  "inventory": "integer",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "current_stock": "integer",
  "predicted_stockout_date": "date",
  "predicted_shortage_quantity": "integer (min 0)",
  "confidence_score": "decimal (0-100)",
  "message": "string"
}
```

**Output (201):** Created alert object

---

#### `GET /api/alerts/{id}/`

Get a specific alert's details.

**Output (200):** Full alert object with acknowledged/resolved user names

---

#### `GET /api/alerts/active/`

Get all active alerts.

**Output (200):** Array of alerts where `status = 'ACTIVE'`

---

#### `GET /api/alerts/critical/`

Get all critical active alerts.

**Output (200):** Array of alerts where `severity = 'CRITICAL'` and `status = 'ACTIVE'`

---

#### `POST /api/alerts/{id}/acknowledge/`

Acknowledge an alert.

**Input:** None (uses current user as acknowledger)

**Output (200):** Updated alert object with `status = 'ACKNOWLEDGED'`

---

#### `POST /api/alerts/{id}/resolve/`

Resolve an alert.

**Input:**
```json
{
  "notes": "string (optional resolution notes)"
}
```

**Output (200):** Updated alert object with `status = 'RESOLVED'`

---

### Redistribution Request Endpoints

Base URL: `/api/alerts/redistribution/`

---

#### `GET /api/alerts/redistribution/`

List all redistribution requests (filtered by user's hospital access).

**Output (200):**
```json
[
  {
    "id": 1,
    "alert": 1,
    "source_hospital": 2,
    "source_hospital_name": "Regional Medical Center",
    "destination_hospital": 1,
    "destination_hospital_name": "City General Hospital",
    "medicine": 1,
    "medicine_name": "Paracetamol 500mg",
    "requested_quantity": 200,
    "approved_quantity": null,
    "distance_km": "15.50",
    "status": "PENDING",
    "recommendation_score": "85.00",
    "requested_by_name": "John Doe",
    "created_at": "2026-01-22T00:00:00Z"
  }
]
```

---

#### `POST /api/alerts/redistribution/`

Create a new redistribution request.

**Input:**
```json
{
  "alert": "integer",
  "source_hospital": "integer",
  "source_inventory": "integer",
  "destination_hospital": "integer",
  "destination_inventory": "integer",
  "medicine": "integer",
  "requested_quantity": "integer (min 1)",
  "distance_km": "decimal",
  "recommendation_score": "decimal",
  "notes": "string (optional)"
}
```

**Output (201):** Created redistribution request object

---

#### `POST /api/alerts/redistribution/{id}/approve/`

Approve a redistribution request (Health Authority only).

**Input:**
```json
{
  "approved_quantity": "integer (optional, defaults to requested_quantity)"
}
```

**Output (200):** Updated request with `status = 'APPROVED'`

---

#### `POST /api/alerts/redistribution/{id}/reject/`

Reject a redistribution request (Health Authority only).

**Input:**
```json
{
  "reason": "string (rejection reason)"
}
```

**Output (200):** Updated request with `status = 'REJECTED'`

---

### Prediction Endpoints

Base URL: `/api/predictions/`

---

#### `POST /api/predictions/run/`

Run shortage predictions for all hospitals (Health Authority) or user's hospital (Hospital Staff).

**Input:** None

**Output (200):**
```json
{
  "message": "Predictions completed for all hospitals",
  "alerts_created": 5
}
```
or
```json
{
  "message": "Predictions completed for City General Hospital",
  "alerts_created": 2
}
```

---

#### `POST /api/predictions/inventory/`

Predict shortage for a specific inventory item.

**Input:**
```json
{
  "inventory_id": "integer (required)",
  "days_ahead": "integer (default: 30)"
}
```

**Output (200) - Shortage Predicted:**
```json
{
  "medicine": "Paracetamol 500mg",
  "hospital": "City General Hospital",
  "current_stock": 500,
  "daily_usage": 50.0,
  "days_remaining": 10,
  "stockout_date": "2026-02-01",
  "shortage_quantity": 1000,
  "severity": "HIGH",
  "confidence": 85.5
}
```

**Output (200) - No Shortage:**
```json
{
  "message": "No shortage predicted"
}
```

---

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| `HOSPITAL_ADMIN` | Hospital administrator | Own hospital's data only |
| `PHARMACIST` | Hospital pharmacist | Own hospital's data only |
| `HEALTH_AUTHORITY` | Government health authority | All hospitals' data |
| `SUPER_ADMIN` | System administrator | Full access |

---

## Stock Status Values

| Status | Description |
|--------|-------------|
| `OUT_OF_STOCK` | Current stock is 0 |
| `LOW_STOCK` | Current stock ≤ reorder level |
| `NORMAL` | Stock is within normal range |
| `SURPLUS` | Stock ≥ 90% of max capacity |

---

## Alert Severity Levels

| Severity | Description |
|----------|-------------|
| `LOW` | Minor concern, can wait |
| `MEDIUM` | Attention needed soon |
| `HIGH` | Urgent attention required |
| `CRITICAL` | Immediate action required |

---

## Transaction Types

| Type | Description | Effect on Stock |
|------|-------------|-----------------|
| `PURCHASE` | New stock purchased | + (increase) |
| `CONSUMPTION` | Medicine used/dispensed | - (decrease) |
| `TRANSFER_IN` | Received from another hospital | + (increase) |
| `TRANSFER_OUT` | Sent to another hospital | - (decrease) |
| `ADJUSTMENT` | Manual stock correction | +/- (either) |
| `EXPIRED` | Expired stock removed | - (decrease) |

---

## API Documentation

Interactive API documentation is available at:
- **Swagger UI:** `/api/schema/swagger-ui/`
- **ReDoc:** `/api/schema/redoc/`
- **OpenAPI Schema:** `/api/schema/`

---

## Running the Server

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Seed sample data (optional)
python seed_data.py

# Run development server
python manage.py runserver
```
