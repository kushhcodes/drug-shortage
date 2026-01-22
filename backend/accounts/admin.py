from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'email',           
        'username',        
        'first_name',       
        'last_name',       
        'role',            
        'hospital',        
        'is_active',       
        'created_at',
    ]

    list_display_links = ['email', 'username']

    list_filter = [
        'role',           
        'is_active',      
        'is_staff',       
        'hospital',       
        'created_at',
    ]

    search_fields = [
        'email',
        'username',
        'first_name',
        'last_name',
        'phone',
    ]

    ordering = ['-created_at']

    list_per_page = 25

    fieldsets = (
        ('Login Credentials', {
            'fields' : ('email', 'username', 'password')
        }),

        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone')
        }),

        ('Role & Access', {
            'fields': ('role', 'hospital')
        }),

        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
            'classes': ('collapse',),  # Collapsible section
        }),

        ('Important Dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = (
        ('Create New User', {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'password1',  
                'password2',  
                'first_name',
                'last_name',
                'phone',
                'role',
                'hospital',
                'is_active',
            ),
        }),
    )

    readonly_fields = [
        'created_at',
        'updated_at',
        'last_login',
        'date_joined',
    ]


    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f"{updated} user(s) were successfully activated."
        )
    activate_users.short_description = 'Activated selected users'

    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f'{updated} user(s) were successfully deactivated.'
        )
    deactivate_users.short_description = 'Deactivate selected users'
    actions = [
        'activate_users',
        'deactivate_users',
    ]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('hospital')