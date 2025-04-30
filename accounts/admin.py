from django.forms.utils import mark_safe
from django.utils.html import format_html
from accounts.models import User, LandlordApproved

from unfold.admin import ModelAdmin
from admin_site.components import action_button, option_display
from admin_site.site import renthub_admin_site

from utils.choices import PropertyStatus, UserType

from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages

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

    list_display = ["username", "email", "property_name", "action_buttons"]
    actions = ["approve_user", "reject_user"]
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

    ### CÁC TRƯỜNG THÔNG TIN PROPERTY CỦA NGƯỜI DÙNG CHỦ TRỌ ĐĂNG KÝ ###
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
    
    ### XỬ LÝ XÉT DUYỆT/TỪ CHỐI XÉT DUYỆT NGƯỜI DÙNG ###
    def approve_user(self, request, user_id):
        """
        Xử lý khi nhấn nút Approve - Xét duyệt người dùng
        """
        user = get_object_or_404(User, id=user_id, user_type=UserType.LANDLORD)
        property = user.properties.first()

        if property:
            property.status = PropertyStatus.APPROVED
            property.save()

        user.is_active = True
        user.save()

        messages.success(request, f"User {user.username} has been approved.")
        return redirect("/admin/accounts/landlordapproved/")

    def reject_user(self, request, user_id):
        """
        Xử lý khi nhấn nút Reject - Từ chối xét duyệt người dùng
        """
        user = get_object_or_404(User, id=user_id, user_type=UserType.LANDLORD)

        # TODO: Gửi email thông báo khi từ chối duyệt tài khoản
        # TODO: Xóa tài khoản người dùng khi từ chối duyệt tài khoản

        user.delete()
        messages.success(request, f"User {user.username} has been rejected and deleted.")
        return redirect("/admin/accounts/landlordapproved/")

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("<int:user_id>/approve/", self.admin_site.admin_view(self.approve_user), name="approve_landlord"),
            path("<int:user_id>/reject/", self.admin_site.admin_view(self.reject_user), name="reject_landlord"),
        ]
        return custom_urls + urls
    
    def action_buttons(self, user):
        """
        Thêm các nút hành động (Approve, Reject) vào danh sách
        """
        approve_url = f"/admin/accounts/landlordapproved/{user.id}/approve/"
        reject_url = f"/admin/accounts/landlordapproved/{user.id}/reject/"
        approve_button = action_button("Approve", approve_url, color="green")
        reject_button = action_button("Reject", reject_url, color="red")
        return mark_safe(f"{approve_button} {reject_button}")
    action_buttons.short_description = "Actions"
    
    def change_view(self, request, object_id, form_url="", extra_context=None):
        """
        Tùy chỉnh giao diện trang chi tiết để thêm nút Approve và Reject
        """
        extra_context = extra_context or {}
        user = self.get_object(request, object_id)
        if user:
            approve_url = f"/admin/accounts/landlordapproved/{user.id}/approve/"
            reject_url = f"/admin/accounts/landlordapproved/{user.id}/reject/"
            extra_context["custom_buttons"] = mark_safe(
                f"{action_button('Approve', approve_url, color='green')} "
                f"{action_button('Reject', reject_url, color='red')}"
            )
            
            extra_context["hide_default_buttons"] = True 
        return super().change_view(request, object_id, form_url, extra_context)


renthub_admin_site.register(LandlordApproved, LandlordApprovedAdmin)
renthub_admin_site.register(User, UserAdmin)
