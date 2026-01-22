from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        HOSPITAL_ADMIN = 'HOSPITAL_ADMIN', 'Hospital Admin'
        PHARMACIST = 'PHARMACIST', 'Pharmacist'
        HEALTH_AUTHORITY = 'HEALTH_AUTHORITY', 'Health Authority'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
    
    email = models.EmailField(
        unique=True,
        help_text="User's email address - used for login"
    )

    #optional
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text="Contact phone number"
    )

    role = models.CharField(
        max_length=25,
        choices=Role.choices,
        default=Role.HOSPITAL_ADMIN,
        help_text="User's role determines their permissions"
    )

    hospital = models.ForeignKey(
        'hospitals.Hospital',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='users',
        help_text="Hospital this user is assigned to (only for hospital staff)"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Can this user login? Set to False to disable account"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the account was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last time the account was modified"
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['hospital', 'role']),
        ]

    def __str__(self):
      return f"{self.get_full_name()} ({self.role})"
        
    @property
    def is_hospital_staff(self):
        return self.role in [self.Role.HOSPITAL_ADMIN, self.Role.PHARMACIST]

    @property
    def is_authority(self):
        return self.role == self.Role.HEALTH_AUTHORITY
        
    @property
    def hospital_name(self):
        return self.hospital.name if self.hospital else None
        
    def can_access_hospital(self, hospital):
        if self.is_authority:
            return True
            
        if self.is_hospital_staff:
            return self.hospital == hospital

        return False