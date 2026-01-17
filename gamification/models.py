from django.db import models
from django.conf import settings


class KnowledgeTree(models.Model):
    """Per-user Knowledge Tree aggregate."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='knowledge_tree')
    health_score = models.IntegerField(default=50)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KnowledgeTree(user={self.user_id}, health={self.health_score})"


class TreeNode(models.Model):
    """Represents a single concept/node in the Knowledge Tree."""
    tree = models.ForeignKey(KnowledgeTree, on_delete=models.CASCADE, related_name='nodes')
    concept_id = models.CharField(max_length=200, db_index=True)
    title = models.CharField(max_length=255)
    mastered = models.BooleanField(default=False)
    mastery_confidence = models.FloatField(default=0.0)
    last_practiced = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tree', 'concept_id')

    def __str__(self):
        return f"TreeNode({self.concept_id} mastered={self.mastered})"


class Streak(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='streak')
    current_streak = models.IntegerField(default=0)
    last_login = models.DateTimeField(null=True, blank=True)
    best_streak = models.IntegerField(default=0)

    def __str__(self):
        return f"Streak(user={self.user_id} current={self.current_streak})"


class BadgeDefinition(models.Model):
    key = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.key


class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(BadgeDefinition, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')


class OfflineChallenge(models.Model):
    template_key = models.CharField(max_length=100, unique=True)
    text = models.TextField()
    duration_minutes = models.IntegerField(default=5)

    def __str__(self):
        return self.template_key
