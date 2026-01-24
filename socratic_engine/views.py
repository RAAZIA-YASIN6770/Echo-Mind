from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.utils import timezone
from gamification.models import KnowledgeTree, TreeNode
from gamification.tree_services import TreeStateManager, NodeManager
from gamification.gamification_services import StreakManager, AchievementManager, ChallengeManager
from safety.services import SafetyService
import json
import random

from .llm_service import llm_service

# Enhanced Mock Socratic Logic (Fallback for when LLM is not available)
def get_mock_response(message):
    message_lower = message.lower()
    topic = "this topic"
    keywords = {
        'gravity': 'gravity',
        'photosynthesis': 'photosynthesis', 
        'math': 'mathematics',
        'planets': 'planets',
        'energy': 'energy',
        'cells': 'cells',
        'water': 'the water cycle',
        'weather': 'weather',
        'animals': 'animals'
    }
    
    for kw, topic_name in keywords.items():
        if kw in message_lower:
            topic = topic_name
            break
    
    # Different types of Socratic responses
    response_types = [
        # Type 1: Build on their thinking
        [
            f"Great question about {topic}! 🌱 What do you already know about this?",
            f"I love your curiosity about {topic}! 💡 What made you think of this question?",
            f"Interesting thoughts on {topic}! 🤔 What examples have you seen in real life?"
        ],
        # Type 2: Ask for examples
        [
            f"Can you think of a time when you've seen {topic} in action? What did you notice?",
            f"That's fascinating! Where else might you find examples of {topic}?",
            f"Good thinking! Can you describe what {topic} looks like to you?"
        ],
        # Type 3: Encourage reasoning
        [
            f"Why do you think {topic} works that way? What's your theory? 🔍",
            f"How would you explain {topic} to a friend? What would you say?",
            f"What do you think would happen if we changed something about {topic}?"
        ],
        # Type 4: Make connections
        [
            f"How is {topic} similar to something else you've learned? 🌳",
            f"What patterns do you notice when you think about {topic}?",
            f"Can you connect {topic} to something in your daily life?"
        ],
        # Type 5: Deepen understanding
        [
            f"That's a great start! What questions do you still have about {topic}? ✨",
            f"Walk me through your thinking about {topic} step by step.",
            f"What's the most interesting part of {topic} to you, and why?"
        ]
    ]
    
    # Pick a random response type and then a random response from that type
    response_type = random.choice(response_types)
    return random.choice(response_type)

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
        'water_cycle': ['water', 'rain', 'evaporation', 'cycle', 'cloud'],
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
    
    # Generic concept if no keywords found
    return {
        'concept_id': f'discovery_{random.randint(1, 1000)}',
        'title': 'New Discovery',
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

        # 0. Safety Check - Phase 5 Integration
        is_safe, sanitized_message, risk_reason = SafetyService.sanitize_input(user, user_message)
        
        if not is_safe:
            return JsonResponse({
                'response': "Oops! Let's keep our conversation friendly and safe for everyone. Can we talk about something else? 🌈✨",
                'tree_update': {'growth': False, 'message': 'Safety first! 🛡️'},
                'streak': {'current': 1}, 
                'safety_alert': True
            })

        user_message = sanitized_message 

        # Initialize gamification assets
        AchievementManager.initialize_badges()
        ChallengeManager.initialize_challenges()

        # 1. Award 'login' badge if this is first interaction
        new_badges = AchievementManager.check_and_award_achievements(user, 'login')

        # 2. Process the message
        bot_response = process_message(user_message)

        # 3. Tree Logic - High probability for instant feedback
        should_add_concept = len(user_message.split()) >= 1 and random.random() > 0.1
        
        tree_update = {'growth': False, 'message': 'Keep thinking! 💭'}
        new_challenge = None
        
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
                    confidence=0.4 # Higher start
                )
                tree_update = {
                    'growth': True,
                    'message': f'🌱 New concept unlocked: {concept_data["title"]}! Your tree is growing!',
                    'new_concept': concept_data['title']
                }
            else:
                existing_node.mastery_confidence = min(1.0, existing_node.mastery_confidence + 0.3) # Faster progress
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

            # 4. Check for Challenges (Every 2 concepts for better UX)
            total_concepts = tree.nodes.count()
            if total_concepts > 0 and total_concepts % 2 == 0:
                # Trigger a new offline challenge
                challenge = ChallengeManager.get_random_challenge()
                if challenge:
                    new_challenge = {
                        'title': 'Real-World Discovery Challenge 🌍',
                        'text': challenge.text,
                        'duration': challenge.duration_minutes
                    }

        # 5. Streak & Streak Badges
        streak_obj, is_milestone, _ = StreakManager.update_streak(user)
        if is_milestone:
            streak_badges = AchievementManager.check_and_award_achievements(
                user, 'streak_milestone', streak_count=streak_obj.current_streak
            )
            new_badges.extend(streak_badges)

        # Prepare badge notifications
        badge_notifications = [
            {'title': b.badge.title, 'description': b.badge.description} 
            for b in new_badges
        ]

        return JsonResponse({
            'response': bot_response,
            'tree_update': tree_update,
            'streak': {'current': streak_obj.current_streak},
            'new_badges': badge_notifications,
            'new_challenge': new_challenge
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
