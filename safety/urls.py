from django.urls import path
from . import views

urlpatterns = [
    path('alerts/', views.get_safety_alerts, name='get_safety_alerts'),
]
