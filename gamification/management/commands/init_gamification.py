"""
Management command to initialize gamification data
Creates all badge definitions and challenge templates
"""
from django.core.management.base import BaseCommand
from gamification.gamification_services import AchievementManager, ChallengeManager


class Command(BaseCommand):
    help = 'Initialize gamification data (badges and challenges)'

    def handle(self, *args, **options):
        self.stdout.write('Initializing gamification data...')
        
        # Initialize badges
        self.stdout.write('Creating badge definitions...')
        AchievementManager.initialize_badges()
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {len(AchievementManager.ACHIEVEMENTS)} badge definitions'))
        
        # Initialize challenges
        self.stdout.write('Creating challenge templates...')
        ChallengeManager.initialize_challenges()
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {len(ChallengeManager.OFFLINE_CHALLENGES)} challenge templates'))
        
        self.stdout.write(self.style.SUCCESS('\n[SUCCESS] Gamification data initialized successfully!'))
