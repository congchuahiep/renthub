from rest_framework.pagination import PageNumberPagination


class PropertyPaginator(PageNumberPagination):
    page_size = 10
