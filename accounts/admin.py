from django.contrib import admin
from django.contrib.auth.models import Group
from django.forms.utils import mark_safe
from accounts.models import User

from unfold.admin import ModelAdmin
from admin_site.site import renthub_admin_site

class UserAdmin(ModelAdmin):
    """
    Trang quản lý người dùng
    """
    list_display = ["username", "status_display", "email", "user_type"]
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

    def status_display(self, user):
        """Hiển thị trạng thái dưới dạng biểu tượng màu."""
        class_name = "inline-block font-semibold leading-normal px-2 py-1 rounded text-xxs uppercase whitespace-nowrap"
        if user.is_active:
            class_name += " bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
        else:
            class_name += " bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"

        status = "Active" if user.is_active else "Inactive"
        return mark_safe(f"<span class='{class_name}'>{status}</span>")

    status_display.short_description = "Trạng thái"


renthub_admin_site.register(User, UserAdmin)
