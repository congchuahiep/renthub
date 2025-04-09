from admin_site.site import admin_site
from utils.models import (
    Comment,
    CommentPost
)

admin_site.register(CommentPost)
admin_site.register(Comment)
