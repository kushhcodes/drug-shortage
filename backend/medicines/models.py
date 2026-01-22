from django.db import models

# Create your models here.
class Medicine(models.Model):
    class Category(models.TextChoices):
        ANTIBIOTIC = 'ANTIBIOTIC', 'Antibiotic'
        ANALGESIC = 'ANALGESIC', 'Analgesic'
        ANTIVIRAL = 'ANTIVIRAL', 'Antiviral'
        CARDIOVASCULAR = 'CARDIOVASCULAR', 'Cardiovascular'
        DIABETES = 'DIABETES', 'Diabetes'
        RESPIRATORY = 'RESPIRATORY', 'Respiratory'
        GASTROINTESTINAL = 'GASTROINTESTINAL', 'Gastrointestinal'
        EMERGENCY = 'EMERGENCY', 'Emergency'
        VACCINE = 'VACCINE', 'Vaccine'
        OTHER = 'OTHER', 'Other'
    
    name = models.CharField(max_length=255, unique=True)
    generic_name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER)
    manufacturer = models.CharField(max_length=255)
    dosage_form = models.CharField(max_length=100)
    strength = models.CharField(max_length=100)
    is_prescription_required = models.BooleanField(default=True)
    is_essential = models.BooleanField(default=False)
    is_seasonal = models.BooleanField(default=False)
    peak_season_months = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medicines'
        ordering = ['name']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['is_essential']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.strength})"