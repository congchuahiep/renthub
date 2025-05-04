from django.http import JsonResponse
from rest_framework import generics, viewsets
from rest_framework.decorators import action

from locations.serializers import DistrictSerializer, WardSerializer
from .models import District, Ward


class DistrictViewSet(viewsets.ViewSet, generics.ListAPIView):
    """
    ViewSet cho `District`:
    - Trả về danh sách các quận/huyện của một tỉnh dựa trên `province_id`
    - Nếu không có `province_id`, trả về tất cả các quận/huyện
    """
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    
    def list(self, request, *args, **kwargs):
        province_id = request.query_params.get("province_id")
        if province_id:
            self.queryset = self.queryset.filter(province_id=province_id)
            
        return super().list(request, *args, **kwargs)
        
    
class WardViewSet(viewsets.ViewSet, generics.ListAPIView):
    """
    ViewSet cho `Ward`:
    - Trả về danh sách các phường/xã của một quận/huyện dựa trên `district_id`
    - Nếu không có `district_id`, trả về tất cả các phường/xã
    """
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    
    def list(self, request, *args, **kwargs):
        district_id = request.query_params.get("district_id")
        if district_id:
            self.queryset = self.queryset.filter(district_id=district_id)
            
        return super().list(request, *args, **kwargs)