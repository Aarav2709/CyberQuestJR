"""
Password Heroes - Create super-strong passwords that protect your digital world!
AI-powered interactive password strength training game.
"""
import random
import re
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class PasswordHeroesModule:
    def __init__(self):
        self.module_id = "password-basics"
        self.title = "Password Heroes"
        self.description = "Learn to create super-strong passwords that protect your digital world!"
        self.difficulty = "beginner"
        self.duration = "15 mins"
        self.icon = "🔐"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "beginner") -> Dict:
        """Generate AI-powered password creation challenges"""
        
        ai_prompt = f"""
        Create a fun password security challenge for kids (age 8-18).
        Skill level: {player_level}
        
        Generate an interactive challenge that teaches password creation.
        Include:
        1. A fun scenario (e.g., protecting a secret superhero base)
        2. Password creation requirements that get progressively harder
        3. Interactive feedback and hints
        4. Educational tips about password security
        5. Mini-games or puzzles related to passwords
        
        Make it gamified with points, levels, and achievements.
        Return as JSON with scenario, tasks, hints, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "password_security")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"ph_{random.randint(1000, 9999)}",
            "title": "Password Heroes Challenge",
            "ai_content": ai_content,
            "game_mechanics": {
                "hero_health": 100,
                "enemies": self._get_password_enemies(player_level),
                "power_ups": ["uppercase_shield", "number_sword", "symbol_magic", "length_armor"],
                "achievements": ["First Strong Password", "Pattern Destroyer", "Symbol Master"]
            },
            "interactive_elements": {
                "password_strength_meter": True,
                "real_time_feedback": True,
                "visual_attack_simulation": True,
                "character_creation": True
            }
        }
        
        return challenge
    
    def _get_password_enemies(self, level: str) -> List[Dict]:
        """Different types of password attacks as game enemies"""
        enemies = {
            "beginner": [
                {"name": "Dictionary Demon", "weakness": "complex_words", "strength": 30},
                {"name": "Short Password Goblin", "weakness": "length", "strength": 20}
            ],
            "intermediate": [
                {"name": "Dictionary Demon", "weakness": "complex_words", "strength": 40},
                {"name": "Brute Force Beast", "weakness": "special_chars", "strength": 50},
                {"name": "Pattern Pirate", "weakness": "randomness", "strength": 35}
            ],
            "advanced": [
                {"name": "Rainbow Table Dragon", "weakness": "uniqueness", "strength": 70},
                {"name": "Social Engineering Snake", "weakness": "no_personal_info", "strength": 60},
                {"name": "Credential Stuffing Spider", "weakness": "unique_passwords", "strength": 55}
            ]
        }
        return enemies.get(level, enemies["beginner"])
    
    def evaluate_password(self, password: str) -> Dict:
        """Evaluate password strength with gamified feedback"""
        score = 0
        hero_power = 0
        feedback = []
        defeated_enemies = []
        
        # Length evaluation
        if len(password) >= 12:
            score += 30
            hero_power += 25
            feedback.append("🛡️ Length Armor activated! Great protection!")
            defeated_enemies.append("Short Password Goblin")
        elif len(password) >= 8:
            score += 20
            hero_power += 15
            feedback.append("⚔️ Good length, but longer passwords are stronger!")
        else:
            feedback.append("💥 Short Password Goblin attacks! Make it longer!")
        
        # Character variety
        has_upper = bool(re.search(r'[A-Z]', password))
        has_lower = bool(re.search(r'[a-z]', password))
        has_digit = bool(re.search(r'\d', password))
        has_symbol = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        
        if has_upper:
            score += 15
            hero_power += 10
            feedback.append("🔸 Uppercase Shield deployed!")
        if has_lower:
            score += 10
            hero_power += 8
        if has_digit:
            score += 15
            hero_power += 12
            feedback.append("⚡ Number Sword equipped!")
            defeated_enemies.append("Dictionary Demon")
        if has_symbol:
            score += 20
            hero_power += 15
            feedback.append("✨ Symbol Magic unleashed!")
            defeated_enemies.append("Brute Force Beast")
        
        # Pattern detection
        common_patterns = ["123", "abc", "password", "qwerty", "admin"]
        has_pattern = any(pattern in password.lower() for pattern in common_patterns)
        
        if not has_pattern:
            score += 15
            hero_power += 10
            feedback.append("🎯 Pattern Pirate defeated! No common patterns found!")
            defeated_enemies.append("Pattern Pirate")
        else:
            feedback.append("🏴‍☠️ Pattern Pirate spotted weakness! Avoid common patterns!")
        
        # Calculate final strength
        strength_level = "Hero" if score >= 80 else "Warrior" if score >= 60 else "Trainee"
        
        return {
            "score": max(0, min(100, score)),
            "hero_power": hero_power,
            "strength_level": strength_level,
            "feedback": feedback,
            "defeated_enemies": defeated_enemies,
            "achievements_unlocked": self._check_achievements(score, defeated_enemies),
            "next_challenge": self._get_next_challenge_hint(score)
        }
    
    def _check_achievements(self, score: int, defeated_enemies: List[str]) -> List[str]:
        """Check which achievements player unlocked"""
        achievements = []
        
        if score >= 70:
            achievements.append("First Strong Password")
        if "Pattern Pirate" in defeated_enemies:
            achievements.append("Pattern Destroyer")
        if len(defeated_enemies) >= 3:
            achievements.append("Enemy Vanquisher")
        if score >= 90:
            achievements.append("Password Master")
            
        return achievements
    
    def _get_next_challenge_hint(self, score: int) -> str:
        """Provide hint for next challenge based on performance"""
        if score >= 80:
            return "🌟 Ready for Phishing Detective training!"
        elif score >= 60:
            return "💪 Practice with more complex passwords!"
        else:
            return "🎯 Try adding numbers and symbols to power up!"
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "What are Password Heroes? 🦸‍♂️",
                    "content": "Password Heroes are digital guardians who protect online accounts with super-strong passwords! Just like superheroes have special powers, your passwords have special powers too!"
                },
                {
                    "title": "Building Your Password Fortress 🏰",
                    "content": "Strong passwords are like fortress walls! They need:\n• At least 8-12 characters (longer = stronger)\n• Mix of uppercase and lowercase letters\n• Numbers for extra strength\n• Special symbols for magic power\n• No personal information (that's like giving enemies your secret!)"
                },
                {
                    "title": "Password Superhero Tips 💡",
                    "content": "🔐 Create unique passwords for each account\n🎭 Make up fun sentences and use first letters\n🤐 Never share your password superpowers\n🛡️ Use a password manager as your sidekick\n⚡ Enable two-factor authentication for double protection!"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Password Strength Tester", "Attack Simulator", "Hero Creator"]
        }
