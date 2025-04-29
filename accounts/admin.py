from django.forms.utils import mark_safe
from django.utils.html import format_html
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
        (
            "User profile",
            {"fields": ["status_display", "username", "email", "avatar_view"]},
        ),
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

    list_display = ["username", "email", "property_name"]
    search_fields = ["username", "email"]
    list_filter = ["date_joined"]
    sortable_by = ["username"]
    readonly_fields = [
        "avatar_view",
        "username",
        "email",
        "address",
        "district",
        "province",
        "property_image_gallery",
        "property_name",
        "property_address",
    ]

    fieldsets = [
        ("User profile", {"fields": ["username", "email", "avatar_view"]}),
        ("Location", {"fields": ["address", "district", "province"]}),
        (
            "Property Details",
            {"fields": ["property_name", "property_address", "property_image_gallery"]},
        ),
    ]

    def get_queryset(self, request):
        """
        Chỉ hiển thị người dùng có loại người dùng là LANDLORD và chưa được kích hoạt (is_active=False)
        """
        qs = super().get_queryset(request)
        return qs.filter(user_type=UserType.LANDLORD, is_active=False).prefetch_related(
            "properties"
        )

    def property_name(self, user):
        """
        Hiển thị thông tin tên dãy trọ đăng ký
        """
        property = user.properties.first()
        if not property:
            return "No properties registered"
        return property.name

    property_name.short_description = "Registered Properties"

    def property_address(self, user):
        property = user.properties.first()
        if not property:
            return "No properties registered"

        html = '<div style="margin-top: 10px;">'
        html += f"<p>{property.address}, {property.district}, {property.province}</p>"
        html += "</div>"
        return format_html(html)

    def property_image_gallery(self, user):
        """
        Hiển thị chi tiết dãy trọ trong trang chi tiết của tài khoản
        """
        property = user.properties.first()
        if not property:
            return "No properties registered"

        html = '<div style="margin-top: 10px;">'
        for image in property.images.all():
            html += f"<img src='{image.image.url}' alt='{image.alt}' style='width: 150px; margin-right: 10px;' />"
        html += "</div>"
        return format_html(html)

    property_image_gallery.short_description = "Property Image Gallery"


renthub_admin_site.register(LandlordApproved, LandlordApprovedAdmin)
renthub_admin_site.register(User, UserAdmin)
