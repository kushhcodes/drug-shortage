from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Medicine
from .serializers import MedicineSerializer, MedicineListSerializer

# Create your views here.
class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MedicineListSerializer
        return MedicineSerializer
    
    @action(detail=False, methods=['get'])
    def essential(self, request):
        medicines = self.queryset.filter(is_essential=True)
        serializer = self.get_serializer(medicines, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            medicines = self.queryset.filter(category=category)
            serializer = self.get_serializer(medicines, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category parameter required'}, status=400)