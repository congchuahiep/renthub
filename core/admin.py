from django.contrib import admin
from django.utils.safestring import mark_safe
from core.utils.image import get_cloudinary_image

from core.models import (
    BoardingHouse,
    Comment,
    CommentPost,
    RentalPost,
    RoomSeekingPost,
    User,
)

class UserAdmin(admin.ModelAdmin):
    """
    Trang quản lý người dùng
    """
    list_display = ["username", "status_display", "email"]
    search_fields = ["username", "email"]
    list_filter = ["is_active", "date_joined"]
    sortable_by = ["username"]

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

    # list_editable = ['is_staff']
    readonly_fields = ["avatar_view", "status_display"]
    filter_horizontal = ["user_permissions"]

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

# Admin Site Object
class MyAdminSite(admin.AdminSite):
    site_header = "RentHub Admin"

    def get_urls(self):
        return super().get_urls()


admin_site = MyAdminSite(name="RentHub")

admin_site.register(User, UserAdmin)
admin_site.register(RentalPost)
admin_site.register(RoomSeekingPost)
admin_site.register(BoardingHouse)
admin_site.register(CommentPost)
admin_site.register(Comment)
