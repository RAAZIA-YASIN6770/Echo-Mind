"""
Knowledge Tree Services - Complete Implementation
Handles tree state calculation, node management, and real-time updates
"""
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
from .models import KnowledgeTree, TreeNode
import math


class TreeStateManager:
    """Manages tree health score and state progression"""
    
    # Tree state thresholds
    STATES = {
        'seedling': (0, 5),
        'sapling': (6, 15),
        'young_tree': (16, 30),
        'mature_tree': (31, 100)
    }
    
    WILT_THRESHOLD_HOURS = 72  # 72 hours of inactivity
    
    @classmethod
    def calculate_health_score(cls, tree):
        """
        Calculate tree health score (0-100) based on:
        - Number of mastered concepts
        - Recency of activity
        - Mastery confidence levels
        """
        nodes = tree.nodes.all()
        
        if not nodes.exists():
            return 0
        
        # Base score from mastered concepts
        mastered_count = nodes.filter(mastered=True).count()
        base_score = min(100, mastered_count * 2)
        
        # Recency penalty
        now = timezone.now()
        time_since_update = (now - tree.last_updated).total_seconds() / 3600  # hours
        
        if time_since_update > cls.WILT_THRESHOLD_HOURS:
            # Apply wilt penalty
            hours_over = time_since_update - cls.WILT_THRESHOLD_HOURS
            penalty = min(50, hours_over * 0.5)  # Max 50% penalty
            base_score = max(0, base_score - penalty)
        
        # Average confidence boost
        avg_confidence = nodes.filter(mastered=True).aggregate(
            avg=models.Avg('mastery_confidence')
        )['avg'] or 0
        confidence_boost = avg_confidence * 10  # Max 10 points
        
        final_score = min(100, base_score + confidence_boost)
        return int(final_score)
    
    @classmethod
    def get_tree_state(cls, mastered_count):
        """Determine tree state based on mastered concepts"""
        for state, (min_val, max_val) in cls.STATES.items():
            if min_val <= mastered_count <= max_val:
                return state
        return 'mature_tree'
    
    @classmethod
    def check_wilt_status(cls, tree):
        """Check if tree should be in wilt state"""
        now = timezone.now()
        hours_inactive = (now - tree.last_updated).total_seconds() / 3600
        return hours_inactive > cls.WILT_THRESHOLD_HOURS
    
    @classmethod
    def update_tree_health(cls, tree):
        """Update tree health score and save"""
        tree.health_score = cls.calculate_health_score(tree)
        tree.save()
        return tree


class NodeManager:
    """Manages tree nodes - creation, positioning, and updates"""
    
    # Node types based on concept categories
    NODE_TYPES = {
        'math': 'fruit_apple',
        'science': 'fruit_orange',
        'language': 'fruit_berry',
        'history': 'leaf_oak',
        'geography': 'leaf_maple',
        'default': 'fruit_generic'
    }
    
    @classmethod
    def create_node(cls, tree, concept_id, title, category='default', confidence=0.0):
        """Create a new node in the knowledge tree"""
        with transaction.atomic():
            node, created = TreeNode.objects.get_or_create(
                tree=tree,
                concept_id=concept_id,
                defaults={
                    'title': title,
                    'mastered': False,
                    'mastery_confidence': confidence,
                }
            )
            
            if created:
                # Update tree health
                TreeStateManager.update_tree_health(tree)
            
            return node, created
    
    @classmethod
    def mark_mastered(cls, node, confidence=1.0):
        """Mark a node as mastered and update tree"""
        with transaction.atomic():
            node.mastered = True
            node.mastery_confidence = confidence
            node.last_practiced = timezone.now()
            node.save()
            
            # Update tree health
            TreeStateManager.update_tree_health(node.tree)
            
            return node
    
    @classmethod
    def get_node_position(cls, tree, node_index):
        """
        Calculate node position using spiral algorithm
        Returns (x, y) coordinates for SVG rendering
        """
        if node_index == 0:
            return (0, 0)  # Root position
        
        # Fibonacci spiral for natural tree growth
        angle = node_index * 137.5  # Golden angle in degrees
        radius = math.sqrt(node_index) * 20  # Spiral outward
        
        x = radius * math.cos(math.radians(angle))
        y = radius * math.sin(math.radians(angle))
        
        return (round(x, 2), round(y, 2))
    
    @classmethod
    def get_node_color(cls, node):
        """Determine node color based on mastery and recency"""
        if not node.mastered:
            return '#cccccc'  # Grey for unmastered
        
        # Check recency
        if node.last_practiced:
            days_ago = (timezone.now() - node.last_practiced).days
            if days_ago > 30:
                return '#ffcc00'  # Yellow - needs review
        
        # Confidence-based green shades
        if node.mastery_confidence >= 0.9:
            return '#00cc00'  # Bright green
        elif node.mastery_confidence >= 0.7:
            return '#66cc66'  # Medium green
        else:
            return '#99cc99'  # Light green
    
    @classmethod
    def get_tree_visualization_data(cls, tree):
        """
        Generate complete visualization data for frontend
        Returns JSON-serializable dict
        """
        nodes = tree.nodes.all().order_by('id')
        mastered_count = nodes.filter(mastered=True).count()
        
        node_data = []
        for idx, node in enumerate(nodes):
            x, y = cls.get_node_position(tree, idx)
            node_data.append({
                'id': node.id,
                'concept_id': node.concept_id,
                'title': node.title,
                'mastered': node.mastered,
                'confidence': node.mastery_confidence,
                'position': {'x': x, 'y': y},
                'color': cls.get_node_color(node),
                'last_practiced': node.last_practiced.isoformat() if node.last_practiced else None
            })
        
        return {
            'health_score': tree.health_score,
            'state': TreeStateManager.get_tree_state(mastered_count),
            'is_wilted': TreeStateManager.check_wilt_status(tree),
            'mastered_count': mastered_count,
            'total_nodes': nodes.count(),
            'nodes': node_data,
            'last_updated': tree.last_updated.isoformat()
        }


# Import models for aggregate function
from django.db.models import Avg
import django.db.models as models
