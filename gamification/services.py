from django.utils import timezone
from django.db import transaction
from .models import KnowledgeTree, TreeNode, Streak


def mark_concept_mastered(user, concept_id, title, confidence=1.0):
    """Mark a concept as mastered and update KnowledgeTree health."""
    with transaction.atomic():
        tree, _ = KnowledgeTree.objects.get_or_create(user=user)
        node, created = TreeNode.objects.get_or_create(tree=tree, concept_id=concept_id, defaults={
            'title': title,
        })
        node.mastered = True
        node.mastery_confidence = confidence
        node.last_practiced = timezone.now()
        node.save()

        # simple health update heuristic: +2 per concept
        tree.health_score = min(100, tree.health_score + 2)
        tree.save()

    return node


def update_streak_on_login(user, now=None):
    now = now or timezone.now()
    streak, _ = Streak.objects.get_or_create(user=user)
    if streak.last_login is None:
        streak.current_streak = 1
    else:
        # simple day-diff streak logic
        delta = (now.date() - streak.last_login.date()).days
        if delta == 1:
            streak.current_streak += 1
        elif delta > 1:
            streak.current_streak = 1
    streak.last_login = now
    streak.best_streak = max(streak.best_streak, streak.current_streak)
    streak.save()
    return streak
