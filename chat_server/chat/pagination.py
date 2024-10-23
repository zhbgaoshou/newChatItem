from rest_framework.pagination import CursorPagination


class ArticleCursorPagination(CursorPagination):
    page_size = 20  # 每页显示5条记录
    ordering = "-id"  # 按照创建时间倒序排列
