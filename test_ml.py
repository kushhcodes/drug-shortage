#!/usr/bin/env python
"""
Test script for ML model
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from predictions.forecaster import predictor_instance

def test_model():
    print("🧪 Testing Drug Shortage ML Model")
    print("="*50)
    
    # Test 1: Load or train model
    print("1. Loading model...")
    if not predictor_instance.load_model():
        print("   Model not found. You need to train it first.")
        print("   Run: python manage.py train_model")
        return
    
    # Test 2: Make predictions
    print("\n2. Making test predictions...")
    
    test_cases = [
        {
            'name': '🔴 CRITICAL Shortage',
            'data': {
                'medicine_id': 'TEST001',
                'hospital_id': 'HOSP001',
                'current_stock': 15,
                'daily_consumption': 10,
                'reorder_level': 100,
                'drug_category': 'Antibiotic',
                'hospital_type': 'Government',
                'hospital_bed_count': 500,
                'last_updated': '2024-01-22'
            }
        },
        {
            'name': '🟢 Adequate Stock',
            'data': {
                'medicine_id': 'TEST002',
                'hospital_id': 'HOSP002',
                'current_stock': 300,
                'daily_consumption': 5,
                'reorder_level': 50,
                'drug_category': 'Analgesic',
                'hospital_type': 'Private',
                'hospital_bed_count': 200,
                'last_updated': '2024-01-22'
            }
        }
    ]
    
    for test in test_cases:
        print(f"\n   {test['name']}:")
        result = predictor_instance.predict(test['data'])
        print(f"   Probability: {result['shortage_probability']:.2%}")
        print(f"   Risk Level: {result['risk_level']}")
        print(f"   Recommendation: {result['recommendation']}")
    
    print("\n" + "="*50)
    print("✅ Test Complete!")
    print("="*50)

if __name__ == "__main__":
    test_model()