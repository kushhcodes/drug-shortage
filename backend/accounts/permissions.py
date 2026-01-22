from rest_framework import permissions


class IsHospitalAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'HOSPITAL_ADMIN'


class IsPharmacist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'PHARMACIST'


class IsHospitalStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['HOSPITAL_ADMIN', 'PHARMACIST']


class IsHealthAuthority(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'HEALTH_AUTHORITY'


class IsSameHospital(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'HEALTH_AUTHORITY':
            return True
        
        if hasattr(obj, 'hospital'):
            return obj.hospital == request.user.hospital
        
        if obj.__class__.__name__ == 'Hospital':
            return obj == request.user.hospital
        
        return False


class ReadOnlyOrHealthAuthority(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.role == 'HEALTH_AUTHORITY':
            return True
        
        return request.method in permissions.SAFE_METHODS