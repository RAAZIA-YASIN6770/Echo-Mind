import re
import logging

logger = logging.getLogger(__name__)

class SafetyService:
    """
    Core safety service for:
    1. PII Detection & Redaction
    2. Content Filtering (Blocked keywords)
    3. Prompt Injection Defense
    """
    
    # PII Patters
    EMAIL_REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    PHONE_REGEX = r'\b(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b'
    
    # Blocked Categories
    BLOCKED_KEYWORDS = [
        'politics', 'election', 'vote', 'democrat', 'republican',
        'religion', 'god', 'church', 'mosque', 'bible', 'quran',
        'violence', 'kill', 'gun', 'weapon', 'attack',
        'adult', 'sex', 'porn', 'nude'
    ]
    
    # Prompt Injection Patterns
    INJECTION_PATTERNS = [
        r'ignore previous instructions',
        r'disregard all prior',
        r'you are now',
        r'simulated mode',
        r'developer mode',
        r'jailbreak'
    ]

    @classmethod
    def sanitize_input(cls, text):
        """
        Main entry point for safety checks.
        Returns: (is_safe, sanitized_text, risk_reason)
        """
        # 1. Check for Prompt Injection
        if cls.detect_prompt_injection(text):
            return False, text, "prompt_injection_detected"
            
        # 2. Check for Blocked Content
        if cls.detect_blocked_content(text):
            return False, text, "unsafe_content_detected"
            
        # 3. Redact PII (Emails/Phones)
        sanitized_text = cls.redact_pii(text)
        
        return True, sanitized_text, None

    @classmethod
    def redact_pii(cls, text):
        """Redact emails and phone numbers"""
        text = re.sub(cls.EMAIL_REGEX, '[EMAIL REDACTED]', text)
        text = re.sub(cls.PHONE_REGEX, '[PHONE REDACTED]', text)
        return text

    @classmethod
    def detect_blocked_content(cls, text):
        """Check if text contains blocked keywords"""
        text_lower = text.lower()
        for keyword in cls.BLOCKED_KEYWORDS:
            if keyword in text_lower:
                return True
        return False

    @classmethod
    def detect_prompt_injection(cls, text):
        """Detect attempts to override system prompt"""
        text_lower = text.lower()
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, text_lower):
                return True
        return False
