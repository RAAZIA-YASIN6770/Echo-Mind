from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.utils import timezone
from gamification.models import KnowledgeTree, TreeNode
from gamification.tree_services import TreeStateManager, NodeManager
from gamification.gamification_services import StreakManager, AchievementManager
import json
import random

from .llm_service import llm_service

# Mock Socratic Logic (Fallback for Phase 5)
def get_mock_response(message):
    message_lower = message.lower()
    topic = "thinking"
    keywords = ['gravity', 'photosynthesis', 'math', 'planets', 'energy', 'cells']
    for kw in keywords:
        if kw in message_lower:
            topic = kw
            break

    responses = [
        f"That's a fascinating look at {topic}! What led you to that conclusion specifically?",
        f"I see you're curious about {topic}. How does this relate to what we discussed earlier?",
        f"Can you elaborate on the underlying principles of {topic} as you see them?",
        f"Interesting thoughts on {topic}. What would be the counter-argument to that claim?",
        f"Walk me through your reasoning step-by-step regarding {topic}."
    ]
    return f"Eco-Mind (Demo): {random.choice(responses)}"

def process_message(message):
    # Try Gemini first
    ai_response = llm_service.get_response(message)
    if ai_response:
        return ai_response
    
    # Fallback to Mock
    return get_mock_response(message)

def extract_concept(message):
    topics = {
        'photosynthesis': ['photosynthesis', 'plant', 'chlorophyll', 'sunlight'],
        'gravity': ['gravity', 'fall', 'weight', 'force', 'mass'],
        'water_cycle': ['water', 'rain', 'evaporation', 'cycle'],
        'mathematics': ['math', 'number', 'equation', 'solve', 'calculate'],
        'planets': ['planet', 'solar', 'earth', 'mars', 'space'],
        'energy': ['energy', 'power', 'electricity', 'heat'],
        'cells': ['cell', 'biology', 'organism', 'living'],
        'fractions': ['fraction', 'divide', 'numerator', 'denominator'],
        'weather': ['weather', 'cloud', 'temperature', 'climate'],
        'animals': ['animal', 'species', 'habitat', 'wildlife']
    }
    
    message_lower = message.lower()
    for topic, keywords in topics.items():
        for keyword in keywords:
            if keyword in message_lower:
                return {
                    'concept_id': topic,
                    'title': topic.replace('_', ' ').title(),
                    'category': 'science' if topic in ['photosynthesis', 'gravity', 'cells', 'energy'] else 'general'
                }
    
    return {
        'concept_id': f'concept_{len(message_lower) % 10}',
        'title': 'Critical Thinking',
        'category': 'general'
    }

@csrf_exempt
@require_POST
def chat_view(request):
    print(">>> CHAT REQUEST RECEIVED")
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        user, _ = User.objects.get_or_create(username='demo_user')

        # Initialize badges if not already done
        AchievementManager.initialize_badges()

        # 1. Award 'login' badge if this is first interaction
        new_badges = AchievementManager.check_and_award_achievements(user, 'login')

        # 2. Process the message
        bot_response = process_message(user_message)

        # 3. Tree Logic - Increased probability for better feedback
        should_add_concept = len(user_message.split()) >= 2 and random.random() > 0.3
        
        tree_update = {'growth': False, 'message': 'Keep thinking! 💭'}
        
        if should_add_concept:
            tree, _ = KnowledgeTree.objects.get_or_create(user=user)
            concept_data = extract_concept(user_message)
            
            existing_node = TreeNode.objects.filter(tree=tree, concept_id=concept_data['concept_id']).first()
            
            if not existing_node:
                new_node, _ = NodeManager.create_node(
                    tree=tree, 
                    concept_id=concept_data['concept_id'],
                    title=concept_data['title'],
                    category=concept_data['category'],
                    confidence=0.3
                )
                tree_update = {
                    'growth': True,
                    'message': f'🌱 New concept unlocked: {concept_data["title"]}! Your tree is growing!',
                    'new_concept': concept_data['title']
                }
            else:
                existing_node.mastery_confidence = min(1.0, existing_node.mastery_confidence + 0.2) # Faster progress
                existing_node.last_practiced = timezone.now()
                existing_node.save()
                
                if existing_node.mastery_confidence >= 0.8 and not existing_node.mastered:
                    NodeManager.mark_mastered(existing_node, existing_node.mastery_confidence)
                    tree_update = {
                        'growth': True,
                        'message': f'🎉 Concept mastered: {existing_node.title}!',
                        'mastered_concept': existing_node.title
                    }
                    # Award badge for concept mastery
                    mastered_count = tree.nodes.filter(mastered=True).count()
                    mastery_badges = AchievementManager.check_and_award_achievements(
                        user, 'concept_mastered', mastered_count=mastered_count
                    )
                    new_badges.extend(mastery_badges)
                else:
                    tree_update = {
                        'growth': True,
                        'message': f'📈 Building understanding of {existing_node.title}!',
                        'confidence': round(existing_node.mastery_confidence * 100)
                    }

        # 4. Streak & Streak Badges
        streak_obj, is_milestone, _ = StreakManager.update_streak(user)
        if is_milestone:
            streak_badges = AchievementManager.check_and_award_achievements(
                user, 'streak_milestone', streak_count=streak_obj.current_streak
            )
            new_badges.extend(streak_badges)

        # Prepare badge notifications for frontend
        badge_notifications = [
            {'title': b.badge.title, 'description': b.badge.description} 
            for b in new_badges
        ]

        return JsonResponse({
            'response': bot_response,
            'tree_update': tree_update,
            'streak': {'current': streak_obj.current_streak},
            'new_badges': badge_notifications
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
