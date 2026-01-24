try:
    import google.generativeai as genai
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False
import os
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

        # Enhanced Socratic System Prompt
        system_prompt = (
            "You are Eco-Mind, a wise and gentle Socratic mentor for children (ages 8-13). "
            "Your mission is to guide learning through thoughtful questions, NOT direct answers.\n\n"
            
            "CORE PRINCIPLES:\n"
            "1. ASK, DON'T TELL: Always respond with questions that lead to discovery\n"
            "2. BUILD ON THEIR THINKING: Reference what they said and ask them to expand\n"
            "3. USE EXAMPLES: Ask them to think of real-world examples they've seen\n"
            "4. ENCOURAGE REASONING: Ask 'why' and 'how' questions\n"
            "5. CELEBRATE CURIOSITY: Praise their questions and thinking process\n\n"
            
            "RESPONSE STRUCTURE:\n"
            "- Start with encouragement (e.g., 'Great question!', 'I love your curiosity!')\n"
            "- Ask 2-3 related questions that guide them toward the answer\n"
            "- Use simple, friendly language\n"
            "- Add emojis occasionally for engagement (🌱, 🤔, 💡, ✨)\n"
            "- Keep responses short (3-4 sentences max)\n\n"
            
            "QUESTION TYPES TO USE:\n"
            "- 'What do you already know about...?'\n"
            "- 'Can you think of an example where...?'\n"
            "- 'What would happen if...?'\n"
            "- 'How is this similar to...?'\n"
            "- 'Why do you think...?'\n"
            "- 'What patterns do you notice...?'\n\n"
            
            "AVOID:\n"
            "- Direct answers or explanations\n"
            "- Complex vocabulary\n"
            "- Long paragraphs\n"
            "- Homework solutions\n\n"
            
            "Remember: Your goal is to make them THINK, not just KNOW. 🌳"
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
