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


from django.contrib.auth.models import User

# Helper function to get the current user or a demo user
def get_current_user(request):
    """Return the logged-in user or a default demo user"""
    if request.user.is_authenticated:
        return request.user
    user, _ = User.objects.get_or_create(username='demo_user')
    return user

# Helper function to parse JSON body
def get_json_body(request):
    """Parse JSON from request body"""
    try:
        return json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return {}

@require_GET
def api_root(request):
    """
    GET /api/gamification/
    Welcome message and available endpoints
    """
    return JsonResponse({
        'message': 'Welcome to the EchoMind Gamification API',
        'endpoints': {
            'tree': ['/api/gamification/tree/state/', '/api/gamification/tree/node/', '/api/gamification/tree/health/'],
            'streak': ['/api/gamification/streak/', '/api/gamification/streak/update/'],
            'achievements': ['/api/gamification/achievements/badges/', '/api/gamification/achievements/available/'],
            'challenges': ['/api/gamification/challenges/daily/', '/api/gamification/challenges/check-trigger/'],
            'analytics': ['/api/gamification/analytics/', '/api/gamification/analytics/weekly-report/']
        }
    })

# ==================== KNOWLEDGE TREE ENDPOINTS ====================

@require_GET
def get_tree_state(request):
    """GET /api/gamification/tree/state/"""
    user = get_current_user(request)
    tree, _ = KnowledgeTree.objects.get_or_create(user=user)
    tree_data = NodeManager.get_tree_visualization_data(tree)
    return JsonResponse({'success': True, 'data': tree_data})

@require_POST
@csrf_exempt
def add_tree_node(request):
    """POST /api/gamification/tree/node/"""
    user = get_current_user(request)
    data = get_json_body(request)
    tree, _ = KnowledgeTree.objects.get_or_create(user=user)
    concept_id = data.get('concept_id')
    title = data.get('title')
    category = data.get('category', 'default')
    confidence = data.get('confidence', 0.0)
    
    if not concept_id or not title:
        return JsonResponse({'success': False, 'error': 'concept_id and title are required'}, status=400)
    
    node, created = NodeManager.create_node(tree, concept_id, title, category, confidence)
    tree_data = NodeManager.get_tree_visualization_data(tree)
    return JsonResponse({'success': True, 'created': created, 'node': {'id': node.id, 'concept_id': node.concept_id, 'title': node.title, 'mastered': node.mastered}, 'tree': tree_data})

@require_POST
@csrf_exempt
def mark_concept_mastered(request, concept_id):
    """POST /api/gamification/tree/node/<concept_id>/master/"""
    user = get_current_user(request)
    data = get_json_body(request)
    try:
        tree = KnowledgeTree.objects.get(user=user)
        node = TreeNode.objects.get(tree=tree, concept_id=concept_id)
    except (KnowledgeTree.DoesNotExist, TreeNode.DoesNotExist):
        return JsonResponse({'success': False, 'error': 'Node not found'}, status=404)
    
    confidence = data.get('confidence', 1.0)
    NodeManager.mark_mastered(node, confidence)
    mastered_count = tree.nodes.filter(mastered=True).count()
    new_badges = AchievementManager.check_and_award_achievements(user, 'concept_mastered', mastered_count=mastered_count)
    tree_data = NodeManager.get_tree_visualization_data(tree)
    return JsonResponse({'success': True, 'node': {'id': node.id, 'concept_id': node.concept_id, 'mastered': node.mastered, 'confidence': node.mastery_confidence}, 'tree': tree_data, 'new_badges': [{'title': badge.badge.title, 'description': badge.badge.description} for badge in new_badges]})

@require_GET
def get_tree_health(request):
    """GET /api/gamification/tree/health/"""
    user = get_current_user(request)
    try:
        tree = KnowledgeTree.objects.get(user=user)
    except KnowledgeTree.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Tree not found'}, status=404)
    TreeStateManager.update_tree_health(tree)
    mastered_count = tree.nodes.filter(mastered=True).count()
    return JsonResponse({'success': True, 'health_score': tree.health_score, 'state': TreeStateManager.get_tree_state(mastered_count), 'is_wilted': TreeStateManager.check_wilt_status(tree), 'last_updated': tree.last_updated.isoformat()})

# ==================== STREAK ENDPOINTS ====================

@require_POST
@csrf_exempt
def update_streak(request):
    """POST /api/gamification/streak/update/"""
    user = get_current_user(request)
    streak, is_milestone, golden_leaves = StreakManager.update_streak(user)
    new_badges = []
    if is_milestone:
        new_badges = AchievementManager.check_and_award_achievements(user, 'streak_milestone', streak_count=streak.current_streak)
    return JsonResponse({'success': True, 'streak': {'current': streak.current_streak, 'best': streak.best_streak, 'last_login': streak.last_login.isoformat()}, 'golden_leaves_unlocked': golden_leaves, 'is_milestone': is_milestone, 'new_badges': [{'title': badge.badge.title, 'description': badge.badge.description} for badge in new_badges]})

@require_GET
def get_streak(request):
    """GET /api/gamification/streak/"""
    user = get_current_user(request)
    try:
        streak = Streak.objects.get(user=user)
    except Streak.DoesNotExist:
        return JsonResponse({'success': True, 'streak': {'current': 0, 'best': 0, 'last_login': None}})
    milestones = StreakManager.get_streak_milestones(streak.current_streak)
    return JsonResponse({'success': True, 'streak': {'current': streak.current_streak, 'best': streak.best_streak, 'last_login': streak.last_login.isoformat() if streak.last_login else None}, 'milestones': milestones})

# ==================== ACHIEVEMENT ENDPOINTS ====================

@require_GET
def get_user_badges(request):
    """GET /api/gamification/achievements/badges/"""
    user = get_current_user(request)
    badges = UserBadge.objects.filter(user=user).select_related('badge')
    badge_list = [{'key': badge.badge.key, 'title': badge.badge.title, 'description': badge.badge.description, 'earned_at': badge.earned_at.isoformat()} for badge in badges]
    return JsonResponse({'success': True, 'badges': badge_list, 'total_badges': len(badge_list)})

@require_GET
def get_available_badges(request):
    """GET /api/gamification/achievements/available/"""
    user = get_current_user(request)
    from .models import BadgeDefinition
    all_badges = BadgeDefinition.objects.all()
    earned_badge_ids = set(UserBadge.objects.filter(user=user).values_list('badge_id', flat=True))
    badge_list = [{'key': badge.key, 'title': badge.title, 'description': badge.description, 'earned': badge.id in earned_badge_ids} for badge in all_badges]
    return JsonResponse({'success': True, 'badges': badge_list, 'total_available': len(badge_list), 'total_earned': len(earned_badge_ids)})

# ==================== CHALLENGE ENDPOINTS ====================

@require_GET
def get_daily_challenge(request):
    """GET /api/gamification/challenges/daily/"""
    user = get_current_user(request)
    challenge = ChallengeManager.create_daily_challenge(user)
    if not challenge:
        return JsonResponse({'success': False, 'error': 'No challenges available'}, status=404)
    return JsonResponse({'success': True, 'challenge': {'key': challenge.template_key, 'text': challenge.text, 'duration_minutes': challenge.duration_minutes}})

@require_POST
@csrf_exempt
def check_offline_challenge_trigger(request):
    """POST /api/gamification/challenges/check-trigger/"""
    data = get_json_body(request)
    usage_minutes = data.get('usage_minutes', 0)
    concepts_completed = data.get('concepts_completed', 0)
    should_trigger = ChallengeManager.should_trigger_offline_challenge({'usage_minutes': usage_minutes, 'concepts_completed': concepts_completed})
    challenge = None
    if should_trigger:
        challenge = ChallengeManager.get_random_challenge()
    return JsonResponse({'success': True, 'should_trigger': should_trigger, 'challenge': {'key': challenge.template_key, 'text': challenge.text, 'duration_minutes': challenge.duration_minutes} if challenge else None})

# ==================== ANALYTICS ENDPOINTS ====================

@require_GET
def get_user_analytics(request):
    """GET /api/gamification/analytics/"""
    user = get_current_user(request)
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    from datetime import datetime
    if start_date:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    if end_date:
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
    analytics = AnalyticsManager.get_user_analytics(user, start_date, end_date)
    return JsonResponse({'success': True, 'analytics': analytics})

@require_GET
def get_weekly_report(request):
    """GET /api/gamification/analytics/weekly-report/"""
    user = get_current_user(request)
    report = AnalyticsManager.generate_weekly_report(user)
    return JsonResponse({'success': True, 'report': report})

@require_GET
def export_analytics_csv(request):
    """GET /api/gamification/analytics/export/"""
    import csv
    user = get_current_user(request)
    analytics = AnalyticsManager.get_user_analytics(user)
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
