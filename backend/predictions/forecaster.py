import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.utils import timezone
from hospitals.models import Inventory, InventoryTransaction
from alerts.models import Alert
from medicines.models import Medicine


class DrugShortageForecaster:
    
    def predict_shortage(self, inventory_id, days_ahead=30):
        try:
            inventory = Inventory.objects.get(id=inventory_id)
        except Inventory.DoesNotExist:
            return None
        
        transactions = InventoryTransaction.objects.filter(
            inventory=inventory,
            transaction_type='CONSUMPTION'
        ).order_by('-transaction_date')[:90]
        
        if not transactions.exists():
            daily_usage = inventory.average_daily_usage
        else:
            consumption_data = [abs(t.quantity) for t in transactions]
            daily_usage = np.mean(consumption_data) if consumption_data else inventory.average_daily_usage
        
        if daily_usage <= 0:
            return None
        
        days_remaining = int(inventory.current_stock / daily_usage)
        stockout_date = timezone.now() + timedelta(days=days_remaining)
        
        if days_remaining <= days_ahead:
            shortage_quantity = int((days_ahead - days_remaining) * daily_usage)
            
            severity = self._calculate_severity(days_remaining)
            confidence = self._calculate_confidence(len(transactions))
            
            return {
                'inventory': inventory,
                'current_stock': inventory.current_stock,
                'daily_usage': float(daily_usage),
                'days_remaining': days_remaining,
                'stockout_date': stockout_date,
                'shortage_quantity': shortage_quantity,
                'severity': severity,
                'confidence': confidence
            }
        
        return None
    
    def _calculate_severity(self, days_remaining):
        if days_remaining <= 3:
            return 'CRITICAL'
        elif days_remaining <= 7:
            return 'HIGH'
        elif days_remaining <= 15:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _calculate_confidence(self, num_transactions):
        if num_transactions >= 60:
            return 95.0
        elif num_transactions >= 30:
            return 85.0
        elif num_transactions >= 15:
            return 75.0
        else:
            return 60.0
    
    def create_alert(self, prediction):
        if not prediction:
            return None
        
        existing_alert = Alert.objects.filter(
            inventory=prediction['inventory'],
            status='ACTIVE'
        ).first()
        
        if existing_alert:
            existing_alert.current_stock = prediction['current_stock']
            existing_alert.predicted_stockout_date = prediction['stockout_date']
            existing_alert.predicted_shortage_quantity = prediction['shortage_quantity']
            existing_alert.severity = prediction['severity']
            existing_alert.confidence_score = prediction['confidence']
            existing_alert.save()
            return existing_alert
        
        message = (
            f"{prediction['severity']} shortage alert for {prediction['inventory'].medicine.name} "
            f"at {prediction['inventory'].hospital.name}. "
            f"Current stock: {prediction['current_stock']} units. "
            f"Predicted stockout in {prediction['days_remaining']} days. "
            f"Estimated shortage: {prediction['shortage_quantity']} units."
        )
        
        alert = Alert.objects.create(
            hospital=prediction['inventory'].hospital,
            medicine=prediction['inventory'].medicine,
            inventory=prediction['inventory'],
            severity=prediction['severity'],
            current_stock=prediction['current_stock'],
            predicted_stockout_date=prediction['stockout_date'],
            predicted_shortage_quantity=prediction['shortage_quantity'],
            confidence_score=prediction['confidence'],
            message=message
        )
        
        return alert
    
    def run_predictions_for_hospital(self, hospital):
        inventories = Inventory.objects.filter(hospital=hospital)
        alerts_created = []
        
        for inventory in inventories:
            prediction = self.predict_shortage(inventory.id)
            if prediction:
                alert = self.create_alert(prediction)
                if alert:
                    alerts_created.append(alert)
        
        return alerts_created
    
    def run_predictions_all_hospitals(self):
        from hospitals.models import Hospital
        hospitals = Hospital.objects.filter(is_active=True)
        all_alerts = []
        
        for hospital in hospitals:
            alerts = self.run_predictions_for_hospital(hospital)
            all_alerts.extend(alerts)
        
        return all_alerts