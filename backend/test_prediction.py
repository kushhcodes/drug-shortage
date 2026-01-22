#!/usr/bin/env python
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from predictions.forecaster import predictor

# Test the model
print("🧪 Testing ML Model")
print("=" * 50)

# Train model
print("Training model...")
accuracy = predictor.train_model()
print(f"Accuracy: {accuracy:.2%}")

# Test prediction
test_data = {
    'current_stock': 50,
    'daily_consumption': 20,
    'reorder_level': 100,
    'month': 8  # August (monsoon)
}

result = predictor.predict(test_data)
print(f"\nTest Prediction:")
print(f"  Shortage Probability: {result['shortage_probability']:.2%}")
print(f"  Risk Level: {result['risk_level']}")
print(f"  Prediction: {result['prediction']}")
print(f"  Days of Supply: {result['days_of_supply']:.1f}")

print("\n✅ Setup complete!")
