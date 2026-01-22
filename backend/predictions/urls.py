from django.urls import path
from .views import RunPredictionsView, PredictInventoryView

app_name = 'predictions'

urlpatterns = [
    path('run/', RunPredictionsView.as_view(), name='run_predictions'),
    path('inventory/', PredictInventoryView.as_view(), name='predict_inventory'),
]