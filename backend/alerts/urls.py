from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, RedistributionRequestViewSet

app_name = 'alerts'

router = DefaultRouter()
router.register(r'', AlertViewSet, basename='alert')
router.register(r'redistribution', RedistributionRequestViewSet, basename='redistribution')

urlpatterns = router.urls