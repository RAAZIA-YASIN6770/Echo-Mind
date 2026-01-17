import pytest
from django.conf import settings


@pytest.fixture(autouse=True)
def ensure_settings_configured():
    """Ensure Django settings are available for pytest-django."""
    assert settings is not None
