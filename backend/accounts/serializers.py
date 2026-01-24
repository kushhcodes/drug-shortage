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
    
    hospital_name = serializers.CharField(
        write_only=True, 
        required=False,
        help_text="Name of the hospital to create (for new registrations)"
    )
    address = serializers.CharField(
        write_only=True,
        required=False,
        help_text="Address of the hospital"
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'role', 
            'hospital_id', 'hospital_name', 'address'
        ]
        extra_kwargs = {
            'first_name': {'required': False}, # Optional if hospital_name provided
            'last_name': {'required': False},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        # Extract hospital data
        hospital_id = validated_data.pop('hospital_id', None)
        hospital_name = validated_data.pop('hospital_name', None)
        address = validated_data.pop('address', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Logic to link hospital
        try:
            from hospitals.models import Hospital
            
            if hospital_id:
                # Link to existing hospital
                hospital = Hospital.objects.get(id=hospital_id)
                user.hospital = hospital
            
            elif hospital_name:
                # CREATE NEW HOSPITAL with mandatory fields
                import time
                reg_num = f"REG-{int(time.time())}"
                
                hospital = Hospital.objects.create(
                    name=hospital_name,
                    registration_number=reg_num,
                    address=address or "Address Pending",
                    city="Unknown", # Defaults
                    state="Unknown",
                    pincode="000000",
                    hospital_type="PRIVATE", # Default for web registration
                    bed_capacity=100, # Default
                    contact_person=validated_data.get('first_name', 'Admin'),
                    contact_email=validated_data.get('email', 'admin@hospital.com'),
                    contact_phone=validated_data.get('phone', '0000000000'),
                    is_active=True
                )
                user.hospital = hospital
                
                # If first_name was empty, use Hospital Name
                if not user.first_name:
                    user.first_name = "Admin"
                if not user.last_name:
                    user.last_name = hospital_name
            
            user.save()
            
        except Exception as e:
            print(f"Error linking hospital: {e}")
            # User is created but hospital link failed - soft error
        
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