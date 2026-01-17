"""
Phase 4 Tests - Knowledge Tree and Gamification
Comprehensive test suite for all Phase 4 functionality
"""
import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from gamification.models import (
    KnowledgeTree, TreeNode, Streak, BadgeDefinition, 
    UserBadge, OfflineChallenge
)
from gamification.tree_services import TreeStateManager, NodeManager
from gamification.gamification_services import (
    StreakManager, AchievementManager, ChallengeManager, AnalyticsManager
)

User = get_user_model()


@pytest.fixture
def user(db):
    """Create test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def tree(user):
    """Create test knowledge tree"""
    return KnowledgeTree.objects.create(user=user, health_score=50)


# ==================== TREE STATE TESTS ====================

@pytest.mark.django_db
class TestTreeStateManager:
    
    def test_calculate_health_score_empty_tree(self, tree):
        """Test health score calculation for empty tree"""
        score = TreeStateManager.calculate_health_score(tree)
        assert score == 0
    
    def test_calculate_health_score_with_nodes(self, tree):
        """Test health score with mastered concepts"""
        # Add 5 mastered nodes
        for i in range(5):
            TreeNode.objects.create(
                tree=tree,
                concept_id=f'concept_{i}',
                title=f'Concept {i}',
                mastered=True,
                mastery_confidence=0.9,
                last_practiced=timezone.now()
            )
        
        score = TreeStateManager.calculate_health_score(tree)
        assert score > 0
        assert score <= 100
    
    def test_get_tree_state_seedling(self):
        """Test tree state for seedling (0-5 concepts)"""
        state = TreeStateManager.get_tree_state(3)
        assert state == 'seedling'
    
    def test_get_tree_state_sapling(self):
        """Test tree state for sapling (6-15 concepts)"""
        state = TreeStateManager.get_tree_state(10)
        assert state == 'sapling'
    
    def test_get_tree_state_young_tree(self):
        """Test tree state for young tree (16-30 concepts)"""
        state = TreeStateManager.get_tree_state(20)
        assert state == 'young_tree'
    
    def test_get_tree_state_mature_tree(self):
        """Test tree state for mature tree (31+ concepts)"""
        state = TreeStateManager.get_tree_state(40)
        assert state == 'mature_tree'
    
    def test_check_wilt_status_active(self, tree):
        """Test wilt status for active tree"""
        tree.last_updated = timezone.now()
        tree.save()
        
        is_wilted = TreeStateManager.check_wilt_status(tree)
        assert is_wilted is False
    
    def test_check_wilt_status_inactive(self, tree):
        """Test wilt status for inactive tree (>72 hours)"""
        # Use update() to bypass auto_now field
        old_time = timezone.now() - timedelta(hours=80)
        KnowledgeTree.objects.filter(id=tree.id).update(last_updated=old_time)
        tree.refresh_from_db()
        
        is_wilted = TreeStateManager.check_wilt_status(tree)
        assert is_wilted is True



# ==================== NODE MANAGER TESTS ====================

@pytest.mark.django_db
class TestNodeManager:
    
    def test_create_node(self, tree):
        """Test creating a new node"""
        node, created = NodeManager.create_node(
            tree, 'test_concept', 'Test Concept', 'math', 0.0
        )
        
        assert created is True
        assert node.concept_id == 'test_concept'
        assert node.title == 'Test Concept'
        assert node.mastered is False
    
    def test_create_duplicate_node(self, tree):
        """Test creating duplicate node returns existing"""
        node1, created1 = NodeManager.create_node(
            tree, 'test_concept', 'Test Concept'
        )
        node2, created2 = NodeManager.create_node(
            tree, 'test_concept', 'Test Concept'
        )
        
        assert created1 is True
        assert created2 is False
        assert node1.id == node2.id
    
    def test_mark_mastered(self, tree):
        """Test marking node as mastered"""
        node, _ = NodeManager.create_node(tree, 'test', 'Test')
        
        NodeManager.mark_mastered(node, confidence=0.95)
        
        node.refresh_from_db()
        assert node.mastered is True
        assert node.mastery_confidence == 0.95
        assert node.last_practiced is not None
    
    def test_get_node_position(self, tree):
        """Test node positioning algorithm"""
        # Root node
        x, y = NodeManager.get_node_position(tree, 0)
        assert x == 0 and y == 0
        
        # Other nodes should have non-zero positions
        x, y = NodeManager.get_node_position(tree, 5)
        assert x != 0 or y != 0
    
    def test_get_node_color_unmastered(self, tree):
        """Test color for unmastered node"""
        node = TreeNode.objects.create(
            tree=tree,
            concept_id='test',
            title='Test',
            mastered=False
        )
        
        color = NodeManager.get_node_color(node)
        assert color == '#cccccc'
    
    def test_get_node_color_mastered_high_confidence(self, tree):
        """Test color for mastered node with high confidence"""
        node = TreeNode.objects.create(
            tree=tree,
            concept_id='test',
            title='Test',
            mastered=True,
            mastery_confidence=0.95,
            last_practiced=timezone.now()
        )
        
        color = NodeManager.get_node_color(node)
        assert color == '#00cc00'
    
    def test_get_tree_visualization_data(self, tree):
        """Test generating visualization data"""
        # Add some nodes
        for i in range(3):
            TreeNode.objects.create(
                tree=tree,
                concept_id=f'concept_{i}',
                title=f'Concept {i}',
                mastered=i < 2,  # First 2 mastered
                mastery_confidence=0.9
            )
        
        data = NodeManager.get_tree_visualization_data(tree)
        
        assert 'health_score' in data
        assert 'state' in data
        assert 'nodes' in data
        assert len(data['nodes']) == 3
        assert data['mastered_count'] == 2


# ==================== STREAK MANAGER TESTS ====================

@pytest.mark.django_db
class TestStreakManager:
    
    def test_first_login(self, user):
        """Test first login creates streak"""
        streak, is_milestone, golden = StreakManager.update_streak(user)
        
        assert streak.current_streak == 1
        assert streak.best_streak == 1
        assert is_milestone is True
        assert golden is False
    
    def test_consecutive_day_login(self, user):
        """Test consecutive day login increments streak"""
        # First login
        first_time = timezone.now() - timedelta(days=1)
        StreakManager.update_streak(user, first_time)
        
        # Second day login
        streak, is_milestone, golden = StreakManager.update_streak(user)
        
        assert streak.current_streak == 2
        assert is_milestone is True
    
    def test_same_day_login(self, user):
        """Test same day login doesn't change streak"""
        # First login
        StreakManager.update_streak(user)
        
        # Same day login
        streak, is_milestone, golden = StreakManager.update_streak(user)
        
        assert streak.current_streak == 1
        assert is_milestone is False
    
    def test_streak_broken(self, user):
        """Test streak resets after missing a day"""
        # First login
        first_time = timezone.now() - timedelta(days=3)
        StreakManager.update_streak(user, first_time)
        
        # Login after 3 days
        streak, is_milestone, golden = StreakManager.update_streak(user)
        
        assert streak.current_streak == 1
    
    def test_golden_leaves_unlock(self, user):
        """Test Golden Leaves unlock at 5-day streak"""
        # Simulate 5 consecutive days
        for i in range(5):
            login_time = timezone.now() - timedelta(days=4-i)
            streak, is_milestone, golden = StreakManager.update_streak(user, login_time)
        
        assert streak.current_streak == 5
        assert golden is True
    
    def test_best_streak_tracking(self, user):
        """Test best streak is tracked correctly"""
        # Build up to 7 days
        for i in range(7):
            login_time = timezone.now() - timedelta(days=6-i)
            StreakManager.update_streak(user, login_time)
        
        streak = Streak.objects.get(user=user)
        assert streak.best_streak == 7
        
        # Break streak and rebuild to 3
        later_time = timezone.now() + timedelta(days=5)
        StreakManager.update_streak(user, later_time)
        
        streak.refresh_from_db()
        assert streak.current_streak == 1
        assert streak.best_streak == 7  # Best streak preserved


# ==================== ACHIEVEMENT MANAGER TESTS ====================

@pytest.mark.django_db
class TestAchievementManager:
    
    def test_initialize_badges(self):
        """Test badge initialization"""
        AchievementManager.initialize_badges()
        
        count = BadgeDefinition.objects.count()
        assert count == len(AchievementManager.ACHIEVEMENTS)
    
    def test_award_badge(self, user):
        """Test awarding a badge"""
        AchievementManager.initialize_badges()
        
        badge, created = AchievementManager.award_badge(user, 'first_login')
        
        assert created is True
        assert badge.user == user
    
    def test_award_duplicate_badge(self, user):
        """Test awarding same badge twice"""
        AchievementManager.initialize_badges()
        
        badge1, created1 = AchievementManager.award_badge(user, 'first_login')
        badge2, created2 = AchievementManager.award_badge(user, 'first_login')
        
        assert created1 is True
        assert created2 is False
        assert badge1.id == badge2.id
    
    def test_check_first_login_achievement(self, user):
        """Test first login achievement"""
        AchievementManager.initialize_badges()
        
        badges = AchievementManager.check_and_award_achievements(user, 'login')
        
        assert len(badges) == 1
        assert badges[0].badge.key == 'first_login'
    
    def test_check_concept_milestones(self, user):
        """Test concept milestone achievements"""
        AchievementManager.initialize_badges()
        
        # First concept
        badges = AchievementManager.check_and_award_achievements(
            user, 'concept_mastered', mastered_count=1
        )
        assert len(badges) == 1
        assert badges[0].badge.key == 'first_concept'
        
        # 10 concepts
        badges = AchievementManager.check_and_award_achievements(
            user, 'concept_mastered', mastered_count=10
        )
        assert len(badges) == 1
        assert badges[0].badge.key == '10_concepts'


# ==================== CHALLENGE MANAGER TESTS ====================

@pytest.mark.django_db
class TestChallengeManager:
    
    def test_initialize_challenges(self):
        """Test challenge initialization"""
        ChallengeManager.initialize_challenges()
        
        count = OfflineChallenge.objects.count()
        assert count == len(ChallengeManager.OFFLINE_CHALLENGES)
    
    def test_get_random_challenge(self):
        """Test getting random challenge"""
        ChallengeManager.initialize_challenges()
        
        challenge = ChallengeManager.get_random_challenge()
        
        assert challenge is not None
        assert challenge.text in ChallengeManager.OFFLINE_CHALLENGES
    
    def test_should_trigger_by_time(self):
        """Test trigger by 20 minutes usage"""
        should_trigger = ChallengeManager.should_trigger_offline_challenge({
            'usage_minutes': 25,
            'concepts_completed': 0
        })
        
        assert should_trigger is True
    
    def test_should_trigger_by_concepts(self):
        """Test trigger by 3 concepts completed"""
        should_trigger = ChallengeManager.should_trigger_offline_challenge({
            'usage_minutes': 5,
            'concepts_completed': 3
        })
        
        assert should_trigger is True
    
    def test_should_not_trigger(self):
        """Test no trigger when conditions not met"""
        should_trigger = ChallengeManager.should_trigger_offline_challenge({
            'usage_minutes': 10,
            'concepts_completed': 1
        })
        
        assert should_trigger is False
    
    def test_create_daily_challenge(self, user):
        """Test daily challenge creation"""
        ChallengeManager.initialize_challenges()
        
        challenge = ChallengeManager.create_daily_challenge(user)
        
        assert challenge is not None


# ==================== ANALYTICS MANAGER TESTS ====================

@pytest.mark.django_db
class TestAnalyticsManager:
    
    def test_get_user_analytics_no_data(self, user):
        """Test analytics for user with no data"""
        analytics = AnalyticsManager.get_user_analytics(user)
        
        assert analytics['concepts']['total'] == 0
        assert analytics['concepts']['mastered'] == 0
        assert analytics['streaks']['current'] == 0
    
    def test_get_user_analytics_with_data(self, user, tree):
        """Test analytics with actual data"""
        # Add some nodes
        for i in range(5):
            TreeNode.objects.create(
                tree=tree,
                concept_id=f'concept_{i}',
                title=f'Concept {i}',
                mastered=i < 3,
                last_practiced=timezone.now()
            )
        
        # Add streak
        Streak.objects.create(user=user, current_streak=5, best_streak=7)
        
        analytics = AnalyticsManager.get_user_analytics(user)
        
        assert analytics['concepts']['total'] == 5
        assert analytics['concepts']['mastered'] == 3
        assert analytics['concepts']['mastery_rate'] == 60.0
        assert analytics['streaks']['current'] == 5
        assert analytics['streaks']['best'] == 7
    
    def test_generate_weekly_report(self, user, tree):
        """Test weekly report generation"""
        # Add some recent nodes
        for i in range(3):
            TreeNode.objects.create(
                tree=tree,
                concept_id=f'concept_{i}',
                title=f'Concept {i}',
                mastered=True,
                last_practiced=timezone.now()
            )
        
        report = AnalyticsManager.generate_weekly_report(user)
        
        assert report['report_type'] == 'weekly'
        assert report['user_id'] == user.id
        assert 'analytics' in report
        assert 'summary' in report
