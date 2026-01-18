from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from gamification.models import KnowledgeTree, TreeNode
from gamification.tree_services import TreeStateManager, NodeManager
from gamification.gamification_services import StreakManager
import json
import random
from datetime import datetime

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

# Extract potential concept from message
def extract_concept(message):
    """
    Simple concept extraction from user message.
    In real implementation, this would use NLP to detect understanding.
    For now, we create a concept based on message keywords.
    """
    # List of topics and their related keywords
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
    
    # Check which topic the message is about
    for topic, keywords in topics.items():
        for keyword in keywords:
            if keyword in message_lower:
                return {
                    'concept_id': topic,
                    'title': topic.replace('_', ' ').title(),
                    'category': 'science' if topic in ['photosynthesis', 'gravity', 'cells', 'energy'] else 'general'
                }
    
    # Default concept if no match
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

        # Get or create user (using user_id=1 for now)
        user = User.objects.get_or_create(id=1, defaults={'username': 'demo_user'})[0]

        # 1. Process the message (Socratic Engine)
        bot_response = process_message(user_message)

        # 2. Extract concept from message
        # In real implementation, this would happen after detecting understanding
        # For demo, we'll occasionally add a concept (every 3rd message with 5+ words)
        should_add_concept = len(user_message.split()) >= 5 and random.random() > 0.5
        
        tree_update = {
            'growth': False,
            'message': 'Keep thinking! Your tree loves your curiosity! 💭'
        }
        
        if should_add_concept:
            # Get or create knowledge tree
            tree, _ = KnowledgeTree.objects.get_or_create(user=user)
            
            # Extract concept
            concept_data = extract_concept(user_message)
            
            # Check if concept already exists
            existing_node = TreeNode.objects.filter(
                tree=tree,
                concept_id=concept_data['concept_id']
            ).first()
            
            if not existing_node:
                # Create new node
                node_manager = NodeManager()
                new_node = node_manager.create_node(
                    tree=tree,
                    concept_id=concept_data['concept_id'],
                    title=concept_data['title'],
                    category=concept_data['category'],
                    confidence=0.3  # Initial confidence
                )
                
                # Update tree health
                tree_manager = TreeStateManager()
                tree_manager.update_tree_health(tree)
                
                tree_update = {
                    'growth': True,
                    'message': f'🌱 New concept unlocked: {concept_data["title"]}! Your tree is growing!',
                    'new_concept': concept_data['title'],
                    'tree_health': tree.health_score,
                    'total_concepts': tree.nodes.count()
                }
            else:
                # Update existing node confidence
                existing_node.mastery_confidence = min(1.0, existing_node.mastery_confidence + 0.1)
                existing_node.last_practiced = datetime.now()
                existing_node.save()
                
                # Check if mastered (confidence >= 0.8)
                if existing_node.mastery_confidence >= 0.8 and not existing_node.mastered:
                    node_manager = NodeManager()
                    node_manager.mark_mastered(existing_node, existing_node.mastery_confidence)
                    
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
        
        # 3. Update streak (user engaged with learning)
        streak_manager = StreakManager()
        streak_data = streak_manager.update_streak(user, datetime.now())

        return JsonResponse({
            'response': bot_response,
            'tree_update': tree_update,
            'streak': {
                'current': streak_data['current_streak'],
                'milestone_reached': streak_data.get('milestone_reached', False)
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
