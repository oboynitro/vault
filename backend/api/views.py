from secrets import token_urlsafe
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response

from api.serializers import SecretosSerializer
from secretos.models import Secretos


class SecretosViewSet(viewsets.ViewSet):
    def list(self, request):
        secrets = Secretos.objects.all()
        serializer = SecretosSerializer(secrets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = SecretosSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        secret = get_object_or_404(Secretos, id=pk)
        serializer = SecretosSerializer(secret)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        secret = get_object_or_404(Secretos, id=pk)
        serializer = SecretosSerializer(instance=secret, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def destroy(self, request, pk=None):
        secret = get_object_or_404(Secretos, id=pk)
        secret.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
