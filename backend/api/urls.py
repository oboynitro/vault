from django.urls import path

from api.views import SecretosViewSet

urlpatterns = [
    path("secrets", SecretosViewSet.as_view({
        "get": "list",
        "post": "create"
    })),
    path("secrets/<uuid:pk>", SecretosViewSet.as_view({
        "get": "retrieve",
        "put": "update",
        "delete": "destroy"
    })),
]
