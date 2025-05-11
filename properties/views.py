from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.perms import IsLandlord
from .models import Property, PropertyImage,PropertyStatus
from rest_framework.decorators import action
from.  import serializers

class PropertyViewSet(viewsets.ViewSet, generics.GenericAPIView):
    serializer_class = serializers.PropertySerializer
    permission_classes = [IsAuthenticated, IsLandlord] 

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user, active=True)

    @action(methods=['post','get'],detail=False,url_path="property")
    def property(self,request):
        if request.method.__eq__("POST"):
            serializer = serializers.PropertySerializer(
                data=request.data,
                context={'request':request} 
            )
            if serializer.is_valid():
                property = serializer.save()
                return Response(serializers.PropertySerializer(property,context={'request':request}).data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method.__eq__("GET"):
            properties= self.get_queryset()
            serializer = serializers.PropertySerializer(properties, many=True)
            return Response(serializer.data)
        
    @action(methods=['put', 'patch'], detail=True, url_path="property_put_patch")
    def update_property(self, request, pk=None):
        try:
              property_instance = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response({"error": "Property not found."}, status=status.HTTP_404_NOT_FOUND)
        
        restricted_fields = ['province', 'district', 'ward', 'owner']
        for field in restricted_fields:
            if field in request.data:
                request.data.pop(field)

        if 'status' in request.data and not request.user.is_staff:
            return Response({"error": "You are not allowed to update the status."}, status=status.HTTP_403_FORBIDDEN)


        serializer = serializers.PropertySerializer(
            property_instance,
            data=request.data,
            partial=True,  
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(methods=["delete"], detail=True, url_path="property")
    def delete_property(self, request, pk=None):
        property_instance = self.get_object(pk)
        if not property_instance:
            return Response({"error": "Property not found or not owned by you."}, status=status.HTTP_404_NOT_FOUND)

        property_instance.delete()
        return Response({"message": "Property deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    




