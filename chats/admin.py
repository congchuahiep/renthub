from admin_site.site import admin_site
from chats.models import Conversation

# Register your models here.
admin_site.register(Conversation)
