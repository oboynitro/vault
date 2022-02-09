import uuid

from django.conf import settings
from django.db import models



class Secretos(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    # user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    resource_link = models.TextField()
    resource_username = models.CharField(max_length=255, null=True, blank=True)
    resource_password = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Secret"
        verbose_name_plural = "Secrets"
        ordering = ["-created_at"]
    
    def __str__(self) -> str:
        return str(self.id)
