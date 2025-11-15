"""
Safe Social Media - Have fun on social media while keeping yourself and your friends safe!
AI-powered social media safety training game.
"""
import random
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class SafeSocialMediaModule:
    def __init__(self):
        self.module_id = "social-media-safety"
        self.title = "Safe Social Media"
        self.description = "Have fun on social media while keeping yourself and your friends safe!"
        self.difficulty = "intermediate"
        self.duration = "30 mins"
        self.icon = "📱"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "intermediate") -> Dict:
        """Generate AI-powered social media safety challenges"""
        
        ai_prompt = f"""
        Create a social media safety challenge for kids and teens (age 8-18).
        Skill level: {player_level}
        
        Generate an interactive challenge about social media safety.
        Include:
        1. Real-world social media scenarios
        2. Privacy settings and friend management
        3. Content sharing decisions
        4. Cyberbullying prevention and response
        5. Recognizing and avoiding online predators
        
        Make it practical with social media simulation games.
        Return as JSON with scenarios, safety_tips, decision_points, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "social_media_safety")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"sm_{random.randint(1000, 9999)}",
            "title": "Social Media Safety Challenge",
            "ai_content": ai_content,
            "game_mechanics": {
                "safety_score": 100,
                "friend_requests": [],
                "posts_to_review": [],
                "safety_tools": ["privacy_settings", "block_user", "report_content", "friend_controls"],
                "reputation_points": 0
            },
            "interactive_elements": {
                "social_media_simulator": True,
                "privacy_settings_trainer": True,
                "scenario_decision_maker": True,
                "safety_advisor": True
            }
        }
        
        return challenge
    
    def evaluate_social_media_decision(self, scenario: Dict, user_choice: str) -> Dict:
        """Evaluate user's decision in a social media scenario"""
        
        scenario_type = scenario.get("type", "")
        risk_level = scenario.get("risk_level", "low")
        correct_action = scenario.get("correct_action", "")
        
        safety_points = 0
        feedback = ""
        consequences = []
        learning_points = []
        
        # Analyze the user's choice
        if user_choice == correct_action:
            safety_points = 20 if risk_level == "high" else 15 if risk_level == "medium" else 10
            feedback = "🌟 Excellent choice! You made the safest decision."
            consequences.append("Your account stays safe and secure")
            learning_points.append("You demonstrated good digital citizenship")
        else:
            safety_points = -10 if risk_level == "high" else -5 if risk_level == "medium" else 0
            feedback = self._get_corrective_feedback(scenario_type, correct_action)
            consequences = self._get_negative_consequences(scenario_type, risk_level)
            learning_points = self._get_learning_opportunities(scenario_type)
        
        return {
            "safety_points": safety_points,
            "feedback": feedback,
            "consequences": consequences,
            "learning_points": learning_points,
            "correct_action": correct_action,
            "explanation": self._get_explanation(scenario_type, correct_action),
            "next_scenario_suggestion": self._suggest_next_scenario(scenario_type, user_choice == correct_action)
        }
    
    def _get_corrective_feedback(self, scenario_type: str, correct_action: str) -> str:
        """Provide helpful feedback for incorrect choices"""
        
        feedback_map = {
            "stranger_friend_request": "🚫 Remember: only accept friend requests from people you know in real life!",
            "personal_info_sharing": "🔒 Keep personal information private - don't share addresses, phone numbers, or school names!",
            "inappropriate_content": "⚠️ Report inappropriate content to help keep everyone safe online!",
            "cyberbullying_response": "🛡️ The best response to cyberbullying is to block, report, and tell a trusted adult!",
            "suspicious_link": "🔗 Never click suspicious links - they could be dangerous!",
            "privacy_settings": "⚙️ Always use the strongest privacy settings to control who sees your information!"
        }
        
        return feedback_map.get(scenario_type, "🤔 Think about the safest choice in this situation!")
    
    def _get_negative_consequences(self, scenario_type: str, risk_level: str) -> List[str]:
        """Get potential consequences of unsafe social media choices"""
        
        consequences = {
            "stranger_friend_request": [
                "Stranger now has access to your personal information",
                "They can see your photos and posts",
                "Risk of contact from unknown person"
            ],
            "personal_info_sharing": [
                "Personal information is now public",
                "Risk of identity theft or stalking",
                "Could affect your safety in real life"
            ],
            "inappropriate_content": [
                "Content continues to harm others",
                "Platform doesn't know about the problem",
                "You might see more inappropriate content"
            ],
            "cyberbullying_response": [
                "Bullying behavior continues",
                "You remain stressed and upset",
                "Other users might also be bullied"
            ]
        }
        
        base_consequences = consequences.get(scenario_type, ["Unsafe online environment"])
        
        if risk_level == "high":
            base_consequences.extend(["Serious safety risks", "Potential real-world consequences"])
        
        return base_consequences
    
    def _get_learning_opportunities(self, scenario_type: str) -> List[str]:
        """Get learning points from the scenario"""
        
        learning_map = {
            "stranger_friend_request": [
                "Learn about verifying real friends online",
                "Understand privacy risks of accepting strangers",
                "Practice saying no to unwanted contact"
            ],
            "personal_info_sharing": [
                "Identify what information should stay private",
                "Learn about digital footprints and permanence",
                "Understand risks of oversharing"
            ],
            "inappropriate_content": [
                "Learn about reporting mechanisms",
                "Understand community standards",
                "Practice being a good digital citizen"
            ],
            "cyberbullying_response": [
                "Learn effective anti-bullying strategies",
                "Understand when to ask for help",
                "Practice emotional resilience online"
            ]
        }
        
        return learning_map.get(scenario_type, ["General social media safety awareness"])
    
    def _get_explanation(self, scenario_type: str, correct_action: str) -> str:
        """Provide detailed explanation of why the correct action is best"""
        
        explanations = {
            "stranger_friend_request": "Only accepting friend requests from people you know in real life protects your privacy and safety. Strangers online might not be who they claim to be.",
            "personal_info_sharing": "Sharing personal information like your address, phone number, or school can put you at risk. Keep this information private to stay safe.",
            "inappropriate_content": "Reporting inappropriate content helps keep social media platforms safe for everyone. It's the responsible thing to do.",
            "cyberbullying_response": "The best way to handle cyberbullying is to not engage with the bully, block them, report the behavior, and tell a trusted adult who can help.",
            "suspicious_link": "Suspicious links might lead to dangerous websites or download malware. It's always safer to avoid clicking them.",
            "privacy_settings": "Strong privacy settings give you control over who can see your information and contact you. This keeps you safer online."
        }
        
        return explanations.get(scenario_type, "This action helps keep you safer on social media.")
    
    def _suggest_next_scenario(self, current_type: str, user_was_correct: bool) -> str:
        """Suggest the next scenario based on performance"""
        
        if user_was_correct:
            return "Ready for a more challenging scenario!"
        else:
            return f"Let's practice more {current_type.replace('_', ' ')} scenarios."
    
    def generate_social_media_scenarios(self, difficulty: str) -> List[Dict]:
        """Generate social media scenarios based on difficulty"""
        
        scenarios = {
            "beginner": [
                {
                    "type": "stranger_friend_request",
                    "description": "You receive a friend request from someone you don't know who says they go to your school.",
                    "options": ["Accept the request", "Ignore the request", "Ask your friends if they know this person first"],
                    "correct_action": "Ignore the request",
                    "risk_level": "medium"
                }
            ],
            "intermediate": [
                {
                    "type": "personal_info_sharing",
                    "description": "A new online friend asks for your home address so they can send you a birthday gift.",
                    "options": ["Give them your address", "Give them a P.O. Box instead", "Decline politely and suggest meeting in person first"],
                    "correct_action": "Decline politely and suggest meeting in person first",
                    "risk_level": "high"
                }
            ],
            "advanced": [
                {
                    "type": "cyberbullying_response",
                    "description": "Someone is posting mean comments about you and sharing embarrassing photos without permission.",
                    "options": ["Post mean comments back", "Block, report, and tell a trusted adult", "Delete your account", "Ignore it completely"],
                    "correct_action": "Block, report, and tell a trusted adult",
                    "risk_level": "high"
                }
            ]
        }
        
        return scenarios.get(difficulty, scenarios["beginner"])
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "Social Media Superpowers! 📱",
                    "content": "Social media can be amazing for connecting with friends and expressing yourself! But with great power comes great responsibility. Learn how to use your social media superpowers safely and positively!"
                },
                {
                    "title": "Safety Shield Activated! 🛡️",
                    "content": "🔒 Use strong privacy settings\n👥 Only add people you know in real life\n🤐 Keep personal information private\n📸 Think before you post photos\n⚠️ Report inappropriate content\n🚫 Block and report bullies\n👨‍👩‍👧‍👦 Tell trusted adults about problems"
                },
                {
                    "title": "Digital Citizenship Hero! 🦸‍♀️",
                    "content": "Be kind and respectful online\n💪 Stand up against cyberbullying\n🌟 Share positive and uplifting content\n🤝 Help friends stay safe too\n📚 Keep learning about digital safety\n⭐ Be the change you want to see online\n🏆 Make the internet a better place for everyone!"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Privacy Settings Master", "Friend Request Detective", "Post Safety Checker", "Bully Blocker"]
        }
