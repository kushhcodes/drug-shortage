from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HospitalViewSet, InventoryViewSet, InventoryTransactionViewSet

app_name = 'hospitals'

router = DefaultRouter()
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'transactions', InventoryTransactionViewSet, basename='transaction')
router.register(r'', HospitalViewSet, basename='hospital')

urlpatterns = router.urls