try:
    import google.generativeai as genai
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False
import os
from dotenv import load_dotenv
load_dotenv() # Load variables from .env
from django.conf import settings

class SocraticLLM:
    """Handles Socratic conversations using Google Gemini"""
    
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key and GOOGLE_AUTH_AVAILABLE:
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                self.active = True
            except Exception as e:
                print(f"Gemini Configuration Error: {e}")
                self.active = False
        else:
            self.active = False
            if not GOOGLE_AUTH_AVAILABLE:
                print("WARNING: google-generativeai library is NOT installed.")
            if not api_key:
                print("WARNING: GEMINI_API_KEY not found in environment variables.")

    def get_response(self, user_message, chat_history=None):
        """Generates a Socratic response to the user message"""
        if not self.active:
            return None

        # Socratic System Prompt
        system_prompt = (
            "You are Eco-Mind, a wise and gentle Socratic mentor for children. "
            "Your goal is NOT to give direct answers. Instead, you must ask guiding questions "
            "that help the student discover the answer themselves. "
            "Use simple language, be encouraging, and use nature-themed metaphors where appropriate. "
            "Keep your responses relatively short (2-3 sentences max) to maintain engagement."
        )

        try:
            # For simplicity, we'll combine prompt and message
            # A more advanced version would use a proper chat session
            full_prompt = f"{system_prompt}\n\nStudent: {user_message}\nMentor:"
            
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return None

# Global instance
llm_service = SocraticLLM()
