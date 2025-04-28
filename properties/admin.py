from unfold.admin import ModelAdmin
from admin_site.site import renthub_admin_site
from properties.models import Property

# Register your models here.
class PropertyAdmin(ModelAdmin):
    list_display = ['name', 'active', 'status']


renthub_admin_site.register(Property, PropertyAdmin)
