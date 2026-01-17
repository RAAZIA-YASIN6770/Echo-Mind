from django.http import JsonResponse


def health(request):
    return JsonResponse({'status': 'ok'})


def home(request):
    return JsonResponse({
        'message': 'Welcome to EchoMind API',
        'status': 'running',
        'version': '1.0',
        'endpoints': {
            'health': '/api/health/',
            'gamification': '/api/gamification/',
            'admin': '/admin/'
        }
    })