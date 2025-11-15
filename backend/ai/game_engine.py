import os
import json
from typing import Dict, List, Any
import google.generativeai as genai

class GameEngine:
    def __init__(self):
        """Initialize the Google GenAI Game Engine"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found. Using fallback content.")
            self.ai_enabled = False
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
            self.ai_enabled = True
            print("🎮 Google GenAI Game Engine initialized successfully!")

    def generate_challenge(self, challenge_type: str, difficulty: str = "beginner", topic: str = "general") -> Dict[str, Any]:
        """Generate an AI-powered cybersecurity challenge"""
        if not self.ai_enabled:
            return self._get_fallback_challenge(challenge_type, difficulty)

        try:
            prompt = f"""
            Create an interactive cybersecurity challenge for kids aged 8-18.

            Challenge Type: {challenge_type}
            Difficulty: {difficulty}
            Topic: {topic}

            Generate a JSON response with this structure:
            {{
                "id": "unique_challenge_id",
                "type": "{challenge_type}",
                "difficulty": "{difficulty}",
                "title": "Engaging challenge title",
                "description": "What the player needs to do",
                "scenario": "Background story or context",
                "interactive_elements": [
                    {{
                        "type": "multiple_choice|drag_drop|text_input|simulation",
                        "question": "The question or task",
                        "options": ["option1", "option2", "option3"],
                        "correct_answer": "correct option or answer",
                        "explanation": "Why this is correct"
                    }}
                ],
                "learning_objectives": ["what kids will learn"],
                "hints": ["helpful hints if they get stuck"],
                "rewards": {{
                    "points": 100,
                    "badge": "Badge name",
                    "achievement": "What they accomplished"
                }}
            }}

            Make it fun, educational, and age-appropriate!
            """

            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"AI challenge generation failed: {e}")
            return self._get_fallback_challenge(challenge_type, difficulty)

    def generate_story_mode_content(self, level: int, player_progress: Dict) -> Dict[str, Any]:
        """Generate story mode content with AI"""
        if not self.ai_enabled:
            return self._get_fallback_story(level)

        try:
            prompt = f"""
            Create a cybersecurity story mode level for kids.

            Level: {level}
            Player Progress: {json.dumps(player_progress)}

            Generate a JSON response with this structure:
            {{
                "level": {level},
                "story": {{
                    "title": "Chapter title",
                    "narrative": "Engaging story text",
                    "characters": ["character names"],
                    "setting": "Where it takes place"
                }},
                "challenges": [
                    {{
                        "type": "phishing|password|privacy|social_engineering",
                        "title": "Challenge title",
                        "description": "What to do",
                        "difficulty": "easy|medium|hard"
                    }}
                ],
                "learning_goals": ["what they'll learn"],
                "next_unlock": "What gets unlocked next"
            }}

            Make it exciting and educational!
            """

            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"Story generation failed: {e}")
            return self._get_fallback_story(level)

    def _get_fallback_challenge(self, challenge_type: str, difficulty: str) -> Dict[str, Any]:
        """Fallback challenges when AI is not available"""
        fallback_challenges = {
            "phishing": {
                "id": "phishing_basic_001",
                "type": "phishing",
                "difficulty": difficulty,
                "title": "🎣 Spot the Phishing Email!",
                "description": "Look at this email and identify if it's a phishing attempt",
                "scenario": "You received this email in your inbox. Is it safe?",
                "interactive_elements": [
                    {
                        "type": "multiple_choice",
                        "question": "Is this email a phishing attempt?",
                        "options": ["Yes, it's suspicious", "No, it looks legitimate", "I'm not sure"],
                        "correct_answer": "Yes, it's suspicious",
                        "explanation": "This email has several red flags: urgent language, suspicious sender, and asks for personal info."
                    }
                ],
                "learning_objectives": ["Identify phishing emails", "Recognize red flags", "Protect personal information"],
                "hints": ["Check the sender's email address", "Look for urgent language", "Be suspicious of unexpected prizes"],
                "rewards": {
                    "points": 100,
                    "badge": "Email Detective",
                    "achievement": "Spotted your first phishing email!"
                }
            },
            "password": {
                "id": "password_basic_001",
                "type": "password",
                "difficulty": difficulty,
                "title": "🔐 Password Power-Up!",
                "description": "Create a super strong password that hackers can't crack",
                "scenario": "You need to create a new password for your gaming account. Make it unbreakable!",
                "interactive_elements": [
                    {
                        "type": "text_input",
                        "question": "Create a strong password using at least 12 characters with letters, numbers, and symbols:",
                        "options": [],
                        "correct_answer": "any_strong_password",
                        "explanation": "Great job! A strong password uses a mix of characters and is hard to guess."
                    }
                ],
                "learning_objectives": ["Create strong passwords", "Understand password security", "Use different characters"],
                "hints": ["Use at least 12 characters", "Mix letters, numbers, and symbols", "Avoid personal information"],
                "rewards": {
                    "points": 150,
                    "badge": "Password Pro",
                    "achievement": "Created an uncrackable password!"
                }
            }
        }

        return fallback_challenges.get(challenge_type, fallback_challenges["phishing"])

    def _get_fallback_story(self, level: int) -> Dict[str, Any]:
        """Fallback story content when AI is not available"""
        stories = {
            1: {
                "level": 1,
                "story": {
                    "title": "🌟 Welcome to Cyber City!",
                    "narrative": "Welcome, young cyber hero! Cyber City needs your help to stay safe from digital villains. Your first mission: learn to spot dangerous emails!",
                    "characters": ["Cyber Sam (your guide)", "Email Eddie (the villain)"],
                    "setting": "The bustling digital streets of Cyber City"
                },
                "challenges": [
                    {
                        "type": "phishing",
                        "title": "Stop Email Eddie!",
                        "description": "Email Eddie is sending fake emails to trick citizens. Can you spot them?",
                        "difficulty": "easy"
                    }
                ],
                "learning_goals": ["Recognize phishing emails", "Protect personal information", "Be a digital detective"],
                "next_unlock": "Password Plaza (Level 2)"
            }
        }

        return stories.get(level, stories[1])

    def evaluate_player_response(self, challenge_id: str, player_answer: str, correct_answer: str) -> Dict[str, Any]:
        """Evaluate if the player's response is correct"""
        is_correct = player_answer.lower().strip() == correct_answer.lower().strip()

        return {
            "correct": is_correct,
            "feedback": "Great job! That's exactly right!" if is_correct else "Not quite right. Try again!",
            "points_earned": 100 if is_correct else 25,
            "encouragement": "You're becoming a real cyber hero!" if is_correct else "Keep learning, you'll get it next time!"
        }

# Expose a shared AI engine instance for the API layer
try:
    ai_engine = GameEngine()
except Exception as _e:  # Fallback if environment is missing
    ai_engine = None

# Provide a module-level instance for easy imports (used by API controllers)
try:
    ai_engine  # type: ignore[name-defined]
except NameError:
    ai_engine = GameEngine()

# Provide a reusable singleton instance for the rest of the app
try:
    ai_engine = GameEngine()
except Exception:
    # In case initialization raises unexpectedly, fall back to a disabled engine
    ai_engine = GameEngine()
