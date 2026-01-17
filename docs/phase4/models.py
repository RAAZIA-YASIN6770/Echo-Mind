from django.db import models

class SocraticEngine(models.Model):
	prompt = models.TextField()
	hint_level = models.IntegerField(default=1)
	visual_analogy = models.TextField(blank=True, null=True)
	personalized = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

class KnowledgeTree(models.Model):
	user_id = models.IntegerField()
	concept = models.CharField(max_length=255)
	progress = models.FloatField(default=0.0)
	analytics = models.JSONField(default=dict)
	updated_at = models.DateTimeField(auto_now=True)

class Gamification(models.Model):
	user_id = models.IntegerField()
	reward_type = models.CharField(max_length=100)
	streak_count = models.IntegerField(default=0)
	challenge = models.CharField(max_length=255, blank=True, null=True)
	achieved_at = models.DateTimeField(auto_now_add=True)
