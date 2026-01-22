# Drug/backend/predictions/forecaster.py
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta
from django.conf import settings

# ML Libraries
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

class DrugShortagePredictor:
    """
    ML Model for predicting drug shortages.
    Uses hospital and medicine data to predict shortages 7 days in advance.
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        self.model_path = os.path.join(settings.BASE_DIR, '..', 'ml_models')
        
    def create_features(self, df, is_training=True):
        """
        Create features from raw data for ML model
        """
        # Make a copy to avoid modifying original
        df = df.copy()
        
        # 1. TIME-BASED FEATURES
        if 'last_updated' in df.columns:
            df['date'] = pd.to_datetime(df['last_updated'])
            df['month'] = df['date'].dt.month
            df['day_of_week'] = df['date'].dt.dayofweek
            df['week_of_year'] = df['date'].dt.isocalendar().week
            
        # 2. SEASONAL FEATURES (India specific)
        # Monsoon season: June-Sept
        df['is_monsoon'] = df.get('month', 1).apply(
            lambda x: 1 if x in [6, 7, 8, 9] else 0
        )
        # Winter/Flu season: Oct-Feb
        df['is_flu_season'] = df.get('month', 1).apply(
            lambda x: 1 if x in [10, 11, 12, 1, 2] else 0
        )
        
        # 3. STOCK-RELATED FEATURES
        df['stock_consumption_ratio'] = df['current_stock'] / (df['daily_consumption'] + 1)
        df['days_of_supply'] = df['current_stock'] / (df['daily_consumption'] + 0.01)
        df['below_reorder_level'] = (df['current_stock'] < df['reorder_level']).astype(int)
        
        # 4. HOSPITAL-SPECIFIC FEATURES
        if 'hospital_bed_count' in df.columns:
            df['bed_count_scaled'] = df['hospital_bed_count'] / 1000
        
        # 5. DRUG CATEGORY ENCODING
        if 'drug_category' in df.columns:
            if is_training:
                le = LabelEncoder()
                df['drug_category_encoded'] = le.fit_transform(df['drug_category'].fillna('Unknown'))
                self.label_encoders['drug_category'] = le
            else:
                # During prediction, use existing encoder
                le = self.label_encoders.get('drug_category')
                if le:
                    df['drug_category_encoded'] = le.transform(df['drug_category'].fillna('Unknown'))
        
        # 6. HOSPITAL TYPE ENCODING
        if 'hospital_type' in df.columns:
            if is_training:
                le = LabelEncoder()
                df['hospital_type_encoded'] = le.fit_transform(df['hospital_type'].fillna('Unknown'))
                self.label_encoders['hospital_type'] = le
            else:
                le = self.label_encoders.get('hospital_type')
                if le:
                    df['hospital_type_encoded'] = le.transform(df['hospital_type'].fillna('Unknown'))
        
        # Define feature columns
        self.feature_columns = [
            'current_stock', 'daily_consumption', 'reorder_level',
            'stock_consumption_ratio', 'days_of_supply', 'below_reorder_level',
            'month', 'day_of_week', 'is_monsoon', 'is_flu_season',
            'drug_category_encoded', 'hospital_type_encoded'
        ]
        
        # Add conditional columns
        if 'bed_count_scaled' in df.columns:
            self.feature_columns.append('bed_count_scaled')
        
        return df
    
    def prepare_training_data(self):
        """
        Get data from your database and prepare for training
        """
        try:
            # Import your models
            from medicines.models import Medicine, Inventory
            from hospitals.models import Hospital
            
            # Get all inventory records
            inventories = Inventory.objects.select_related('medicine', 'hospital').all()
            
            data = []
            for inv in inventories:
                record = {
                    'inventory_id': inv.id,
                    'medicine_id': inv.medicine.id,
                    'medicine_name': inv.medicine.name,
                    'drug_category': inv.medicine.category,
                    'hospital_id': inv.hospital.id,
                    'hospital_name': inv.hospital.name,
                    'hospital_type': inv.hospital.hospital_type,
                    'hospital_bed_count': inv.hospital.bed_count or 100,
                    'current_stock': inv.current_stock or 0,
                    'daily_consumption': inv.daily_consumption or 0,
                    'reorder_level': inv.reorder_level or 50,
                    'last_updated': inv.last_updated or datetime.now(),
                    'lead_time': inv.lead_time or 7,
                }
                data.append(record)
            
            df = pd.DataFrame(data)
            
            # If no real data, generate synthetic data
            if len(df) < 50:
                print("Not enough real data. Generating synthetic data for training...")
                df = self.generate_synthetic_data(1000)
            
            # Create target variable: Will there be a shortage in next 7 days?
            # Shortage = stock < (daily_consumption * 7 * 1.2) with 20% buffer
            df['shortage_next_7d'] = 0
            required_stock = df['daily_consumption'] * 7 * 1.2
            df.loc[df['current_stock'] < required_stock, 'shortage_next_7d'] = 1
            
            return df
            
        except Exception as e:
            print(f"Error loading data: {e}")
            print("Generating synthetic data instead...")
            return self.generate_synthetic_data(2000)
    
    def generate_synthetic_data(self, num_samples=1000):
        """
        Generate synthetic training data for hackathon
        """
        np.random.seed(42)
        
        data = []
        for i in range(num_samples):
            record = {
                'medicine_id': f'MED{np.random.randint(1, 50):03d}',
                'medicine_name': f'Medicine_{np.random.choice(["Paracetamol", "Amoxicillin", "Insulin", "Oxygen"])}',
                'drug_category': np.random.choice(['Antibiotic', 'Analgesic', 'Antiviral', 'Antihypertensive', 'Insulin']),
                'hospital_id': f'HOSP{np.random.randint(1, 20):03d}',
                'hospital_name': f'Hospital_{np.random.randint(1, 20)}',
                'hospital_type': np.random.choice(['Government', 'Private', 'Medical College', 'Rural']),
                'hospital_bed_count': np.random.choice([50, 100, 200, 500, 1000]),
                'current_stock': np.random.randint(0, 500),
                'daily_consumption': np.random.randint(1, 50),
                'reorder_level': np.random.randint(20, 100),
                'lead_time': np.random.randint(3, 14),
                'last_updated': (datetime.now() - timedelta(days=np.random.randint(0, 365))).strftime('%Y-%m-%d')
            }
            data.append(record)
        
        df = pd.DataFrame(data)
        
        # Add realistic patterns
        # Monsoon increases antibiotic consumption
        monsoon_mask = df['drug_category'] == 'Antibiotic'
        df.loc[monsoon_mask, 'daily_consumption'] = df.loc[monsoon_mask, 'daily_consumption'] * 1.5
        
        # Rural hospitals have lower stock
        rural_mask = df['hospital_type'] == 'Rural'
        df.loc[rural_mask, 'current_stock'] = df.loc[rural_mask, 'current_stock'] * 0.7
        
        return df
    
    def train_model(self):
        """
        Train the ML model
        """
        print("Step 1: Preparing training data...")
        df = self.prepare_training_data()
        
        print("Step 2: Creating features...")
        df = self.create_features(df, is_training=True)
        
        print("Step 3: Splitting data...")
        # Separate features and target
        X = df[self.feature_columns]
        y = df['shortage_next_7d']
        
        # Split data (80% train, 20% test)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training samples: {len(X_train)}")
        print(f"Test samples: {len(X_test)}")
        print(f"Shortage rate: {y.mean():.2%}")
        
        print("Step 4: Scaling features...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print("Step 5: Training XGBoost model...")
        # Train XGBoost (usually best for tabular data)
        self.model = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss',
            use_label_encoder=False
        )
        
        self.model.fit(
            X_train_scaled, 
            y_train,
            eval_set=[(X_test_scaled, y_test)],
            verbose=False
        )
        
        print("Step 6: Evaluating model...")
        y_pred = self.model.predict(X_test_scaled)
        y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
        
        accuracy = accuracy_score(y_test, y_pred)
        print(f"\n📊 Model Performance:")
        print(f"   Accuracy: {accuracy:.2%}")
        print(f"   Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(f"\n🔍 Top 5 Important Features:")
        for idx, row in feature_importance.head().iterrows():
            print(f"   {row['feature']}: {row['importance']:.3f}")
        
        print("Step 7: Saving model...")
        self.save_model()
        
        return accuracy
    
    def save_model(self):
        """Save trained model to disk"""
        os.makedirs(self.model_path, exist_ok=True)
        
        joblib.dump(self.model, os.path.join(self.model_path, 'shortage_model.pkl'))
        joblib.dump(self.scaler, os.path.join(self.model_path, 'scaler.pkl'))
        joblib.dump(self.label_encoders, os.path.join(self.model_path, 'label_encoders.pkl'))
        joblib.dump(self.feature_columns, os.path.join(self.model_path, 'feature_columns.pkl'))
        
        print(f"✅ Model saved to: {self.model_path}")
    
    def load_model(self):
        """Load trained model from disk"""
        try:
            self.model = joblib.load(os.path.join(self.model_path, 'shortage_model.pkl'))
            self.scaler = joblib.load(os.path.join(self.model_path, 'scaler.pkl'))
            self.label_encoders = joblib.load(os.path.join(self.model_path, 'label_encoders.pkl'))
            self.feature_columns = joblib.load(os.path.join(self.model_path, 'feature_columns.pkl'))
            print("✅ Model loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def predict(self, input_data):
        """
        Make prediction for a single inventory item
        input_data: dict with inventory details
        """
        if self.model is None:
            if not self.load_model():
                raise Exception("Model not loaded. Train model first.")
        
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Create features
        df = self.create_features(df, is_training=False)
        
        # Ensure all features exist
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        # Scale features
        X = df[self.feature_columns]
        X_scaled = self.scaler.transform(X)
        
        # Predict
        probability = self.model.predict_proba(X_scaled)[0][1]
        prediction = 1 if probability > 0.5 else 0
        
        # Calculate risk level
        if probability < 0.3:
            risk = "LOW"
            recommendation = "Normal monitoring"
        elif probability < 0.6:
            risk = "MEDIUM"
            recommendation = "Consider restocking"
        elif probability < 0.8:
            risk = "HIGH"
            recommendation = "Urgent restock needed"
        else:
            risk = "CRITICAL"
            recommendation = "EMERGENCY - Redistribute stock"
        
        return {
            'shortage_prediction': bool(prediction),
            'shortage_probability': float(probability),
            'risk_level': risk,
            'recommendation': recommendation,
            'confidence': float(probability) if prediction else float(1 - probability),
            'days_of_supply': float(df['days_of_supply'].iloc[0]) if 'days_of_supply' in df.columns else 0
        }
    
    def batch_predict(self, inventory_list):
        """
        Predict shortages for multiple items
        """
        predictions = []
        for item in inventory_list:
            try:
                pred = self.predict(item)
                pred['medicine_id'] = item.get('medicine_id')
                pred['hospital_id'] = item.get('hospital_id')
                predictions.append(pred)
            except Exception as e:
                print(f"Error predicting for item {item.get('medicine_id')}: {e}")
        
        # Sort by risk
        predictions.sort(key=lambda x: x['shortage_probability'], reverse=True)
        
        return predictions


# Singleton instance
predictor_instance = DrugShortagePredictor()