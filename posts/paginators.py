
from rest_framework.pagination import PageNumberPagination


class PostPaginator(PageNumberPagination):
    page_size = 2 # NOTE FOR DEBUG


class CommentPaginator(PageNumberPagination):
    page_size = 5