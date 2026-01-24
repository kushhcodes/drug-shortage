from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, F
from .models import Hospital, Inventory, InventoryTransaction
from .serializers import (
    HospitalSerializer, HospitalListSerializer, InventorySerializer,
    InventoryUpdateSerializer, InventoryTransactionSerializer,
    InventoryTransactionCreateSerializer
)
from accounts.permissions import IsHospitalStaff, IsHealthAuthority, IsSameHospital


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HospitalListSerializer
        return HospitalSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'HEALTH_AUTHORITY':
            return Hospital.objects.all()
        elif user.is_hospital_staff:
            # If user has a hospital, show it
            if user.hospital:
                return Hospital.objects.filter(id=user.hospital.id)
            # If user has NO hospital, let them see nothing (until they create one)
            return Hospital.objects.none()
        return Hospital.objects.none()

    def perform_create(self, serializer):
        hospital = serializer.save()
        user = self.request.user
        # If user has no hospital, assign this new one to them!
        if not user.hospital:
            user.hospital = hospital
            user.save()
            # Force refresh of user instance to update permissions/queryset logic immediately
            user.refresh_from_db()
    
    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        hospital = self.get_object()
        inventory = hospital.inventory.select_related('medicine').all()
        serializer = InventorySerializer(inventory, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def low_stock(self, request, pk=None):
        hospital = self.get_object()
        low_stock = hospital.inventory.filter(
            current_stock__lte=F('reorder_level')
        ).select_related('medicine')
        serializer = InventorySerializer(low_stock, many=True)
        return Response(serializer.data)


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related('hospital', 'medicine').all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return InventoryUpdateSerializer
        return InventorySerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Inventory.objects.select_related('hospital', 'medicine')
        
        if user.is_superuser or user.role == 'HEALTH_AUTHORITY':
            return queryset.all()
        elif user.is_hospital_staff and user.hospital:
            return queryset.filter(hospital=user.hospital)
        return queryset.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_hospital_staff and user.hospital:
            # Force assignment to user's hospital to prevent cross-posting
            serializer.save(hospital=user.hospital)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        user = request.user
        queryset = self.get_queryset().filter(current_stock__lte=F('reorder_level'))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        user = request.user
        queryset = self.get_queryset().filter(current_stock=0)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class InventoryTransactionViewSet(viewsets.ModelViewSet):
    queryset = InventoryTransaction.objects.select_related('inventory__hospital', 'inventory__medicine', 'performed_by').all()
    # Permission logic is handled in get_queryset for data access
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InventoryTransactionCreateSerializer
        return InventoryTransactionSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = InventoryTransaction.objects.select_related('inventory__hospital', 'inventory__medicine', 'performed_by')
        
        if user.is_superuser or user.role == 'HEALTH_AUTHORITY':
            return queryset.all()
        elif user.is_hospital_staff and user.hospital:
            return queryset.filter(inventory__hospital=user.hospital)
        return queryset.none()
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        queryset = self.get_queryset().order_by('-transaction_date')[:50]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)