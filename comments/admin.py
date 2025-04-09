from django.contrib import admin


from admin_site.site import admin_site
from comments.models import Comment, CommentPost

# Register your models here.
admin_site.register(Comment)
admin_site.register(CommentPost)
