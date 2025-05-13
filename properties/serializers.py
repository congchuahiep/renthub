from rest_framework import serializers

from properties.models import Property
from utils.serializers import ImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'status': {
                'read_only': True,
            },
            'owner':{
                'read_only': True,
            }
            }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['owner']={
            'id': instance.owner.id,
            'name':f"{instance.owner.first_name} {instance.owner.last_name}".strip(),
        }
        
        if instance.province:
            data["province"] = instance.province.full_name
        if instance.district:
            data["district"] = instance.district.full_name
        if instance.ward:
            data["ward"] = instance.ward.full_name
        return data
    
    def validate(self, attrs):
        request = self.context['request']
        instance = self.instance  # Lấy instance hiện tại (nếu có)

        # Kiểm tra quyền sở hữu
        if instance and instance.owner != request.user:
            raise serializers.ValidationError("You do not have permission to edit this property.")
        return attrs
    
    def create(self, validated_data):
        request = self.context['request']  
        validated_data['owner'] = request.user  
        validated_data['status'] = 'PENDING'
        return super().create(validated_data)
    
# class PropertyImageViewSet(serializers.ModelSerializer):


        


