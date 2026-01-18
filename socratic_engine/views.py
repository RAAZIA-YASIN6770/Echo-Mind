from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import random

# Mock Socratic Logic for now
# Ideally this would connect to an LLM or the logic in the root 'socratic-engine' folder
def process_message(message):
    responses = [
        "That's a fascinating perspective! What led you to that conclusion?",
        "I see. How does this relate to what we discussed earlier?",
        "Can you elaborate on the underlying principles behind that?",
        "Interesting. What would be the counter-argument to that claim?",
        "Walk me through your reasoning step-by-step."
    ]
    return random.choice(responses)

@csrf_exempt
@require_POST
def chat_view(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # 1. Process the message (Socratic Engine)
        bot_response = process_message(user_message)

        # 2. Update Knowledge Tree (Gamification Integration)
        # In a real scenario, this would analyze the user's mastery
        # For now, we'll mock a "tree update" signal
        tree_update = {
            'growth': True,
            'message': 'Your critical thinking is nurturing your Knowledge Tree! 🌱'
        }

        return JsonResponse({
            'response': bot_response,
            'tree_update': tree_update
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
