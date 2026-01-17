# phase4/admin.py
from django.contrib import admin
from .models import SocraticEngine, KnowledgeTree, Gamification

admin.site.register(SocraticEngine)
admin.site.register(KnowledgeTree)
admin.site.register(Gamification)
