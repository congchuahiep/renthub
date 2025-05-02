from django.utils.html import format_html
from unfold.admin import ModelAdmin

from admin_site.components import option_display
from admin_site.site import renthub_admin_site
from properties.models import Property
from renthub import settings
from utils.choices import PropertyStatus


# Register your models here.
class PropertyAdmin(ModelAdmin):
    list_display = ['name', 'status_display']
    readonly_fields = ['image_gallery', "map_view", "latitude", "longitude"]
    
    fieldsets = [
        ("Status", {"fields": ["status"]}),
        ("Detail", {"fields": ["name", "owner"]}),
        ("Location", {"fields": ["address", "latitude", "longitude", "map_view"]}),
        ("Images", {"fields": ["image_gallery"]}),
    ]
    
    def image_gallery(self, property: Property):
        """Hiển thị tất cả ảnh trong trang chi tiết"""
        html = '<div style="display: flex; gap: 10px; flex-wrap: wrap;">'
        for image_object in property.images.all():
            html += '<div style="margin: 10px;">'
            html += image_object.get_image_element(transformations={"width": 200})
            html += f'<p style="color: grey; font-style: italic;">{image_object.image.public_id or ""}</p>'
            html += f'<p>{image_object.alt or ""}</p>'
            html += '</div>'
        html += '</div>'
        return format_html(html)

    image_gallery.short_description = 'Image Gallery'
    
    def status_display(self, property: Property):
        """Hiển thị loại tài khoản dưới dạng biểu tượng màu."""

        if property.status == PropertyStatus.PENDING:
            return option_display("Pending", color="yellow")
        
        if property.status == PropertyStatus.APPROVED:
            return option_display("Approved", color="green")
        
        if property.status == PropertyStatus.REJECTED:
            return option_display("Rejected", color="red")

    status_display.short_description = "Status"
    
    def map_view(self, property: Property):
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
            property_name=property.name.replace('"', '\\"'),  # Escape dấu ngoặc kép trong tên
            api_key=settings.GOOGLE_MAPS_API_KEY    
        )

    map_view.short_description = "Map"


renthub_admin_site.register(Property, PropertyAdmin)
