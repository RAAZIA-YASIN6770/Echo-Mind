from django.db import models
from django.conf import settings

class SafetyIncident(models.Model):
    """Logs safety violations like inappropriate language or prompt injection"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='safety_incidents')
    incident_type = models.CharField(max_length=50) # 'inappropriate_language', 'pii_leak', 'prompt_injection'
    raw_content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    parent_alerted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.incident_type} by {self.user.username} at {self.timestamp}"
