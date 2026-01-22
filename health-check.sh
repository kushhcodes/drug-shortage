#!/bin/bash
# Quick System Health Check

echo "🔍 Drug Shortage Prediction System - Health Check"
echo "=================================================="
echo ""

# Check Backend
echo "1️⃣ Checking Backend Server..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/admin/ 2>/dev/null)
if [ "$BACKEND_STATUS" = "302" ] || [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend running on port 8000"
else
    echo "   ❌ Backend NOT responding (got: $BACKEND_STATUS)"
fi
echo ""

# Check Frontend
echo "2️⃣ Checking Frontend Server..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend running on port 8080"
else
    echo "   ❌ Frontend NOT responding (got: $FRONTEND_STATUS)"
fi
echo ""

# Check Database
echo "3️⃣ Checking Database Connection..."
cd /Users/khushalpatil/Desktop/Drug/backend
source ../env/bin/activate 2>/dev/null
DB_CHECK=$(python manage.py shell -c "from django.db import connection; connection.ensure_connection(); print('OK')" 2>&1)
if [[ $DB_CHECK == *"OK"* ]]; then
    echo "   ✅ Database connected (Neon PostgreSQL)"
else
    echo "   ❌ Database connection failed"
fi
echo ""

# Check ML Model
echo "4️⃣ Checking ML Model..."
if [ -f "/Users/khushalpatil/Desktop/Drug/ml_models/shortage_model.pkl" ]; then
    echo "   ✅ ML model trained and ready"
    echo "      - shortage_model.pkl"
    echo "      - scaler.pkl"
    echo "      - label_encoders.pkl"
else
    echo "   ❌ ML model NOT found - run: python manage.py train_model"
fi
echo ""

# Check Data
echo "5️⃣ Checking Database Data..."
python manage.py shell -c "
from hospitals.models import Hospital
from medicines.models import Medicine
from hospitals.models import Inventory
from accounts.models import User

print(f'   Hospitals: {Hospital.objects.count()}')
print(f'   Medicines: {Medicine.objects.count()}')
print(f'   Inventory Items: {Inventory.objects.count()}')
print(f'   Users: {User.objects.count()}')
" 2>/dev/null
echo ""

echo "=================================================="
echo "✅ System Check Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Open browser: http://localhost:8080/login"
echo "   2. Login: test@admin.com / admin123"
echo "   3. Test each page: Hospitals, Medicines, Inventory"
echo "   4. Try ML prediction via API"
echo ""
echo "📖 Full testing guide: TESTING_CHECKLIST.md"
