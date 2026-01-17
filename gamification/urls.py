"""
Gamification App URL Configuration
Phase 4 API Endpoints
"""
from django.urls import path
from . import views

app_name = 'gamification'

urlpatterns = [
    # Knowledge Tree Endpoints
    path('tree/state/', views.get_tree_state, name='tree_state'),
    path('tree/node/', views.add_tree_node, name='add_node'),
    path('tree/node/<str:concept_id>/master/', views.mark_concept_mastered, name='mark_mastered'),
    path('tree/health/', views.get_tree_health, name='tree_health'),
    
    # Streak Endpoints
    path('streak/', views.get_streak, name='get_streak'),
    path('streak/update/', views.update_streak, name='update_streak'),
    
    # Achievement Endpoints
    path('achievements/badges/', views.get_user_badges, name='user_badges'),
    path('achievements/available/', views.get_available_badges, name='available_badges'),
    
    # Challenge Endpoints
    path('challenges/daily/', views.get_daily_challenge, name='daily_challenge'),
    path('challenges/check-trigger/', views.check_offline_challenge_trigger, name='check_trigger'),
    
    # Analytics Endpoints
    path('analytics/', views.get_user_analytics, name='user_analytics'),
    path('analytics/weekly-report/', views.get_weekly_report, name='weekly_report'),
    path('analytics/export/', views.export_analytics_csv, name='export_analytics'),
]
