"""
Data Seeding Script for Drug Shortage Prediction System
Adds sample hospitals, medicines, and inventory for testing
"""
import os
import django
import sys
from datetime import datetime, timedelta

# Setup Django
sys.path.append('/Users/khushalpatil/Desktop/Drug/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospitals.models import Hospital, Inventory
from medicines.models import Medicine
from accounts.models import User
from django.db import transaction

print("🌱 Starting Data Seeding Process...")
print("=" * 60)

# Clear existing data (optional - comment out if you want to keep existing)
# Hospital.objects.all().delete()
# Medicine.objects.all().delete()
# Inventory.objects.all().delete()

with transaction.atomic():
    
    # 1. CREATE HOSPITALS
    print("\n1️⃣ Creating Hospitals...")
    hospitals_data = [
        {
            'name': 'City General Hospital',
            'registration_number': 'CGH2024001',
            'address': '123 Main Street, Medical District',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'pincode': '400001',
            'contact_person': 'Dr. Rajesh Kumar',
            'contact_email': 'admin@citygeneral.com',
            'contact_phone': '9876543210',
            'bed_capacity': 500,
            'hospital_type': 'GOVERNMENT'
        },
        {
            'name': 'Apollo Care Center',
            'registration_number': 'ACC2024002',
            'address': '456 Health Avenue',
            'city': 'Delhi',
            'state': 'Delhi',
            'pincode': '110001',
            'contact_person': 'Dr. Priya Sharma',
            'contact_email': 'contact@apollocare.com',
            'contact_phone': '9876543211',
            'bed_capacity': 300,
            'hospital_type': 'PRIVATE'
        },
        {
            'name': 'Rural Health Clinic',
            'registration_number': 'RHC2024003',
            'address': 'Village Road, Taluka',
            'city': 'Nashik',
            'state': 'Maharashtra',
            'pincode': '422001',
            'contact_person': 'Dr. Amit Patil',
            'contact_email': 'rhc@health.gov.in',
            'contact_phone': '9876543212',
            'bed_capacity': 100,
            'hospital_type': 'GOVERNMENT'
        },
        {
            'name': 'Fortis Medical Center',
            'registration_number': 'FMC2024004',
            'address': '789 Wellness Boulevard',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'pincode': '560001',
            'contact_person': 'Dr. Sunita Reddy',
            'contact_email': 'info@fortismedical.com',
            'contact_phone': '9876543213',
            'bed_capacity': 400,
            'hospital_type': 'PRIVATE'
        },
        {
            'name': 'Charitable Trust Hospital',
            'registration_number': 'CTH2024005',
            'address': '321 Care Street',
            'city': 'Pune',
            'state': 'Maharashtra',
            'pincode': '411001',
            'contact_person': 'Dr. Vijay Deshmukh',
            'contact_email': 'charity@hospital.org',
            'contact_phone': '9876543214',
            'bed_capacity': 200,
            'hospital_type': 'CHARITABLE'
        }
    ]
    
    hospitals = []
    for h_data in hospitals_data:
        hospital, created = Hospital.objects.get_or_create(
            registration_number=h_data['registration_number'],
            defaults=h_data
        )
        hospitals.append(hospital)
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"   {status}: {hospital.name} ({hospital.city})")
    
    print(f"\n   Total Hospitals: {Hospital.objects.count()}")
    
    # 2. CREATE MEDICINES
    print("\n2️⃣ Creating Medicines...")
    medicines_data = [
        {
            'name': 'Paracetamol 500mg',
            'generic_name': 'Acetaminophen',
            'category': 'ANALGESIC',
            'manufacturer': 'Generic Pharma Ltd',
            'dosage_form': 'Tablet',
            'strength': '500mg',
            'is_essential': True
        },
        {
            'name': 'Amoxicillin 250mg',
            'generic_name': 'Amoxicillin',
            'category': 'ANTIBIOTIC',
            'manufacturer': 'Cipla Ltd',
            'dosage_form': 'Capsule',
            'strength': '250mg',
            'is_essential': True
        },
        {
            'name': 'Insulin Glargine 100IU',
            'generic_name': 'Insulin Glargine',
            'category': 'DIABETES',
            'manufacturer': 'Novo Nordisk',
            'dosage_form': 'Injection',
            'strength': '100IU/ml',
            'is_essential': True
        },
        {
            'name': 'Aspirin 75mg',
            'generic_name': 'Acetylsalicylic Acid',
            'category': 'CARDIOVASCULAR',
            'manufacturer': 'Bayer Pharma',
            'dosage_form': 'Tablet',
            'strength': '75mg',
            'is_essential': True
        },
        {
            'name': 'Cetirizine 10mg',
            'generic_name': 'Cetirizine',
            'category': 'RESPIRATORY',
            'manufacturer': 'Sun Pharma',
            'dosage_form': 'Tablet',
            'strength': '10mg',
            'is_essential': False
        },
        {
            'name': 'Metformin 500mg',
            'generic_name': 'Metformin',
            'category': 'DIABETES',
            'manufacturer': 'Dr. Reddy\'s',
            'dosage_form': 'Tablet',
            'strength': '500mg',
            'is_essential': True
        },
        {
            'name': 'Azithromycin 500mg',
            'generic_name': 'Azithromycin',
            'category': 'ANTIBIOTIC',
            'manufacturer': 'Cipla Ltd',
            'dosage_form': 'Tablet',
            'strength': '500mg',
            'is_essential': True
        },
        {
            'name': 'Omeprazole 20mg',
            'generic_name': 'Omeprazole',
            'category': 'GASTROINTESTINAL',
            'manufacturer': 'Ranbaxy',
            'dosage_form': 'Capsule',
            'strength': '20mg',
            'is_essential': False
        },
        {
            'name': 'Amlodipine 5mg',
            'generic_name': 'Amlodipine',
            'category': 'CARDIOVASCULAR',
            'manufacturer': 'Lupin Pharma',
            'dosage_form': 'Tablet',
            'strength': '5mg',
            'is_essential': True
        },
        {
            'name': 'Salbutamol Inhaler',
            'generic_name': 'Salbutamol',
            'category': 'RESPIRATORY',
            'manufacturer': 'GSK',
            'dosage_form': 'Inhaler',
            'strength': '100mcg/dose',
            'is_essential': True
        }
    ]
    
    medicines = []
    for m_data in medicines_data:
        medicine, created = Medicine.objects.get_or_create(
            name=m_data['name'],
            defaults=m_data
        )
        medicines.append(medicine)
        status = "✅ Created" if created else "ℹ️  Already exists"
        essential = "⭐ Essential" if medicine.is_essential else ""
        print(f"   {status}: {medicine.name} ({medicine.category}) {essential}")
    
    print(f"\n   Total Medicines: {Medicine.objects.count()}")
    
    # 3. CREATE INVENTORY WITH VARYING STOCK LEVELS
    print("\n3️⃣ Creating Inventory Items...")
    print("   (Creating items with different risk levels for ML testing)")
    
    # Define inventory scenarios
    inventory_scenarios = [
        # CRITICAL RISK - Very low stock, high consumption
        {'hospital_idx': 0, 'medicine_idx': 0, 'stock': 25, 'reorder': 100, 'max': 500, 'daily': 15, 'desc': 'CRITICAL'},
        {'hospital_idx': 1, 'medicine_idx': 1, 'stock': 30, 'reorder': 120, 'max': 600, 'daily': 20, 'desc': 'CRITICAL'},
        {'hospital_idx': 2, 'medicine_idx': 2, 'stock': 15, 'reorder': 80, 'max': 300, 'daily': 12, 'desc': 'CRITICAL'},
        
        # HIGH RISK - Low stock, moderate consumption
        {'hospital_idx': 0, 'medicine_idx': 3, 'stock': 50, 'reorder': 100, 'max': 400, 'daily': 8, 'desc': 'HIGH'},
        {'hospital_idx': 3, 'medicine_idx': 4, 'stock': 60, 'reorder': 100, 'max': 500, 'daily': 10, 'desc': 'HIGH'},
        {'hospital_idx': 4, 'medicine_idx': 5, 'stock': 70, 'reorder': 120, 'max': 600, 'daily': 12, 'desc': 'HIGH'},
        
        # MEDIUM RISK - Moderate stock
        {'hospital_idx': 1, 'medicine_idx': 6, 'stock': 120, 'reorder': 100, 'max': 500, 'daily': 10, 'desc': 'MEDIUM'},
        {'hospital_idx': 2, 'medicine_idx': 7, 'stock': 100, 'reorder': 80, 'max': 400, 'daily': 8, 'desc': 'MEDIUM'},
        {'hospital_idx': 3, 'medicine_idx': 8, 'stock': 150, 'reorder': 120, 'max': 600, 'daily': 15, 'desc': 'MEDIUM'},
        
        # LOW RISK - Good stock levels
        {'hospital_idx': 0, 'medicine_idx': 9, 'stock': 300, 'reorder': 100, 'max': 500, 'daily': 5, 'desc': 'LOW'},
        {'hospital_idx': 1, 'medicine_idx': 0, 'stock': 400, 'reorder': 100, 'max': 600, 'daily': 8, 'desc': 'LOW'},
        {'hospital_idx': 4, 'medicine_idx': 1, 'stock': 350, 'reorder': 120, 'max': 700, 'daily': 10, 'desc': 'LOW'},
        {'hospital_idx': 3, 'medicine_idx': 2, 'stock': 250, 'reorder': 80, 'max': 400, 'daily': 3, 'desc': 'LOW'},
        {'hospital_idx': 2, 'medicine_idx': 3, 'stock': 200, 'reorder': 60, 'max': 300, 'daily': 4, 'desc': 'LOW'},
        
        # Additional diverse items
        {'hospital_idx': 4, 'medicine_idx': 6, 'stock': 180, 'reorder': 100, 'max': 500, 'daily': 12, 'desc': 'MEDIUM'},
        {'hospital_idx': 0, 'medicine_idx': 7, 'stock': 45, 'reorder': 80, 'max': 400, 'daily': 9, 'desc': 'HIGH'},
    ]

    # Generate 50+ random inventory items for robust testing
    import random
    for _ in range(50):
        h_idx = random.randint(0, 4)
        m_idx = random.randint(0, 9)
        daily = random.randint(5, 50)
        max_cap = random.randint(200, 1000)
        reorder = int(daily * 7) # 1 week supply
        
        # Create scenarios:
        # 1. Critical (3-4 days left)
        # 2. High (1 week left)
        # 3. Medium (2 weeks left)
        # 4. Low (Plenty)
        
        scenario_type = random.choice(['critical', 'high', 'medium', 'low', 'low', 'low'])
        
        if scenario_type == 'critical':
            # Critical: very low stock
            stock = random.randint(1, max(2, int(daily * 3)))
            desc = 'CRITICAL'
        elif scenario_type == 'high':
             # High risk: < 1 week
             lower = int(daily * 4)
             upper = int(daily * 7)
             if lower >= upper: upper = lower + 10
             stock = random.randint(lower, upper)
             desc = 'HIGH'
        elif scenario_type == 'medium':
             # Medium: 1-2 weeks
             lower = int(daily * 8)
             upper = int(daily * 14)
             if lower >= upper: upper = lower + 20
             stock = random.randint(lower, upper)
             desc = 'MEDIUM'
        else:
             # Low: > 2 weeks
             lower = int(daily * 15)
             # Ensure max_cap is large enough
             if max_cap <= lower: max_cap = lower + 500
             stock = random.randint(lower, max_cap)
             desc = 'LOW'

        inventory_scenarios.append({
            'hospital_idx': h_idx,
            'medicine_idx': m_idx,
            'stock': stock,
            'reorder': reorder,
            'max': max_cap,
            'daily': daily,
            'desc': desc
        })
    
    inventory_items = []
    for scenario in inventory_scenarios:
        hospital = hospitals[scenario['hospital_idx']]
        medicine = medicines[scenario['medicine_idx']]
        
        inventory, created = Inventory.objects.get_or_create(
            hospital=hospital,
            medicine=medicine,
            defaults={
                'current_stock': scenario['stock'],
                'reorder_level': scenario['reorder'],
                'max_capacity': scenario['max'],
                'average_daily_usage': scenario['daily']
            }
        )
        
        if not created:
            # Update if already exists
            inventory.current_stock = scenario['stock']
            inventory.reorder_level = scenario['reorder']
            inventory.max_capacity = scenario['max']
            inventory.average_daily_usage = scenario['daily']
            inventory.save()
        
        inventory_items.append(inventory)
        days_supply = scenario['stock'] / scenario['daily'] if scenario['daily'] > 0 else 999
        status = "✅ Created" if created else "🔄 Updated"
        
        print(f"   {status}: {hospital.name[:20]:20} | {medicine.name[:25]:25} | "
              f"Stock: {scenario['stock']:3} | Daily: {scenario['daily']:2} | "
              f"Days: {days_supply:4.1f} | Expected: {scenario['desc']}")
    
    print(f"\n   Total Inventory Items: {Inventory.objects.count()}")

print("\n" + "=" * 60)
print("✅ Data Seeding Complete!")
print("\n📊 Summary:")
print(f"   Hospitals: {Hospital.objects.count()}")
print(f"   Medicines: {Medicine.objects.count()}")
print(f"   Inventory Items: {Inventory.objects.count()}")
print(f"   Users: {User.objects.count()}")
print("\n🎯 Data includes:")
print("   - 3 CRITICAL risk items (very low stock)")
print("   - 3 HIGH risk items (low stock)")
print("   - 3 MEDIUM risk items (moderate stock)")
print("   - 5+ LOW risk items (good stock)")
print("\n✅ Ready for ML predictions and testing!")
