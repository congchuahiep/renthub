from django.http import JsonResponse
from .models import District, Ward

# Trả về danh sách các quận/huyện của một tỉnh
def get_districts(request):
    province_id = request.GET.get("province_id")
    districts = District.objects.filter(province_id=province_id).values("code", "full_name")
    return JsonResponse(list(districts), safe=False)


# Trả về danh sách các phường/xã của một quận/huyện
def get_wards(request):
    district_id = request.GET.get("district_id")
    wards = Ward.objects.filter(district_id=district_id).values("code", "full_name")
    return JsonResponse(list(wards), safe=False)