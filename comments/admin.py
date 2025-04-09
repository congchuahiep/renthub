from admin_site.site import admin_site
from comments.models import Comment

# Register your models here.
admin_site.register(Comment)
