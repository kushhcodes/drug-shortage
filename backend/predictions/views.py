from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .forecaster import DrugShortageForecaster
from accounts.permissions import IsHealthAuthority, IsHospitalStaff

# Create your views here.
class RunPredictionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        forecaster = DrugShortageForecaster()
        
        if user.role == 'HEALTH_AUTHORITY':
            alerts = forecaster.run_predictions_all_hospitals()
            return Response({
                'message': f'Predictions completed for all hospitals',
                'alerts_created': len(alerts)
            })
        
        elif user.is_hospital_staff and user.hospital:
            alerts = forecaster.run_predictions_for_hospital(user.hospital)
            return Response({
                'message': f'Predictions completed for {user.hospital.name}',
                'alerts_created': len(alerts)
            })
        
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)


class PredictInventoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        inventory_id = request.data.get('inventory_id')
        days_ahead = request.data.get('days_ahead', 30)
        
        if not inventory_id:
            return Response({'error': 'inventory_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        forecaster = DrugShortageForecaster()
        prediction = forecaster.predict_shortage(inventory_id, days_ahead)
        
        if prediction:
            return Response({
                'medicine': prediction['inventory'].medicine.name,
                'hospital': prediction['inventory'].hospital.name,
                'current_stock': prediction['current_stock'],
                'daily_usage': prediction['daily_usage'],
                'days_remaining': prediction['days_remaining'],
                'stockout_date': prediction['stockout_date'],
                'shortage_quantity': prediction['shortage_quantity'],
                'severity': prediction['severity'],
                'confidence': prediction['confidence']
            })
        
        return Response({'message': 'No shortage predicted'}, status=status.HTTP_200_OK)