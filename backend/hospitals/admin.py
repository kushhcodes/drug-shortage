from django.contrib import admin
from .models import Hospital, Inventory, InventoryTransaction

# Register your models here.
@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'hospital_type', 'bed_capacity', 'is_active', 'created_at']
    list_filter = ['hospital_type', 'is_active', 'state', 'city']
    search_fields = ['name', 'registration_number', 'city', 'contact_person', 'contact_email']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'registration_number', 'hospital_type', 'bed_capacity')}),
        ('Location', {'fields': ('address', 'city', 'state', 'pincode', 'latitude', 'longitude')}),
        ('Contact Information', {'fields': ('contact_person', 'contact_email', 'contact_phone')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['hospital', 'medicine', 'current_stock', 'reorder_level', 'stock_status', 'last_updated']
    list_filter = ['hospital', 'last_updated']
    search_fields = ['hospital__name', 'medicine__name']
    readonly_fields = ['last_updated', 'created_at', 'stock_status', 'days_until_stockout']
    
    fieldsets = (
        ('Basic Info', {'fields': ('hospital', 'medicine')}),
        ('Stock Levels', {'fields': ('current_stock', 'reorder_level', 'max_capacity', 'average_daily_usage')}),
        ('Status', {'fields': ('stock_status', 'days_until_stockout', 'last_restocked_date')}),
        ('Timestamps', {'fields': ('last_updated', 'created_at'), 'classes': ('collapse',)}),
    )


@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    list_display = ['inventory', 'transaction_type', 'quantity', 'previous_stock', 'new_stock', 'performed_by', 'transaction_date']
    list_filter = ['transaction_type', 'transaction_date']
    search_fields = ['inventory__medicine__name', 'inventory__hospital__name', 'notes']
    readonly_fields = ['transaction_date']
    ordering = ['-transaction_date']