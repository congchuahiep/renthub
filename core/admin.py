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


class RentalPostAdmin(admin.ModelAdmin):
    """
    Trang quản lý bài đăng cho thuê
    """
    list_display = ["title", "price", "content", "landlord__username", "created_date"]
    search_fields = ["title", "landlord__username", "content"]
    list_filter = ["created_date"]
    sortable_by = ["title"]
    filter_horizontal = ["utilities"]

    fieldsets = [
        ("Status", {"fields": ["status"]}),
        ("Rental post", {"fields": ["title", "price", "content", "landlord"]}),
        ("Location", {"fields": ["province", "city", "address"]}),
        ("Utilities", {"fields": ["utilities"]}),
    ]

    def image_view(self, rental_post):
        if rental_post:
            return get_cloudinary_image(
                rental_post.image.public_id, transformations={"width": 200}
            )


class RoomSeekingPostAdmin(admin.ModelAdmin):
    """
    Trang quản lý bài đăng tìm phòng
    """
    list_display = ["title", "area", "limit_person", "tenent__username", "created_date"]
    search_fields = ["title", "tenent__username"]
    list_filter = ["created_date"]
    sortable_by = ["title"]

    fieldsets = [
        ("Status", {"fields": ["status"]}),
        ("Room seeking post", {"fields": ["title", "area", "limit_person", "tenent"]}),
    ]

# Admin Site Object
class MyAdminSite(admin.AdminSite):
    site_header = "RentHub Admin"

    def get_urls(self):
        return super().get_urls()


admin_site = MyAdminSite(name="RentHub")

admin_site.register(User, UserAdmin)
admin_site.register(RentalPost, RentalPostAdmin)
admin_site.register(RoomSeekingPost)
admin_site.register(BoardingHouse)
admin_site.register(CommentPost)
admin_site.register(Comment)
