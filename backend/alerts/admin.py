from django.contrib import admin
from .models import Alert, RedistributionRequest

# Register your models here.
@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['hospital', 'medicine', 'severity', 'status', 'current_stock', 'predicted_stockout_date', 'created_at']
    list_filter = ['severity', 'status', 'created_at']
    search_fields = ['hospital__name', 'medicine__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RedistributionRequest)
class RedistributionRequestAdmin(admin.ModelAdmin):
    list_display = ['medicine', 'source_hospital', 'destination_hospital', 'requested_quantity', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['medicine__name', 'source_hospital__name', 'destination_hospital__name']
    readonly_fields = ['created_at', 'updated_at']