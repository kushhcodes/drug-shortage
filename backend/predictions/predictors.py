# backend/predictions/predictors.py
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from datetime import datetime
import os
from django.conf import settings

class DrugShortagePredictor:
    """
    Predicts the probability of a drug shortage for a given inventory item.
    """

    def __init__(self, model_name='xgb'):
        self.model = None
        self.scaler = None
        self.label_encoders = {}  # For categorical fields like 'drug_category'
        self.model_name = model_name
        self.feature_columns = [
            'current_stock', 'daily_consumption_avg', 'lead_time_days',
            'stock_cover_ratio', 'hospital_bed_count', 'month_sin', 'month_cos',
            'is_peak_season', 'drug_category_encoded'
        ]

    def create_features(self, inventory_data):
        """
        Transforms raw inventory data into ML features.
        `inventory_data` can be a dict or a pandas DataFrame row.
        """
        if isinstance(inventory_data, dict):
            df = pd.DataFrame([inventory_data])
        else:
            df = inventory_data.copy()

        # 1. Handle Dates & Seasonality
        df['date'] = pd.to_datetime(df.get('last_updated', datetime.now()))
        df['month'] = df['date'].dt.month
        # Cyclical encoding for months (Jan close to Dec)
        df['month_sin'] = np.sin(2 * np.pi * df['month']/12)
        df['month_cos'] = np.cos(2 * np.pi * df['month']/12)

        # Define peak seasons (e.g., monsoon: 6-9, flu: 10-12 in India)
        df['is_peak_season'] = df['month'].apply(lambda x: 1 if x in [6,7,8,9,10,11,12] else 0)

        # 2. Calculate Key Ratios
        df['daily_consumption_avg'] = df.get('daily_consumption', 0)
        df['stock_cover_ratio'] = np.where(
            df['daily_consumption_avg'] > 0,
            df['current_stock'] / df['daily_consumption_avg'],
            100  # Large number if no consumption
        )

        # 3. Encode Categorical Data (e.g., drug type)
        if 'drug_category' in df.columns:
            # In a real scenario, fit this during training and load here
            le = LabelEncoder()
            # This is simplified; you should save/load the fitted encoder
            df['drug_category_encoded'] = le.fit_transform(df['drug_category'].fillna('Unknown'))

        # 4. Ensure all required feature columns exist
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0  # Or a sensible default

        return df[self.feature_columns]

    def load_model(self, model_path=None):
        """
        Loads the trained model and scaler from disk.
        """
        if model_path is None:
            # Assuming the model is stored in the project root's ml_models folder
            model_path = os.path.join(settings.BASE_DIR, '..', 'ml_models')

        try:
            self.model = joblib.load(os.path.join(model_path, f'{self.model_name}_model.pkl'))
            self.scaler = joblib.load(os.path.join(model_path, 'scaler.pkl'))
            print(f"Model and scaler loaded from {model_path}")
            return True
        except FileNotFoundError as e:
            print(f"Model files not found: {e}. You need to train the model first.")
            return False

    def predict(self, inventory_data):
        """
        Makes a prediction for a single inventory record.
        Returns a dictionary with prediction results.
        """
        if self.model is None:
            if not self.load_model():
                raise ValueError("Model failed to load. Cannot predict.")

        # 1. Create features from the input data
        features_df = self.create_features(inventory_data)

        # 2. Scale the features
        features_scaled = self.scaler.transform(features_df)

        # 3. Predict
        shortage_probability = self.model.predict_proba(features_scaled)[0][1]
        prediction_class = 1 if shortage_probability > 0.5 else 0

        # 4. Interpret results
        risk_level = "LOW"
        if shortage_probability > 0.75:
            risk_level = "CRITICAL"
        elif shortage_probability > 0.5:
            risk_level = "HIGH"
        elif shortage_probability > 0.25:
            risk_level = "MEDIUM"

        return {
            'shortage_predicted': bool(prediction_class),
            'shortage_probability': round(float(shortage_probability), 4),
            'risk_level': risk_level,
            'features_used': features_df.to_dict('records')[0]
        }