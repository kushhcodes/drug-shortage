from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Alert(models.Model):
    class Severity(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        CRITICAL = 'CRITICAL', 'Critical'
    
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        ACKNOWLEDGED = 'ACKNOWLEDGED', 'Acknowledged'
        RESOLVED = 'RESOLVED', 'Resolved'
        IGNORED = 'IGNORED', 'Ignored'
    
    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE, related_name='alerts')
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE, related_name='alerts')
    inventory = models.ForeignKey('hospitals.Inventory', on_delete=models.CASCADE, related_name='alerts')
    severity = models.CharField(max_length=10, choices=Severity.choices, default=Severity.LOW)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.ACTIVE)
    current_stock = models.IntegerField()
    predicted_stockout_date = models.DateField()
    predicted_shortage_quantity = models.IntegerField(validators=[MinValueValidator(0)])
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)])
    message = models.TextField()
    acknowledged_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='acknowledged_alerts')
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'alerts'
        ordering = ['-created_at', 'severity']
        indexes = [
            models.Index(fields=['hospital', 'status']),
            models.Index(fields=['severity', 'status']),
            models.Index(fields=['predicted_stockout_date']),
        ]
    
    def __str__(self):
        return f"{self.severity} - {self.hospital.name} - {self.medicine.name}"


class RedistributionRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        COMPLETED = 'COMPLETED', 'Completed'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='redistribution_requests')
    source_hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE, related_name='outgoing_redistributions')
    source_inventory = models.ForeignKey('hospitals.Inventory', on_delete=models.CASCADE, related_name='outgoing_transfers')
    destination_hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE, related_name='incoming_redistributions')
    destination_inventory = models.ForeignKey('hospitals.Inventory', on_delete=models.CASCADE, related_name='incoming_transfers')
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE, related_name='redistribution_requests')
    requested_quantity = models.IntegerField(validators=[MinValueValidator(1)])
    approved_quantity = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    distance_km = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    recommendation_score = models.DecimalField(max_digits=5, decimal_places=2)
    requested_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, related_name='redistribution_requests_made')
    approved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='redistribution_requests_approved')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'redistribution_requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['source_hospital', 'status']),
            models.Index(fields=['destination_hospital', 'status']),
        ]
    
    def __str__(self):
        return f"{self.medicine.name}: {self.source_hospital.name} → {self.destination_hospital.name}"