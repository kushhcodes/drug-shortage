from rest_framework import serializers
from .models import Hospital, Inventory, InventoryTransaction


class HospitalSerializer(serializers.ModelSerializer):
    full_address = serializers.CharField(read_only=True)
    
    class Meta:
        model = Hospital
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class HospitalListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = ['id', 'name', 'city', 'state', 'hospital_type', 'bed_capacity', 'is_active']


class InventorySerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    stock_status = serializers.CharField(read_only=True)
    days_until_stockout = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Inventory
        fields = '__all__'
        read_only_fields = ['last_updated', 'created_at']


class InventoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['current_stock', 'reorder_level', 'max_capacity', 'average_daily_usage', 'last_restocked_date']


class InventoryTransactionSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.get_full_name', read_only=True)
    medicine_name = serializers.CharField(source='inventory.medicine.name', read_only=True)
    hospital_name = serializers.CharField(source='inventory.hospital.name', read_only=True)
    
    class Meta:
        model = InventoryTransaction
        fields = '__all__'
        read_only_fields = ['transaction_date', 'performed_by']


class InventoryTransactionCreateSerializer(serializers.Serializer):
    inventory_id = serializers.IntegerField()
    transaction_type = serializers.ChoiceField(choices=InventoryTransaction.TransactionType.choices)
    quantity = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_quantity(self, value):
        transaction_type = self.initial_data.get('transaction_type')
        if transaction_type in ['CONSUMPTION', 'TRANSFER_OUT', 'EXPIRED'] and value > 0:
            return -abs(value)
        elif transaction_type in ['PURCHASE', 'TRANSFER_IN'] and value < 0:
            return abs(value)
        # ADJUSTMENT can be positive or negative, so we don't enforce a sign
        return value
    
    def validate(self, attrs):
        try:
            inventory = Inventory.objects.get(id=attrs['inventory_id'])
            new_stock = inventory.current_stock + attrs['quantity']
            
            if new_stock < 0:
                raise serializers.ValidationError("Insufficient stock for this transaction")
            
            attrs['inventory'] = inventory
            attrs['previous_stock'] = inventory.current_stock
            attrs['new_stock'] = new_stock
        except Inventory.DoesNotExist:
            raise serializers.ValidationError("Inventory record not found")
        
        return attrs
    
    def create(self, validated_data):
        from django.db import transaction
        
        inventory_data = validated_data.pop('inventory')
        inventory_id = inventory_data.id
        validated_data.pop('inventory_id', None)
        
        with transaction.atomic():
            # Re-fetch inventory with lock
            inventory = Inventory.objects.select_for_update().get(id=inventory_id)
            
            # Recalculate new stock based on the locked value
            new_stock = inventory.current_stock + validated_data['quantity']
            
            if new_stock < 0:
                 raise serializers.ValidationError("Insufficient stock for this transaction")
                 
            # Remove calculated fields from validated_data if they exist (added in validate)
            validated_data.pop('previous_stock', None)
            validated_data.pop('new_stock', None)
            
            transaction_obj = InventoryTransaction.objects.create(
                inventory=inventory,
                performed_by=self.context['request'].user,
                previous_stock=inventory.current_stock,
                new_stock=new_stock,
                **validated_data
            )
            
            inventory.current_stock = new_stock
            inventory.save()
            
            return transaction_obj