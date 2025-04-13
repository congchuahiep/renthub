from rest_framework import serializers

from accounts.serializers import UserSerializer
from posts.models import RentalPost, RoomSeekingPost, Utilities


class UtilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'name']


class RentalPostSerializer(serializers.ModelSerializer):
    landlord = UserSerializer(read_only=True)
    utilities = UtilitiesSerializer(many=True, read_only=True)

    class Meta:
        model = RentalPost
        fields = [
            'id',
            'landlord',
            'title',
            'content',
            'status',
            'province',
            'city',
            'address',
            'price',
            'limit_person',
            'area',
            'number_of_bedrooms',
            'number_of_bathrooms',
            'utilities',
            'created_date',
            'updated_date'
        ]
        read_only_fields = ['landlord', 'created_at', 'updated_at', 'status']
        

class RoomSeekingPostSerializer(serializers.ModelSerializer):
    tenent = UserSerializer(read_only=True)

    class Meta:
        model = RoomSeekingPost
        fields = [
            'id',
            'tenent',
            'title',
            'content',
            'status',
            'position',
            'area',
            'limit_person',
            'created_date',
            'updated_date'
        ]
        read_only_fields = ['tenent', 'created_date', 'updated_date', 'status']

        
