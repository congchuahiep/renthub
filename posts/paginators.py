
from rest_framework.pagination import PageNumberPagination


class PostPaginator(PageNumberPagination):
    page_size = 5


class CommentPaginator(PageNumberPagination):
    page_size = 5