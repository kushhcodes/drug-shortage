from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters with letters and numbers"
    )
    
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Re-enter password for confirmation"
    )
    
    hospital_id = serializers.IntegerField(
        required=False,
        allow_null=True,
        help_text="Hospital ID (required for hospital staff, optional for now)"
    )

    
    class Meta:
        model = User
        
        fields = [
            'id',
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'phone',
            'role',
            'hospital_id'
        ]
        
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        
        if attrs['role'] in ['HOSPITAL_ADMIN', 'PHARMACIST']:
            if attrs.get('hospital_id') and not self._hospital_exists(attrs['hospital_id']):
                raise serializers.ValidationError({
                    "hospital_id": "Hospital with this ID does not exist."
                })
        
        return attrs
    
    def _hospital_exists(self, hospital_id):
        try:
            from hospitals.models import Hospital
            return Hospital.objects.filter(id=hospital_id).exists()
        except (ImportError, Exception):
            return True
    
    def validate_email(self, value):
        value = value.lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists."
            )
        
        return value
 
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        hospital_id = validated_data.pop('hospital_id', None)
        
        user = User.objects.create_user(**validated_data)
        
        if hospital_id:
            try:
                from hospitals.models import Hospital
                hospital = Hospital.objects.get(id=hospital_id)
                user.hospital = hospital
                user.save()
            except (ImportError, Exception):
                pass
        
        return user


class UserSerializer(serializers.ModelSerializer):
    hospital_name = serializers.SerializerMethodField(
        read_only=True,
        help_text="Name of the hospital this user is assigned to"
    )
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'hospital',      
            'hospital_name',  
            'is_active',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_hospital_name(self, obj):
        if obj.hospital:
            return obj.hospital.name
        return None


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        hospital_id = None
        hospital_name = None
        
        if self.user.hospital:
            hospital_id = self.user.hospital.id
            hospital_name = self.user.hospital.name
        
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'hospital_id': hospital_id,
            'hospital_name': hospital_name,
        }
        
        return data
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['email'] = user.email
        token['role'] = user.role
        token['hospital_id'] = user.hospital_id if user.hospital else None
        
        return token


class ChangePasswordSerializer(serializers.Serializer): 
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value