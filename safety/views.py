from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import SafetyIncident
from django.contrib.auth.models import User

@require_GET
def get_safety_alerts(request):
    """GET /api/safety/alerts/ - Fetch safety incidents for parents"""
    # In a real app, we'd check if the user is a parent of the child
    # For demo, we'll just return alerts for 'demo_user'
    user, _ = User.objects.get_or_create(username='demo_user')
    incidents = SafetyIncident.objects.filter(user=user).order_by('-timestamp')
    
    data = [
        {
            'id': incident.id,
            'type': incident.incident_type,
            'content': incident.raw_content,
            'timestamp': incident.timestamp.isoformat(),
            'resolved': incident.is_resolved
        }
        for incident in incidents
    ]
    
    return JsonResponse({
        'success': True,
        'alerts': data,
        'total_alerts': len(data)
    })
