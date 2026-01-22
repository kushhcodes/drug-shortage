from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

# Create your models here.
class Hospital(models.Model):
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    contact_person = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    bed_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    hospital_type = models.CharField(
        max_length=50,
        choices=[
            ('GOVERNMENT', 'Government'),
            ('PRIVATE', 'Private'),
            ('CHARITABLE', 'Charitable Trust'),
        ],
        default='GOVERNMENT'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'hospitals'
        ordering = ['name']
        indexes = [
            models.Index(fields=['city', 'state']),
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.city}"
    
    @property
    def full_address(self):
        return f"{self.address}, {self.city}, {self.state} - {self.pincode}"


class Inventory(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='inventory')
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE, related_name='inventory_records')
    current_stock = models.IntegerField(validators=[MinValueValidator(0)])
    reorder_level = models.IntegerField(validators=[MinValueValidator(0)])
    max_capacity = models.IntegerField(validators=[MinValueValidator(1)])
    average_daily_usage = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    last_restocked_date = models.DateField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inventory'
        unique_together = ['hospital', 'medicine']
        ordering = ['-last_updated']
        indexes = [
            models.Index(fields=['hospital', 'current_stock']),
            models.Index(fields=['medicine', 'current_stock']),
        ]
    
    def __str__(self):
        return f"{self.hospital.name} - {self.medicine.name}: {self.current_stock}"
    
    @property
    def stock_status(self):
        if self.current_stock == 0:
            return 'OUT_OF_STOCK'
        elif self.current_stock is None or self.reorder_level is None:
            return 'NA'
        elif self.current_stock <= self.reorder_level:
            return 'LOW_STOCK'
        elif self.current_stock >= self.max_capacity * 0.9:
            return 'SURPLUS'
        return 'NORMAL'
    
    @property
    def days_until_stockout(self):
        if self.average_daily_usage > 0:
            return int(self.current_stock / self.average_daily_usage)
        return None


class InventoryTransaction(models.Model):
    class TransactionType(models.TextChoices):
        PURCHASE = 'PURCHASE', 'Purchase/Restocked'
        CONSUMPTION = 'CONSUMPTION', 'Used/Consumed'
        TRANSFER_IN = 'TRANSFER_IN', 'Received from other hospital'
        TRANSFER_OUT = 'TRANSFER_OUT', 'Sent to other hospital'
        ADJUSTMENT = 'ADJUSTMENT', 'Stock Adjustment'
        EXPIRED = 'EXPIRED', 'Expired/Discarded'
    
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices)
    quantity = models.IntegerField()
    previous_stock = models.IntegerField()
    new_stock = models.IntegerField()
    performed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='inventory_transactions')
    notes = models.TextField(blank=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inventory_transactions'
        ordering = ['-transaction_date']
        indexes = [
            models.Index(fields=['inventory', 'transaction_date']),
            models.Index(fields=['transaction_type', 'transaction_date']),
        ]
    
    def __str__(self):
        return f"{self.inventory.medicine.name} - {self.transaction_type}: {self.quantity}"