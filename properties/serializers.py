
from rest_framework import serializers

from accounts.serializers import UserSerializer
from properties.models import Property
from utils.serializers import ImageSerializer


class PropertySerializer(serializers.ModelSerializer):
    # owner = UserSerializer(read_only=True)
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


        

