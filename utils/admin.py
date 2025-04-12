from django.contrib import admin
from .models import Image
from admin_site.site import admin_site

class ImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'image', 'alt']
    search_fields = ['alt']

admin_site.register(Image, ImageAdmin)
