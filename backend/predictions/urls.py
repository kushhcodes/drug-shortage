# from django.urls import path
# from .views import RunPredictionsView, PredictInventoryView

# app_name = 'predictions'

# urlpatterns = [
#     path('run/', RunPredictionsView.as_view(), name='run_predictions'),
#     path('inventory/', PredictInventoryView.as_view(), name='predict_inventory'),
# ]

# backend/predictions/urls.py
from django.urls import path
from .views import PredictShortageAPIView

urlpatterns = [
     path('predict/', views.PredictShortageView.as_view(), name='predict_shortage'),
    path('batch-predict/', views.BatchPredictView.as_view(), name='batch_predict'),
    path('model-status/', views.ModelStatusView.as_view(), name='model_status'),
]