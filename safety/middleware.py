import time
from django.core.cache import cache
from django.http import JsonResponse, HttpResponseForbidden
from django.conf import settings

class SecurityMiddleware:
    """
    Middleware for:
    1. Rate Limiting (5 requests/second)
    2. Security Headers (HSTS, X-Frame, X-Content-Type)
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Rate Limiting
        if not self.check_rate_limit(request):
            return JsonResponse(
                {'error': 'Too many requests. Please slow down.'}, 
                status=429
            )

        response = self.get_response(request)
        
        # 2. Security Headers
        self.add_security_headers(response)
        
        return response
        
    def check_rate_limit(self, request):
        """
        Rate limit logic: 5 requests per second per IP
        """
        ip = self.get_client_ip(request)
        cache_key = f'rate_limit_{ip}'
        
        # Get current request count
        request_count = cache.get(cache_key, 0)
        
        if request_count >= 5:
            return False
            
        # Increment and set expiry to 1 second if new
        if request_count == 0:
            cache.set(cache_key, 1, timeout=1)
        else:
            cache.incr(cache_key)
            
        return True
        
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
        
    def add_security_headers(self, response):
        """Add strict security headers"""
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Referrer-Policy'] = 'same-origin'
