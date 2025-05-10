from django.utils.html import format_html
from renthub import settings
from unfold.admin import ModelAdmin

from admin_site.site import renthub_admin_site
from posts.models import RentalPost, RoomSeekingPost, Utilities


# Register your models here.
class RentalPostAdmin(ModelAdmin):
    """
    Trang quản lý bài đăng cho thuê
    """

    list_display = ["title", "price", "content", "landlord__username", "created_date"]
    search_fields = ["title", "landlord__username", "content"]
    list_filter = ["created_date"]
    sortable_by = ["title"]
    filter_horizontal = ["utilities"]

    readonly_fields = ["image_gallery", "property_address", "property_map_view"]

    fieldsets = [
        ("Status", {"fields": ["status", "expired_date"]}),
        (
            "Rental post",
            {"fields": ["title", "price", "area", "content", "landlord"]},
        ),
        ("Images", {"fields": ["image_gallery"]}),
        ("Property", {"fields": ["property", "property_address", "property_map_view"]}),
        (
            "Details",
            {"fields": ["number_of_bedrooms", "number_of_bathrooms", "utilities"]},
        ),
    ]

    def image_gallery(self, rental_post):
        """Hiển thị tất cả ảnh trong trang chi tiết"""
        html = '<div style="display: flex; gap: 10px; flex-wrap: wrap;">'
        for image_object in rental_post.post.images.all():
            html += '<div style="margin: 10px;">'
            html += image_object.get_image_element(transformations={"width": 200})
            html += f'<p style="color: grey; font-style: italic;">{image_object.image.public_id or ""}</p>'
            html += f"<p>{image_object.alt or ''}</p>"
            html += "</div>"
        html += "</div>"
        return format_html(html)

    def property_address(self, rental_post):
        """Hiển thị địa chỉ của Property"""
        if rental_post.property:
            return f"{rental_post.property.address}, {rental_post.property.ward}, {rental_post.property.district}, {rental_post.property.province}"
        return "N/A"

    def property_map_view(self, rental_post):
        property = rental_post.property

        if not property.latitude or not property.longitude:
            return "Chưa có tọa độ"
        html = """
        <div id="map" style="height: 400px; width: 100%;"></div>
        <script>
        
            function initMap() {{
                var propertyLocation = {{ lat: {latitude}, lng: {longitude} }};
                var map = new google.maps.Map(document.getElementById('map'), {{
                    zoom: 15,
                    center: propertyLocation,
                    disableDefaultUI: true,
                }});
                var marker = new google.maps.Marker({{
                    position: propertyLocation,
                    map: map,
                    draggable: true,
                    title: "{property_name}"
                }});
                google.maps.event.addListener(marker, 'dragend', function(event) {{
                    document.getElementById('id_latitude').value = event.latLng.lat();
                    document.getElementById('id_longitude').value = event.latLng.lng();
                }});
            }}
        </script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key={api_key}&callback=initMap"></script>
        """
        return format_html(
            html,
            latitude=property.latitude,
            longitude=property.longitude,
            property_name=property.name.replace(
                '"', '\\"'
            ),  # Escape dấu ngoặc kép trong tên
            api_key=settings.GOOGLE_MAPS_API_KEY,
        )

    property_address.short_description = "Property Address"
    image_gallery.short_description = "Image Gallery"


class RoomSeekingPostAdmin(ModelAdmin):
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


class UtilitiesAdmin(ModelAdmin):
    pass


renthub_admin_site.register(RentalPost, RentalPostAdmin)
renthub_admin_site.register(RoomSeekingPost, RoomSeekingPostAdmin)
renthub_admin_site.register(Utilities, UtilitiesAdmin)
