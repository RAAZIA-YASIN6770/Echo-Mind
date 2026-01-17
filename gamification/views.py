"""
Phase 4 API Views - Knowledge Tree and Gamification Endpoints
Using Django's built-in JSON responses
"""
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods, require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import json

from .models import KnowledgeTree, TreeNode, Streak, UserBadge, OfflineChallenge
from .tree_services import TreeStateManager, NodeManager
from .gamification_services import StreakManager, AchievementManager, ChallengeManager, AnalyticsManager


# Helper function to parse JSON body
def get_json_body(request):
    """Parse JSON from request body"""
    try:
        return json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return {}


# ==================== KNOWLEDGE TREE ENDPOINTS ====================

@require_GET
@login_required
def get_tree_state(request):
    """
    GET /api/gamification/tree/state/
    Get current tree state and visualization data
    """
    user = request.user
    
    try:
        tree = KnowledgeTree.objects.get(user=user)
    except KnowledgeTree.DoesNotExist:
        # Create new tree for user
        tree = KnowledgeTree.objects.create(user=user)
    
    # Get complete visualization data
    tree_data = NodeManager.get_tree_visualization_data(tree)
    
    return JsonResponse({
        'success': True,
        'data': tree_data
    })


@require_POST
@login_required
@csrf_exempt
def add_tree_node(request):
    """
    POST /api/gamification/tree/node/
    Add a new node to the knowledge tree
    Body: {
        "concept_id": "photosynthesis_101",
        "title": "Photosynthesis",
        "category": "science",
        "confidence": 0.0
    }
    """
    user = request.user
    data = get_json_body(request)
    
    # Get or create tree
    tree, _ = KnowledgeTree.objects.get_or_create(user=user)
    
    # Extract data
    concept_id = data.get('concept_id')
    title = data.get('title')
    category = data.get('category', 'default')
    confidence = data.get('confidence', 0.0)
    
    if not concept_id or not title:
        return JsonResponse({
            'success': False,
            'error': 'concept_id and title are required'
        }, status=400)
    
    # Create node
    node, created = NodeManager.create_node(tree, concept_id, title, category, confidence)
    
    # Get updated tree data
    tree_data = NodeManager.get_tree_visualization_data(tree)
    
    return JsonResponse({
        'success': True,
        'created': created,
        'node': {
            'id': node.id,
            'concept_id': node.concept_id,
            'title': node.title,
            'mastered': node.mastered
        },
        'tree': tree_data
    }, status=201 if created else 200)


@require_POST
@login_required
@csrf_exempt
def mark_concept_mastered(request, concept_id):
    """
    POST /api/gamification/tree/node/<concept_id>/master/
    Mark a concept as mastered
    Body: {
        "confidence": 0.95
    }
    """
    user = request.user
    data = get_json_body(request)
    
    try:
        tree = KnowledgeTree.objects.get(user=user)
        node = TreeNode.objects.get(tree=tree, concept_id=concept_id)
    except (KnowledgeTree.DoesNotExist, TreeNode.DoesNotExist):
        return JsonResponse({
            'success': False,
            'error': 'Node not found'
        }, status=404)
    
    confidence = data.get('confidence', 1.0)
    
    # Mark as mastered
    NodeManager.mark_mastered(node, confidence)
    
    # Check for achievements
    mastered_count = tree.nodes.filter(mastered=True).count()
    new_badges = AchievementManager.check_and_award_achievements(
        user, 
        'concept_mastered',
        mastered_count=mastered_count
    )
    
    # Get updated tree data
    tree_data = NodeManager.get_tree_visualization_data(tree)
    
    return JsonResponse({
        'success': True,
        'node': {
            'id': node.id,
            'concept_id': node.concept_id,
            'mastered': node.mastered,
            'confidence': node.mastery_confidence
        },
        'tree': tree_data,
        'new_badges': [
            {
                'title': badge.badge.title,
                'description': badge.badge.description
            }
            for badge in new_badges
        ]
    })


@require_GET
@login_required
def get_tree_health(request):
    """
    GET /api/gamification/tree/health/
    Get tree health score and status
    """
    user = request.user
    
    try:
        tree = KnowledgeTree.objects.get(user=user)
    except KnowledgeTree.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Tree not found'
        }, status=404)
    
    # Update health score
    TreeStateManager.update_tree_health(tree)
    
    mastered_count = tree.nodes.filter(mastered=True).count()
    
    return JsonResponse({
        'success': True,
        'health_score': tree.health_score,
        'state': TreeStateManager.get_tree_state(mastered_count),
        'is_wilted': TreeStateManager.check_wilt_status(tree),
        'last_updated': tree.last_updated.isoformat()
    })


# ==================== STREAK ENDPOINTS ====================

@require_POST
@login_required
@csrf_exempt
def update_streak(request):
    """
    POST /api/gamification/streak/update/
    Update user streak on login
    """
    user = request.user
    
    streak, is_milestone, golden_leaves = StreakManager.update_streak(user)
    
    # Award streak achievements
    new_badges = []
    if is_milestone:
        new_badges = AchievementManager.check_and_award_achievements(
            user,
            'streak_milestone',
            streak_count=streak.current_streak
        )
    
    return JsonResponse({
        'success': True,
        'streak': {
            'current': streak.current_streak,
            'best': streak.best_streak,
            'last_login': streak.last_login.isoformat()
        },
        'golden_leaves_unlocked': golden_leaves,
        'is_milestone': is_milestone,
        'new_badges': [
            {
                'title': badge.badge.title,
                'description': badge.badge.description
            }
            for badge in new_badges
        ]
    })


@require_GET
@login_required
def get_streak(request):
    """
    GET /api/gamification/streak/
    Get current streak information
    """
    user = request.user
    
    try:
        streak = Streak.objects.get(user=user)
    except Streak.DoesNotExist:
        return JsonResponse({
            'success': True,
            'streak': {
                'current': 0,
                'best': 0,
                'last_login': None
            }
        })
    
    milestones = StreakManager.get_streak_milestones(streak.current_streak)
    
    return JsonResponse({
        'success': True,
        'streak': {
            'current': streak.current_streak,
            'best': streak.best_streak,
            'last_login': streak.last_login.isoformat() if streak.last_login else None
        },
        'milestones': milestones
    })


# ==================== ACHIEVEMENT ENDPOINTS ====================

@require_GET
@login_required
def get_user_badges(request):
    """
    GET /api/gamification/achievements/badges/
    Get all badges earned by user
    """
    user = request.user
    
    badges = UserBadge.objects.filter(user=user).select_related('badge')
    
    badge_list = [
        {
            'key': badge.badge.key,
            'title': badge.badge.title,
            'description': badge.badge.description,
            'earned_at': badge.earned_at.isoformat()
        }
        for badge in badges
    ]
    
    return JsonResponse({
        'success': True,
        'badges': badge_list,
        'total_badges': len(badge_list)
    })


@require_GET
@login_required
def get_available_badges(request):
    """
    GET /api/gamification/achievements/available/
    Get all available badges (earned and unearned)
    """
    user = request.user
    
    from .models import BadgeDefinition
    
    all_badges = BadgeDefinition.objects.all()
    earned_badge_ids = set(
        UserBadge.objects.filter(user=user).values_list('badge_id', flat=True)
    )
    
    badge_list = [
        {
            'key': badge.key,
            'title': badge.title,
            'description': badge.description,
            'earned': badge.id in earned_badge_ids
        }
        for badge in all_badges
    ]
    
    return JsonResponse({
        'success': True,
        'badges': badge_list,
        'total_available': len(badge_list),
        'total_earned': len(earned_badge_ids)
    })


# ==================== CHALLENGE ENDPOINTS ====================

@require_GET
@login_required
def get_daily_challenge(request):
    """
    GET /api/gamification/challenges/daily/
    Get today's challenge for user
    """
    user = request.user
    
    challenge = ChallengeManager.create_daily_challenge(user)
    
    if not challenge:
        return JsonResponse({
            'success': False,
            'error': 'No challenges available'
        }, status=404)
    
    return JsonResponse({
        'success': True,
        'challenge': {
            'key': challenge.template_key,
            'text': challenge.text,
            'duration_minutes': challenge.duration_minutes
        }
    })


@require_POST
@login_required
@csrf_exempt
def check_offline_challenge_trigger(request):
    """
    POST /api/gamification/challenges/check-trigger/
    Check if offline challenge should be triggered
    Body: {
        "usage_minutes": 25,
        "concepts_completed": 2
    }
    """
    data = get_json_body(request)
    usage_minutes = data.get('usage_minutes', 0)
    concepts_completed = data.get('concepts_completed', 0)
    
    should_trigger = ChallengeManager.should_trigger_offline_challenge({
        'usage_minutes': usage_minutes,
        'concepts_completed': concepts_completed
    })
    
    challenge = None
    if should_trigger:
        challenge = ChallengeManager.get_random_challenge()
    
    return JsonResponse({
        'success': True,
        'should_trigger': should_trigger,
        'challenge': {
            'key': challenge.template_key,
            'text': challenge.text,
            'duration_minutes': challenge.duration_minutes
        } if challenge else None
    })


# ==================== ANALYTICS ENDPOINTS ====================

@require_GET
@login_required
def get_user_analytics(request):
    """
    GET /api/gamification/analytics/
    Get user analytics for specified period
    Query params: start_date, end_date (ISO format)
    """
    user = request.user
    
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    # Parse dates if provided
    from datetime import datetime
    if start_date:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    if end_date:
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
    
    analytics = AnalyticsManager.get_user_analytics(user, start_date, end_date)
    
    return JsonResponse({
        'success': True,
        'analytics': analytics
    })


@require_GET
@login_required
def get_weekly_report(request):
    """
    GET /api/gamification/analytics/weekly-report/
    Get weekly progress report
    """
    user = request.user
    
    report = AnalyticsManager.generate_weekly_report(user)
    
    return JsonResponse({
        'success': True,
        'report': report
    })


@require_GET
@login_required
def export_analytics_csv(request):
    """
    GET /api/gamification/analytics/export/
    Export analytics data as CSV
    """
    import csv
    
    user = request.user
    analytics = AnalyticsManager.get_user_analytics(user)
    
    # Create CSV response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="ecomind_analytics_{user.id}.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Metric', 'Value'])
    writer.writerow(['Total Concepts', analytics['concepts']['total']])
    writer.writerow(['Mastered Concepts', analytics['concepts']['mastered']])
    writer.writerow(['Mastery Rate', f"{analytics['concepts']['mastery_rate']}%"])
    writer.writerow(['Current Streak', analytics['streaks']['current']])
    writer.writerow(['Best Streak', analytics['streaks']['best']])
    writer.writerow(['Badges Earned', analytics['achievements']['badges_earned']])
    
    return response
