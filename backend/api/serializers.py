from rest_framework import serializers

from secretos.models import Secretos


class SecretosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secretos
        fields = "__all__"