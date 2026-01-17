from django.contrib import admin
from . import models


@admin.register(models.KnowledgeTree)
class KnowledgeTreeAdmin(admin.ModelAdmin):
    list_display = ('user', 'health_score', 'last_updated')


@admin.register(models.TreeNode)
class TreeNodeAdmin(admin.ModelAdmin):
    list_display = ('tree', 'concept_id', 'title', 'mastered', 'mastery_confidence')
    search_fields = ('concept_id', 'title')


@admin.register(models.Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_streak', 'best_streak', 'last_login')


@admin.register(models.BadgeDefinition)
class BadgeDefinitionAdmin(admin.ModelAdmin):
    list_display = ('key', 'title')


@admin.register(models.UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')


@admin.register(models.OfflineChallenge)
class OfflineChallengeAdmin(admin.ModelAdmin):
    list_display = ('template_key', 'duration_minutes')
