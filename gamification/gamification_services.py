"""
Gamification Services - Streaks, Achievements, and Challenges
Complete implementation for Phase 4
"""
from django.utils import timezone
from django.db import transaction
from datetime import timedelta, datetime
from .models import Streak, BadgeDefinition, UserBadge, OfflineChallenge
import random


class StreakManager:
    """Manages user login streaks and Golden Leaves rewards"""
    
    GOLDEN_LEAVES_THRESHOLD = 5  # Days for Golden Leaves unlock
    
    @classmethod
    def update_streak(cls, user, login_time=None):
        """
        Update user streak on login
        Returns: (streak_obj, is_new_milestone, golden_leaves_unlocked)
        """
        login_time = login_time or timezone.now()
        
        with transaction.atomic():
            streak, created = Streak.objects.get_or_create(user=user)
            
            if created or streak.last_login is None:
                # First login
                streak.current_streak = 1
                streak.last_login = login_time
                streak.best_streak = 1
                streak.save()
                return streak, True, False
            
            # Calculate days since last login
            days_diff = (login_time.date() - streak.last_login.date()).days
            
            is_milestone = False
            golden_leaves = False
            
            if days_diff == 0:
                # Same day login - no change
                pass
            elif days_diff == 1:
                # Consecutive day - increment streak
                streak.current_streak += 1
                is_milestone = True
                
                # Check for Golden Leaves unlock
                if streak.current_streak >= cls.GOLDEN_LEAVES_THRESHOLD:
                    golden_leaves = True
                
            else:
                # Streak broken - reset
                streak.current_streak = 1
            
            # Update best streak
            if streak.current_streak > streak.best_streak:
                streak.best_streak = streak.current_streak
            
            streak.last_login = login_time
            streak.save()
            
            return streak, is_milestone, golden_leaves
    
    @classmethod
    def get_streak_milestones(cls, streak_count):
        """Return milestone achievements for streak count"""
        milestones = []
        
        if streak_count >= 3:
            milestones.append('3_day_streak')
        if streak_count >= 5:
            milestones.append('golden_leaves')
        if streak_count >= 7:
            milestones.append('week_warrior')
        if streak_count >= 14:
            milestones.append('fortnight_champion')
        if streak_count >= 30:
            milestones.append('monthly_master')
        
        return milestones


class AchievementManager:
    """Manages user achievements and badges"""
    
    # Achievement definitions
    ACHIEVEMENTS = {
        'first_login': {
            'title': 'Welcome Explorer!',
            'description': 'Completed your first login to EcoMind',
            'icon': '🎉'
        },
        'first_concept': {
            'title': 'Knowledge Seeker',
            'description': 'Mastered your first concept',
            'icon': '🌱'
        },
        '10_concepts': {
            'title': 'Growing Mind',
            'description': 'Mastered 10 concepts',
            'icon': '🌿'
        },
        '25_concepts': {
            'title': 'Knowledge Builder',
            'description': 'Mastered 25 concepts',
            'icon': '🌳'
        },
        '50_concepts': {
            'title': 'Wisdom Tree',
            'description': 'Mastered 50 concepts',
            'icon': '🏆'
        },
        '7_day_streak': {
            'title': 'Week Warrior',
            'description': 'Maintained a 7-day learning streak',
            'icon': '🔥'
        },
        'misconception_buster': {
            'title': 'Misconception Buster',
            'description': 'Corrected a common misconception',
            'icon': '💡'
        },
        'knowledge_explorer': {
            'title': 'Knowledge Explorer',
            'description': 'Explored 5 different subject areas',
            'icon': '🗺️'
        },
        'question_master': {
            'title': 'Question Master',
            'description': 'Asked 50 thoughtful questions',
            'icon': '❓'
        },
        'golden_leaves': {
            'title': 'Golden Leaves',
            'description': 'Unlocked Golden Leaves with 5-day streak',
            'icon': '🍂'
        }
    }
    
    @classmethod
    def initialize_badges(cls):
        """Create all badge definitions in database"""
        for key, data in cls.ACHIEVEMENTS.items():
            BadgeDefinition.objects.get_or_create(
                key=key,
                defaults={
                    'title': data['title'],
                    'description': data['description']
                }
            )
    
    @classmethod
    def award_badge(cls, user, badge_key):
        """
        Award a badge to user
        Returns: (badge, created)
        """
        try:
            badge_def = BadgeDefinition.objects.get(key=badge_key)
            user_badge, created = UserBadge.objects.get_or_create(
                user=user,
                badge=badge_def
            )
            return user_badge, created
        except BadgeDefinition.DoesNotExist:
            return None, False
    
    @classmethod
    def check_and_award_achievements(cls, user, event_type, **kwargs):
        """
        Check if user qualifies for any achievements based on event
        Returns: list of newly awarded badges
        """
        new_badges = []
        
        if event_type == 'login':
            # Check first login
            if not UserBadge.objects.filter(user=user).exists():
                badge, created = cls.award_badge(user, 'first_login')
                if created:
                    new_badges.append(badge)
        
        elif event_type == 'concept_mastered':
            mastered_count = kwargs.get('mastered_count', 0)
            
            # First concept
            if mastered_count == 1:
                badge, created = cls.award_badge(user, 'first_concept')
                if created:
                    new_badges.append(badge)
            
            # Milestone concepts
            if mastered_count == 10:
                badge, created = cls.award_badge(user, '10_concepts')
                if created:
                    new_badges.append(badge)
            
            if mastered_count == 25:
                badge, created = cls.award_badge(user, '25_concepts')
                if created:
                    new_badges.append(badge)
            
            if mastered_count == 50:
                badge, created = cls.award_badge(user, '50_concepts')
                if created:
                    new_badges.append(badge)
        
        elif event_type == 'streak_milestone':
            streak_count = kwargs.get('streak_count', 0)
            
            if streak_count >= 7:
                badge, created = cls.award_badge(user, '7_day_streak')
                if created:
                    new_badges.append(badge)
            
            if streak_count >= 5:
                badge, created = cls.award_badge(user, 'golden_leaves')
                if created:
                    new_badges.append(badge)
        
        return new_badges


class ChallengeManager:
    """Manages offline challenges and daily challenges"""
    
    # Challenge templates
    OFFLINE_CHALLENGES = [
        "Draw a picture of what you learned today",
        "Teach a family member about your favorite concept",
        "Write 3 questions about something that interests you",
        "Find 5 examples of today's concept in your home",
        "Create a story using the words you learned",
        "Build something that represents your new knowledge",
        "Explain a concept to your pet or favorite toy",
        "Make up a song about what you discovered",
        "Look for patterns in nature related to your learning",
        "Interview someone about their knowledge on this topic",
        "Create a comic strip about the concept",
        "Make a list of 10 things you're curious about",
        "Observe something in nature for 5 minutes and describe it",
        "Design an experiment to test what you learned",
        "Write a letter to your future self about today's learning",
        "Create a mind map of connected ideas",
        "Find a real-world problem this knowledge could solve",
        "Teach this concept using only gestures (no words!)",
        "Create a quiz for your family about what you learned",
        "Make a prediction about something related to your learning"
    ]
    
    @classmethod
    def initialize_challenges(cls):
        """Create all challenge templates in database"""
        for idx, text in enumerate(cls.OFFLINE_CHALLENGES):
            OfflineChallenge.objects.get_or_create(
                template_key=f'challenge_{idx+1}',
                defaults={
                    'text': text,
                    'duration_minutes': 5
                }
            )
    
    @classmethod
    def get_random_challenge(cls):
        """Get a random offline challenge"""
        challenges = list(OfflineChallenge.objects.all())
        if challenges:
            return random.choice(challenges)
        return None
    
    @classmethod
    def should_trigger_offline_challenge(cls, user_session_data):
        """
        Check if offline challenge should be triggered
        Triggers on: 20 minutes usage OR 3 concepts completed
        """
        usage_minutes = user_session_data.get('usage_minutes', 0)
        concepts_completed = user_session_data.get('concepts_completed', 0)
        
        return usage_minutes >= 20 or concepts_completed >= 3
    
    @classmethod
    def create_daily_challenge(cls, user, date=None):
        """
        Create a daily challenge for user
        Returns challenge object
        """
        date = date or timezone.now().date()
        
        # Use date as seed for consistent daily challenge
        random.seed(f"{user.id}_{date}")
        challenge = cls.get_random_challenge()
        random.seed()  # Reset seed
        
        return challenge


class AnalyticsManager:
    """Manages user analytics and reporting"""
    
    @classmethod
    def get_user_analytics(cls, user, start_date=None, end_date=None):
        """
        Get comprehensive user analytics
        Returns dict with analytics data
        """
        from .models import KnowledgeTree, TreeNode
        
        end_date = end_date or timezone.now()
        start_date = start_date or (end_date - timedelta(days=7))
        
        # Get tree data
        try:
            tree = KnowledgeTree.objects.get(user=user)
            total_nodes = tree.nodes.count()
            mastered_nodes = tree.nodes.filter(mastered=True).count()
            
            # Nodes mastered in period
            period_mastered = tree.nodes.filter(
                mastered=True,
                last_practiced__gte=start_date,
                last_practiced__lte=end_date
            ).count()
        except KnowledgeTree.DoesNotExist:
            total_nodes = 0
            mastered_nodes = 0
            period_mastered = 0
        
        # Get streak data
        try:
            streak = Streak.objects.get(user=user)
            current_streak = streak.current_streak
            best_streak = streak.best_streak
        except Streak.DoesNotExist:
            current_streak = 0
            best_streak = 0
        
        # Get badges
        badges_earned = UserBadge.objects.filter(user=user).count()
        
        return {
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'concepts': {
                'total': total_nodes,
                'mastered': mastered_nodes,
                'mastered_this_period': period_mastered,
                'mastery_rate': round(mastered_nodes / total_nodes * 100, 1) if total_nodes > 0 else 0
            },
            'tree_health': tree.health_score if 'tree' in locals() else 0,
            'streaks': {
                'current': current_streak,
                'best': best_streak
            },
            'achievements': {
                'badges_earned': badges_earned
            }
        }
    
    @classmethod
    def generate_weekly_report(cls, user):
        """Generate weekly progress report for parents"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=7)
        
        analytics = cls.get_user_analytics(user, start_date, end_date)
        
        # Get recent badges
        recent_badges = UserBadge.objects.filter(
            user=user,
            earned_at__gte=start_date
        ).select_related('badge')
        
        badge_list = [
            {
                'title': ub.badge.title,
                'description': ub.badge.description,
                'earned_at': ub.earned_at.isoformat()
            }
            for ub in recent_badges
        ]
        
        return {
            'report_type': 'weekly',
            'user_id': user.id,
            'generated_at': end_date.isoformat(),
            'analytics': analytics,
            'recent_badges': badge_list,
            'summary': f"Mastered {analytics['concepts']['mastered_this_period']} new concepts this week!"
        }
