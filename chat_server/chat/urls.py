from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"rooms", views.RoomViewSet, basename="rooms")
router.register(r"messages", views.MessagesView, basename="messages")

urlpatterns = [
    path("", include(router.urls)),
    path("index", views.chatView.as_view(), name="index"),
]
