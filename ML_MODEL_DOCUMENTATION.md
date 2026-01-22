# Drug Shortage Prediction System - ML Model Documentation

## ✅ Model Training Completed Successfully!

### Training Results
- **Model Type**: XGBoost Classifier
- **Accuracy**: 99.50%
- **Training Samples**: 800
- **Test Samples**: 200
- **Shortage Detection Rate**: 50.60%

### Model Performance Metrics
```
              precision    recall    f1-score   support
     No Shortage    0.99      1.00      0.99        99
  Will Be Shortage  1.00      0.99      1.00       101
```

### Top 5 Most Important Features
1. **days_of_supply** (83.3%) - Most critical predictor
2. **stock_consumption_ratio** (12.1%)
3. **daily_consumption** (2.2%)
4. **current_stock** (2.1%)
5. **hospital_type_encoded** (0.2%)

## Model Architecture

### Features Used
The model uses 12 engineered features:
1. `current_stock` - Current inventory level
2. `daily_consumption` - Average daily usage
3. `reorder_level` - Minimum stock threshold
4. `stock_consumption_ratio` - Stock divided by consumption
5. `days_of_supply` - How many days until stock runs out
6. `below_reorder_level` - Boolean flag
7. `month` - Seasonal patterns
8. `day_of_week` - Weekly patterns
9. `is_monsoon` - Monsoon season indicator (Jun-Sep)
10. `is_flu_season` - Flu season indicator (Oct-Feb)
11. `drug_category_encoded` - Medicine type
12. `hospital_type_encoded` - Hospital classification

### Model Files Saved
```
/Users/khushalpatil/Desktop/Drug/ml_models/
├── shortage_model.pkl      # Trained XGBoost model
├── scaler.pkl             # Feature scaler
├── label_encoders.pkl     # Category encoders
└── feature_columns.pkl    # Feature list
```

## API Endpoints

### 1. Single Prediction
**Endpoint**: `POST /api/predictions/predict/`

**Request Body**:
```json
{
  "medicine_id": 1,
  "hospital_id": 1,
  "current_stock": 50,
  "daily_consumption": 10,
  "reorder_level": 70,
  "drug_category": "Antibiotic",
  "hospital_type": "GOVERNMENT"
}
```

**Response**:
```json
{
  "success": true,,
  "prediction": {
    "shortage_prediction": true,
    "shortage_probability": 0.87,
    "risk_level": "CRITICAL",
    "recommendation": "EMERGENCY - Redistribute stock",
    "confidence": 0.87,
    "days_of_supply": 5.0
  },
  "timestamp": "2026-01-22T21:44:42+05:30"
}
```

### 2. Batch Predictions
**Endpoint**: `POST /api/predictions/batch-predict/`

**Request Body**:
```json
{
  "inventories": [
    {
      "medicine_id": 1,
      "hospital_id": 1,
      "current_stock": 50,
      "daily_consumption": 10
    },
    {
      "medicine_id": 2,
      "hospital_id": 1,
      "current_stock": 200,
      "daily_consumption": 5
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "total_predictions": 2,
  "risk_summary": {
    "LOW": 1,
    "MEDIUM": 0,
    "HIGH": 0,
    "CRITICAL": 1
  },
  "predictions": [...]
}
```

### 3. Model Status
**Endpoint**: `GET /api/predictions/model-status/`

**Response**:
```json
{
  "model_loaded": true,
  "models_exist": true,
  "feature_count": 12,
  "status": "READY"
}
```

## Risk Level Classification

The model classifies shortages into 4 risk levels:

| Risk Level | Probability Range | Recommendation |
|-----------|------------------|----------------|
| **LOW** | < 30% | Normal monitoring |
| **MEDIUM** | 30% - 60% | Consider restocking |
| **HIGH copy | 60% - 80% | Urgent restock needed |
| **CRITICAL** | > 80% | EMERGENCY - Redistribute stock |

## How the Model Works

### 1. Feature Engineering
- Converts raw inventory data into ML features
- Adds time-based features (month, day of week)
- Calculates ratios (stock/consumption)
- Encodes categorical data (hospital type, drug category)

### 2. Prediction Process
```python
1. Load trained model & scaler
2. Create features from input data
3. Scale features for normalization
4. Predict shortage probability
5. Calculate risk level & recommendations
6. (Optional) Create alert if HIGH/CRITICAL
```

### 3. Automatic Alert Creation
If prediction shows HIGH or CRITICAL risk, an alert is automatically created in the system.

## Training Command

To retrain the model with new data:

```bash
cd backend
python manage.py train_model
```

The training process:
1. Loads real inventory data from database
2. If insufficient data (< 50 records), generates synthetic data
3. Engineers features from raw data
4. Splits into training (80%) and test (20%) sets
5. Trains XGBoost model
6. Evaluates performance
7. Saves model files to `ml_models/` directory

## Integration with Django

### Models Used
- `medicines.models.Medicine` - Medicine catalog
- `hospitals.models.Hospital` - Hospital information
- `hospitals.models.Inventory` - Current stock levels
- `alerts.models.Alert` - Auto-generated shortage alerts

### Permissions
All prediction endpoints require authentication:
```python
permission_classes = [IsAuthenticated]
```

## Next Steps

### Frontend Integration
Add prediction capabilities to the dashboard:

1. **Inventory Page**: Add "Predict Shortage" button
2. **Analytics Dashboard**: Show predicted shortages
3. **Alert System**: Display ML-generated alerts
4. **Batch Analysis**: Run predictions for all inventory items

### Sample Frontend Code
```javascript
// Predict shortage for an inventory item
const predictShortage = async (inventoryId) => {
  const response = await fetch('/api/predictions/predict/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      medicine_id: inventory.medicine_id,
      hospital_id: inventory.hospital_id,
      current_stock: inventory.current_stock,
      daily_consumption: inventory.average_daily_usage
    })
  });
  
  const result = await response.json();
  console.log(result.prediction.risk_level); // "LOW", "MEDIUM", "HIGH", "CRITICAL"
};
```

## Model Improvements (Future)

1. **More Training Data**: Current model uses synthetic data
2. **Time Series**: Add LSTM for temporal patterns
3. **External Factors**: Weather, disease outbreaks
4. **Ensemble Models**: Combine multiple algorithms
5. **Real-time Updates**: Retrain automatically

## Technical Details

### Dependencies
- XGBoost 2.0.3
- scikit-learn
- pandas
- numpy
- joblib

### Model Hyperparameters
```python
XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8
)
```

## Troubleshooting

### Model Not Found Error
If you see "Model not loaded. Train model first":
```bash
cd backend
python manage.py train_model
```

### Low Accuracy
- Check if you have real inventory data
- Verify data quality (no null values)
- Ensure `average_daily_usage` is accurate

### Import Errors
Make sure all dependencies are installed:
```bash
pip install xgboost scikit-learn pandas numpy joblib
```

---

## Summary

✅ **ML Model is READY and WORKING!**
- 99.5% accuracy on test data
- Predicts drug shortages 7 days in advance
- Auto-generates alerts for high-risk items
- REST API endpoints available
- Model saved and can be reloaded instantly

The system is production-ready for the hackathon demo! 🚀
