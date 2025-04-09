from admin_site.site import admin_site
from utils.models import (
    BoardingHouse,
    Comment,
    CommentPost
)


admin_site.register(BoardingHouse)
admin_site.register(CommentPost)
admin_site.register(Comment)
