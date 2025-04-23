from django.contrib import admin
from django.utils.html import format_html

from admin_site.site import admin_site
from posts.models import RentalPost, RoomSeekingPost, Utilities

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

    # readonly_fields = ["image_gallery"]

    fieldsets = [
        ("Status", {"fields": ["status", "expired_date"]}),
        ("Rental post", {"fields": ["title", "price", "area", "content", "landlord"]}),
        # ("Location", {"fields": ["province", "city", "address"]}),
        ("Details", {"fields": [ "number_of_bedrooms","number_of_bathrooms", "utilities"]}),
        # ("Images", {"fields": ["images", "image_gallery"]}),
    ]

    # def image_gallery(self, rental_post):
    #     """Hiển thị tất cả ảnh trong trang chi tiết"""
    #     html = '<div style="display: flex; gap: 10px; flex-wrap: wrap;">'
    #     for image_object in rental_post.images.all():
    #         html += '<div style="margin: 10px;">'
    #         html += image_object.get_image_element(transformations={"width": 200})
    #         html += f'<p style="color: grey; font-style: italic;">{image_object.image.public_id or ""}</p>'
    #         html += f'<p>{image_object.alt or ""}</p>'
    #         html += '</div>'
    #     html += '</div>'
    #     return format_html(html)

    # image_gallery.short_description = 'Image Gallery'


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
admin_site.register(Utilities)
