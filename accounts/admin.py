from django.contrib import admin
from django.forms.utils import mark_safe

from admin_site.site import admin_site
from accounts.models import User
from utils.utils.image import get_cloudinary_image

class UserAdmin(admin.ModelAdmin):
    """
    Trang quản lý người dùng
    """
    list_display = ["username", "status_display", "email"]
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
                "fields": ["user_permissions", "is_staff", "is_superuser"],
            },
        ),
    ]

    def avatar_view(self, user):
        if user:
            return get_cloudinary_image(
                user.avatar.public_id, transformations={"width": 200}
            )

    def status_display(self, user):
        """Hiển thị trạng thái dưới dạng biểu tượng màu."""
        color = "green" if user.is_active else "red"
        return mark_safe(f'<span style="color: {color};">●</span>')

    status_display.short_description = "Trạng thái"

# Register your models here.
admin_site.register(User, UserAdmin)
