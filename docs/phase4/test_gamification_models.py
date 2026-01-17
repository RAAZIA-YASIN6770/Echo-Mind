import pytest
from django.contrib.auth import get_user_model


def test_mark_concept_mastered_creates_node(db):
    from gamification.services import mark_concept_mastered
    User = get_user_model()
    user = User.objects.create_user(username='t_gamer')

    node = mark_concept_mastered(user, 'photosynthesis', 'Photosynthesis', confidence=0.9)
    assert node.mastered is True
    assert node.mastery_confidence == 0.9


def test_update_streak_on_login_initial(db):
    from gamification.services import update_streak_on_login
    User = get_user_model()
    user = User.objects.create_user(username='streaker')

    s = update_streak_on_login(user)
    assert s.current_streak == 1
