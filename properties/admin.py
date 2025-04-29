from django.utils.html import format_html
from unfold.admin import ModelAdmin

from admin_site.site import renthub_admin_site
from properties.models import Property


# Register your models here.
class PropertyAdmin(ModelAdmin):
    list_display = ['name', 'active', 'status']
    readonly_fields = ['image_gallery']
    
    fieldsets = [
        ("Status", {"fields": ["status"]}),
        ("Rental post", {"fields": ["name", "owner"]}),
        ("Location", {"fields": ["province", "district", "address"]}),
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


renthub_admin_site.register(Property, PropertyAdmin)
