from django.contrib import admin

from admin_site.site import admin_site
from posts.models import RentalPost, RoomSeekingPost
from utils.utils.image import get_cloudinary_image

# Register your models here.
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
        ("Rental post", {"fields": ["title", "price", "area", "content", "landlord"]}),
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

admin_site.register(RentalPost, RentalPostAdmin)
admin_site.register(RoomSeekingPost, RoomSeekingPostAdmin)
