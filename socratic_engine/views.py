from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.utils import timezone
from gamification.models import KnowledgeTree, TreeNode
from gamification.tree_services import TreeStateManager, NodeManager
from gamification.gamification_services import StreakManager
import json
import random

# Mock Socratic Logic for now
def process_message(message):
    responses = [
        "That's a fascinating perspective! What led you to that conclusion?",
        "I see. How does this relate to what we discussed earlier?",
        "Can you elaborate on the underlying principles behind that?",
        "Interesting. What would be the counter-argument to that claim?",
        "Walk me through your reasoning step-by-step."
    ]
    return random.choice(responses)

# Extract potential concept from message
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
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # Get or create user (using demo_user for now)
        user, _ = User.objects.get_or_create(username='demo_user')

        # 1. Process the message (Socratic Engine)
        bot_response = process_message(user_message)

        # 2. Extract concept from message
        should_add_concept = len(user_message.split()) >= 3 and random.random() > 0.4
        
        tree_update = {
            'growth': False,
            'message': 'Keep thinking! Your tree loves your curiosity! 💭'
        }
        
        if should_add_concept:
            tree, _ = KnowledgeTree.objects.get_or_create(user=user)
            concept_data = extract_concept(user_message)
            
            existing_node = TreeNode.objects.filter(
                tree=tree,
                concept_id=concept_data['concept_id']
            ).first()
            
            if not existing_node:
                new_node, _ = NodeManager.create_node(
                    tree=tree,
                    concept_id=concept_data['concept_id'],
                    title=concept_data['title'],
                    category=concept_data['category'],
                    confidence=0.3
                )
                
                TreeStateManager.update_tree_health(tree)
                
                tree_update = {
                    'growth': True,
                    'message': f'🌱 New concept unlocked: {concept_data["title"]}! Your tree is growing!',
                    'new_concept': concept_data['title'],
                    'tree_health': tree.health_score,
                    'total_concepts': tree.nodes.count()
                }
            else:
                existing_node.mastery_confidence = min(1.0, existing_node.mastery_confidence + 0.1)
                existing_node.last_practiced = timezone.now()
                existing_node.save()
                
                if existing_node.mastery_confidence >= 0.8 and not existing_node.mastered:
                    NodeManager.mark_mastered(existing_node, existing_node.mastery_confidence)
                    
                    tree_update = {
                        'growth': True,
                        'message': f'🎉 Concept mastered: {existing_node.title}! Your understanding is strong!',
                        'mastered_concept': existing_node.title,
                        'tree_health': tree.health_score
                    }
                else:
                    tree_update = {
                        'growth': True,
                        'message': f'📈 Building understanding of {existing_node.title}! Keep going!',
                        'confidence': round(existing_node.mastery_confidence * 100)
                    }
        
        # 3. Update streak
        streak_data_tuple = StreakManager.update_streak(user, timezone.now())
        # update_streak returns (streak_obj, is_new_milestone, golden_leaves_unlocked)
        streak_obj = streak_data_tuple[0]

        return JsonResponse({
            'response': bot_response,
            'tree_update': tree_update,
            'streak': {
                'current': streak_obj.current_streak,
                'milestone_reached': streak_data_tuple[1]
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
