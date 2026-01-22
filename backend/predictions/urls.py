# from django.urls import path
# from .views import RunPredictionsView, PredictInventoryView

# app_name = 'predictions'

# urlpatterns = [
#     path('run/', RunPredictionsView.as_view(), name='run_predictions'),
#     path('inventory/', PredictInventoryView.as_view(), name='predict_inventory'),
# ]

# backend/predictions/urls.py
from django.urls import path
from .views import PredictShortageView, BatchPredictView, ModelStatusView

urlpatterns = [
    path('predict/', PredictShortageView.as_view(), name='predict_shortage'),
    path('batch-predict/', BatchPredictView.as_view(), name='batch_predict'),
    path('model-status/', ModelStatusView.as_view(), name='model_status'),
]