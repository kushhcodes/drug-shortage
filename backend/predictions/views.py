# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from .forecaster import DrugShortageForecaster
# from accounts.permissions import IsHealthAuthority, IsHospitalStaff

# # Create your views here.
# class RunPredictionsView(APIView):
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         user = request.user
#         forecaster = DrugShortageForecaster()
        
#         if user.role == 'HEALTH_AUTHORITY':
#             alerts = forecaster.run_predictions_all_hospitals()
#             return Response({
#                 'message': f'Predictions completed for all hospitals',
#                 'alerts_created': len(alerts)
#             })
        
#         elif user.is_hospital_staff and user.hospital:
#             alerts = forecaster.run_predictions_for_hospital(user.hospital)
#             return Response({
#                 'message': f'Predictions completed for {user.hospital.name}',
#                 'alerts_created': len(alerts)
#             })
        
#         return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)


# class PredictInventoryView(APIView):
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request):
#         inventory_id = request.data.get('inventory_id')
#         days_ahead = request.data.get('days_ahead', 30)
        
#         if not inventory_id:
#             return Response({'error': 'inventory_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
#         forecaster = DrugShortageForecaster()
#         prediction = forecaster.predict_shortage(inventory_id, days_ahead)
        
#         if prediction:
#             return Response({
#                 'medicine': prediction['inventory'].medicine.name,
#                 'hospital': prediction['inventory'].hospital.name,
#                 'current_stock': prediction['current_stock'],
#                 'daily_usage': prediction['daily_usage'],
#                 'days_remaining': prediction['days_remaining'],
#                 'stockout_date': prediction['stockout_date'],
#                 'shortage_quantity': prediction['shortage_quantity'],
#                 'severity': prediction['severity'],
#                 'confidence': prediction['confidence']
#             })
        
#         return Response({'message': 'No shortage predicted'}, status=status.HTTP_200_OK)



# Drug/backend/predictions/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .forecaster import predictor_instance

class PredictShortageView(APIView):
    """
    Predict shortage for a specific drug in a hospital
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            data = request.data
            
            # Required fields
            required_fields = ['medicine_id', 'hospital_id', 'current_stock', 'daily_consumption']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {'error': f'Missing required field: {field}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Add default values
            defaults = {
                'reorder_level': data.get('daily_consumption', 0) * 7,
                'drug_category': 'General', 
                'hospital_type': 'General',
                'hospital_bed_count': 100,  # Default if hospital lookup fails
                'last_updated': timezone.now().isoformat()
            }
            
            # Try to fetch actual hospital details if ID provided
            if 'hospital_id' in data:
                try:
                    from hospitals.models import Hospital
                    hospital = Hospital.objects.get(id=data['hospital_id'])
                    defaults['hospital_type'] = hospital.hospital_type
                    defaults['hospital_bed_count'] = hospital.bed_capacity
                except Exception:
                    pass

            for key, value in defaults.items():
                if key not in data:
                    data[key] = value
            
            # Make prediction
            prediction = predictor_instance.predict(data)
            
            # Create alert if high risk
            if prediction['risk_level'] in ['HIGH', 'CRITICAL']:
                try:
                    from alerts.models import Alert
                    from hospitals.models import Inventory
                    from datetime import timedelta
                    
                    # Fetch inventory object (required for Alert)
                    inventory = Inventory.objects.filter(
                        hospital_id=data['hospital_id'], 
                        medicine_id=data['medicine_id']
                    ).first()
                    
                    if inventory:
                        # Calculate details
                        daily = float(data.get('daily_consumption', 1))
                        current = float(data.get('current_stock', 0))
                        days_left = current / daily if daily > 0 else 0
                        stockout_date = timezone.now() + timedelta(days=days_left)
                        shortage_qty = int((daily * 7) - current)
                        if shortage_qty < 0: shortage_qty = 0

                        Alert.objects.create(
                            hospital_id=data['hospital_id'],
                            medicine_id=data['medicine_id'],
                            inventory=inventory,
                            severity=prediction['risk_level'],
                            current_stock=int(current),
                            predicted_stockout_date=stockout_date.date(),
                            predicted_shortage_quantity=shortage_qty,
                            confidence_score=prediction['shortage_probability'] * 100,
                            message=f"Predicted shortage with {prediction['shortage_probability']:.1%} probability"
                        )
                except Exception as e:
                    print(f"Error creating alert: {e}")
                    # Continue even if alert creation fails
            
            return Response({
                'success': True,
                'prediction': prediction,
                'timestamp': timezone.now().isoformat()
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BatchPredictView(APIView):
    """
    Predict shortages for multiple items
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            inventory_list = request.data.get('inventories', [])
            
            if not inventory_list:
                return Response(
                    {'error': 'No inventory data provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            predictions = predictor_instance.batch_predict(inventory_list)
            
            # Count by risk level
            risk_counts = {
                'LOW': len([p for p in predictions if p['risk_level'] == 'LOW']),
                'MEDIUM': len([p for p in predictions if p['risk_level'] == 'MEDIUM']),
                'HIGH': len([p for p in predictions if p['risk_level'] == 'HIGH']),
                'CRITICAL': len([p for p in predictions if p['risk_level'] == 'CRITICAL'])
            }
            
            return Response({
                'success': True,
                'total_predictions': len(predictions),
                'risk_summary': risk_counts,
                'predictions': predictions[:50]  # Limit response
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModelStatusView(APIView):
    """
    Check ML model status
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        import os
        from django.conf import settings
        
        model_path = os.path.join(settings.BASE_DIR, '..', 'ml_models')
        models_exist = os.path.exists(os.path.join(model_path, 'shortage_model.pkl'))
        
        # Try to load if exists but not loaded
        if models_exist and predictor_instance.model is None:
            predictor_instance.load_model()
        
        return Response({
            'model_loaded': predictor_instance.model is not None,
            'models_exist': models_exist,
            'feature_count': len(predictor_instance.feature_columns) if predictor_instance.feature_columns else 0,
            'status': 'READY' if predictor_instance.model else 'NOT_TRAINED'
        })