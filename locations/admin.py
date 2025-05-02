from admin_site.site import renthub_admin_site
from unfold.admin import ModelAdmin

# Register your models here.
from .models import AdministrativeRegion, AdministrativeUnit, Province, District, Ward

class PreventAdminChange(ModelAdmin):
    """
    Ngăn không cho chỉnh sửa các trường trong admin
    """
    
    fieldsets = [
        (None, {'fields':()}), 
        ]

    list_display_links = None

    def __init__(self, *args, **kwargs):
        
        super(PreventAdminChange, self).__init__(*args, **kwargs)

    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False

class ProvinceAdmin(PreventAdminChange):
    """
    Trang quản lý tỉnh thành phố
    """
    list_display = ["administrative_unit", "name"]
    search_fields = ["name", "full_name", "code_name"]
    list_filter = ["administrative_unit"]
    ordering = ["code_name"]
    
class DistrictAdmin(PreventAdminChange):
    """
    Trang quản lý quận huyện
    """
    list_display = ["administrative_unit", "name"]
    search_fields = ["name", "full_name", "code_name"]
    list_filter = ["administrative_unit"]
    ordering = ["code_name"]

renthub_admin_site.register(AdministrativeRegion, PreventAdminChange)
renthub_admin_site.register(AdministrativeUnit, PreventAdminChange)
renthub_admin_site.register(Province, ProvinceAdmin)
renthub_admin_site.register(District, DistrictAdmin)
renthub_admin_site.register(Ward, PreventAdminChange)