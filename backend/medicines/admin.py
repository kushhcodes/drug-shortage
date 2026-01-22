from django.contrib import admin
from .models import Medicine

# Register your models here.
@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ['name', 'generic_name', 'category', 'strength', 'manufacturer', 'is_essential', 'is_active']
    list_filter = ['category', 'is_essential', 'is_active', 'is_seasonal']
    search_fields = ['name', 'generic_name', 'manufacturer']
    readonly_fields = ['created_at', 'updated_at']