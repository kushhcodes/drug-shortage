from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Alert, RedistributionRequest
from .serializers import AlertSerializer, AlertListSerializer, RedistributionRequestSerializer
from accounts.permissions import IsHealthAuthority

# Create your views here.
class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.select_related('hospital', 'medicine', 'inventory').all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AlertListSerializer
        return AlertSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Alert.objects.select_related('hospital', 'medicine', 'inventory')
        
        if user.is_superuser or user.role == 'HEALTH_AUTHORITY':
            return queryset.all()
        elif user.is_hospital_staff and user.hospital:
            return queryset.filter(hospital=user.hospital)
        return queryset.none()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        alerts = self.get_queryset().filter(status='ACTIVE')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def critical(self, request):
        alerts = self.get_queryset().filter(severity='CRITICAL', status='ACTIVE')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'ACKNOWLEDGED'
        alert.acknowledged_by = request.user
        alert.acknowledged_at = timezone.now()
        alert.save()
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'RESOLVED'
        alert.resolved_by = request.user
        alert.resolved_at = timezone.now()
        alert.resolution_notes = request.data.get('notes', '')
        alert.save()
        serializer = self.get_serializer(alert)
        return Response(serializer.data)


class RedistributionRequestViewSet(viewsets.ModelViewSet):
    queryset = RedistributionRequest.objects.select_related('source_hospital', 'destination_hospital', 'medicine').all()
    serializer_class = RedistributionRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = RedistributionRequest.objects.select_related('source_hospital', 'destination_hospital', 'medicine')
        
        if user.is_superuser or user.role == 'HEALTH_AUTHORITY':
            return queryset.all()
        elif user.is_hospital_staff and user.hospital:
            return queryset.filter(source_hospital=user.hospital) | queryset.filter(destination_hospital=user.hospital)
        return queryset.none()
    
    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsHealthAuthority])
    def approve(self, request, pk=None):
        redistribution = self.get_object()
        redistribution.status = 'APPROVED'
        redistribution.approved_by = request.user
        redistribution.approved_at = timezone.now()
        redistribution.approved_quantity = request.data.get('approved_quantity', redistribution.requested_quantity)
        redistribution.save()
        serializer = self.get_serializer(redistribution)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsHealthAuthority])
    def reject(self, request, pk=None):
        redistribution = self.get_object()
        redistribution.status = 'REJECTED'
        redistribution.approved_by = request.user
        redistribution.approved_at = timezone.now()
        redistribution.rejection_reason = request.data.get('reason', '')
        redistribution.save()
        serializer = self.get_serializer(redistribution)
        return Response(serializer.data)