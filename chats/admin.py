from admin_site.site import renthub_admin_site
from chats.models import Conversation, Message
from django.db import models
from django.contrib import admin
from .models import Message
from django.core.exceptions import ObjectDoesNotExist, ValidationError
import logging

logger = logging.getLogger(__name__)


# admin_site.register(Conversation)
# admin_site.register(Message)
