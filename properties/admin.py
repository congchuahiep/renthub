from django.contrib import admin

from admin_site.site import admin_site
from properties.models import BoardingHouse

# Register your models here.
admin_site.register(BoardingHouse)
