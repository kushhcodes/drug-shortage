from rest_framework import serializers
from .models import Alert, RedistributionRequest


class AlertSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    acknowledged_by_name = serializers.CharField(source='acknowledged_by.get_full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AlertListSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    
    class Meta:
        model = Alert
        fields = ['id', 'hospital_name', 'medicine_name', 'severity', 'status', 'current_stock', 'predicted_stockout_date', 'created_at']


class RedistributionRequestSerializer(serializers.ModelSerializer):
    source_hospital_name = serializers.CharField(source='source_hospital.name', read_only=True)
    destination_hospital_name = serializers.CharField(source='destination_hospital.name', read_only=True)
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = RedistributionRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'requested_by']