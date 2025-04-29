from django.forms.utils import mark_safe
from accounts.models import User, LandlordApproved

from unfold.admin import ModelAdmin
from admin_site.components import option_display
from admin_site.site import renthub_admin_site

from utils.choices import UserType

class UserAdmin(ModelAdmin):
    """
    Trang quản lý người dùng
    """
    list_display = ["username", "status_display", "email", "user_type_display"]
    search_fields = ["username", "email"]
    list_filter = ["is_active", "date_joined"]
    sortable_by = ["username"]
    readonly_fields = ["avatar_view", "status_display"]
    filter_horizontal = ["user_permissions"]

    fieldsets = [
        ("User profile", {"fields": ["status_display", "username", "email", "avatar_view"]}),
        ("Location", {"fields": ["address", "district", "province"]}),
        (
            "Permissions",
            {
                "description": "Config user permissions",
                "classes": ["collapse"],
                "fields": ["user_type", "user_permissions", "is_staff", "is_superuser"],
            },
        ),
    ]

    def avatar_view(self, user):
        if user:
            return mark_safe(f"<img src='{user.avatar.url}' width='200' />")

    def user_type_display(self, user: User):
        """Hiển thị loại tài khoản dưới dạng biểu tượng màu."""
        
        if user.is_superuser:
            return option_display("Admin", color="red")
        
        if user.user_type == UserType.LANDLORD:
            return option_display("Landlord", color="purple")
        
        if user.user_type == UserType.TENANT:
            return option_display("Tenant", color="teal")
    user_type_display.short_description = "User Type"
    
    def status_display(self, user: User):
        """Hiển thị trạng thái dưới dạng biểu tượng màu."""
        
        if user.is_active:
            return option_display("Active", color="green")
        
        return option_display("Inactive", color="red")
    status_display.short_description = "Status"


class LandlordApprovedAdmin(UserAdmin):
    """
    Trang quản lý phê duyệt chủ trọ
    """
    list_display = ["username", "email"]
    search_fields = ["username", "email"]
    list_filter = ["date_joined"]
    sortable_by = ["username"]
    readonly_fields = ["avatar_view"]

    fieldsets = [
        ("User profile", {"fields": ["username", "email", "avatar_view"]}),
        ("Location", {"fields": ["address", "district", "province"]}),
    ]
    
    def get_queryset(self, request):
        """
        Chỉ hiển thị người dùng có loại người dùng là LANDLORD và chưa được kích hoạt (is_active=False)
        """
        query_set = super().get_queryset(request)
        return query_set.filter(user_type=UserType.LANDLORD, is_active=False).select_related("properties")
    

renthub_admin_site.register(LandlordApproved, LandlordApprovedAdmin)
renthub_admin_site.register(User, UserAdmin)
