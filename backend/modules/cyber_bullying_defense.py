"""
Cyber Bullying Defense - Know how to handle and report cyberbullying incidents!
AI-powered cyberbullying prevention and response training game.
"""
import random
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class CyberBullyingDefenseModule:
    def __init__(self):
        self.module_id = "cyber-bullying"
        self.title = "Cyber Bullying Defense"
        self.description = "Know how to handle and report cyberbullying incidents!"
        self.difficulty = "advanced"
        self.duration = "20 mins"
        self.icon = "🛡️"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "advanced") -> Dict:
        """Generate AI-powered cyberbullying defense challenges"""
        
        ai_prompt = f"""
        Create a cyberbullying prevention and response challenge for kids and teens (age 8-18).
        Skill level: {player_level}
        
        Generate an empowering challenge about cyberbullying defense.
        Include:
        1. Recognizing different types of cyberbullying
        2. Effective response strategies
        3. Support and reporting mechanisms
        4. Building resilience and confidence
        5. Helping others who are being bullied
        
        Make it supportive and empowering, not scary.
        Return as JSON with scenarios, strategies, support_resources, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "cyberbullying_defense")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"cb_{random.randint(1000, 9999)}",
            "title": "Cyberbullying Defense Training",
            "ai_content": ai_content,
            "game_mechanics": {
                "confidence_level": 50,
                "defense_tools": ["block_bully", "report_behavior", "tell_adult", "support_friend", "document_evidence"],
                "hero_points": 0,
                "situations_handled": 0,
                "resilience_power": 100
            },
            "interactive_elements": {
                "scenario_simulator": True,
                "response_trainer": True,
                "support_network_builder": True,
                "confidence_booster": True
            }
        }
        
        return challenge
    
    def evaluate_bullying_response(self, scenario: Dict, user_actions: List[str]) -> Dict:
        """Evaluate user's response to a cyberbullying scenario"""
        
        scenario_type = scenario.get("type", "")
        severity = scenario.get("severity", "mild")
        best_actions = scenario.get("recommended_actions", [])
        
        hero_points = 0
        confidence_boost = 0
        feedback = []
        action_analysis = {}
        effectiveness_rating = ""
        
        # Analyze each action taken
        for action in user_actions:
            action_score = self._evaluate_single_action(action, scenario_type, severity)
            hero_points += action_score["points"]
            confidence_boost += action_score["confidence"]
            
            action_analysis[action] = {
                "effectiveness": action_score["effectiveness"],
                "explanation": action_score["explanation"],
                "impact": action_score["impact"]
            }
        
        # Check if they used the most effective strategies
        effective_actions_used = [action for action in user_actions if action in best_actions]
        coverage_score = len(effective_actions_used) / len(best_actions) if best_actions else 0
        
        # Generate overall feedback
        if coverage_score >= 0.8:
            effectiveness_rating = "Excellent Defense!"
            feedback.append("🌟 You used highly effective anti-bullying strategies!")
            confidence_boost += 20
        elif coverage_score >= 0.6:
            effectiveness_rating = "Good Response!"
            feedback.append("👍 You handled this well with good strategies!")
            confidence_boost += 15
        elif coverage_score >= 0.4:
            effectiveness_rating = "Needs Improvement"
            feedback.append("📚 You're learning! Try using more support strategies next time.")
            confidence_boost += 10
        else:
            effectiveness_rating = "Keep Learning"
            feedback.append("💪 Don't give up! Everyone learns anti-bullying skills at their own pace.")
            confidence_boost += 5
        
        # Add specific recommendations
        missing_actions = [action for action in best_actions if action not in user_actions]
        if missing_actions:
            feedback.append(f"💡 Consider also: {', '.join(missing_actions)}")
        
        return {
            "hero_points": max(0, hero_points),
            "confidence_boost": confidence_boost,
            "effectiveness_rating": effectiveness_rating,
            "feedback": feedback,
            "action_analysis": action_analysis,
            "missing_strategies": missing_actions,
            "emotional_support": self._get_emotional_support(scenario_type),
            "next_training": self._suggest_next_training(effectiveness_rating)
        }
    
    def _evaluate_single_action(self, action: str, scenario_type: str, severity: str) -> Dict:
        """Evaluate a single action's effectiveness"""
        
        action_effectiveness = {
            "block_bully": {
                "points": 15,
                "confidence": 10,
                "effectiveness": "high",
                "explanation": "Blocking prevents further direct contact and gives you control",
                "impact": "Immediately stops harassment from reaching you"
            },
            "report_behavior": {
                "points": 20,
                "confidence": 15,
                "effectiveness": "high",
                "explanation": "Reporting helps platforms take action and protects others",
                "impact": "May lead to consequences for the bully and platform protection"
            },
            "tell_adult": {
                "points": 25,
                "confidence": 20,
                "effectiveness": "very_high",
                "explanation": "Adults can provide support, guidance, and take appropriate action",
                "impact": "Gets professional help and emotional support"
            },
            "document_evidence": {
                "points": 10,
                "confidence": 5,
                "effectiveness": "medium",
                "explanation": "Evidence helps when reporting and shows the pattern of behavior",
                "impact": "Provides proof for reports and builds a case"
            },
            "ignore_completely": {
                "points": 5,
                "confidence": -5,
                "effectiveness": "low",
                "explanation": "Ignoring doesn't address the problem and may allow it to continue",
                "impact": "Bullying may continue or escalate"
            },
            "fight_back": {
                "points": -10,
                "confidence": -10,
                "effectiveness": "harmful",
                "explanation": "Fighting back can escalate the situation and get you in trouble",
                "impact": "May make bullying worse and create more problems"
            },
            "support_friend": {
                "points": 18,
                "confidence": 12,
                "effectiveness": "high",
                "explanation": "Supporting others shows leadership and helps create a safer environment",
                "impact": "Helps victims feel less alone and discourages bullying"
            }
        }
        
        base_score = action_effectiveness.get(action, {
            "points": 0,
            "confidence": 0,
            "effectiveness": "unknown",
            "explanation": "Action not recognized",
            "impact": "Unclear impact"
        })
        
        # Adjust for severity
        if severity == "severe":
            base_score["points"] = int(base_score["points"] * 1.5)
            base_score["confidence"] = int(base_score["confidence"] * 1.3)
        
        return base_score
    
    def _get_emotional_support(self, scenario_type: str) -> List[str]:
        """Provide emotional support messages based on scenario"""
        
        support_messages = {
            "name_calling": [
                "💪 Remember: The bully's words don't define who you are",
                "🌟 You are valuable and worthy of respect",
                "🤗 It's normal to feel hurt, but you're stronger than you know"
            ],
            "exclusion": [
                "👥 True friends will include and support you",
                "🌈 You belong in spaces where you're appreciated",
                "💝 Your worth isn't determined by others' acceptance"
            ],
            "harassment": [
                "🛡️ You have the right to feel safe online",
                "📞 It's always okay to ask for help",
                "⚡ Taking action shows courage, not weakness"
            ],
            "threats": [
                "🚨 Threats are serious and should always be reported",
                "👨‍👩‍👧‍👦 Tell trusted adults immediately",
                "🔒 You deserve to feel safe and protected"
            ]
        }
        
        return support_messages.get(scenario_type, [
            "💖 You're not alone in this",
            "🌟 Every step you take to stay safe matters",
            "🤝 There are people who want to help and support you"
        ])
    
    def _suggest_next_training(self, effectiveness_rating: str) -> str:
        """Suggest next training based on performance"""
        
        suggestions = {
            "Excellent Defense!": "You're ready to help train others in anti-bullying strategies!",
            "Good Response!": "Practice more complex scenarios to become an anti-bullying expert!",
            "Needs Improvement": "Focus on building your support network and response strategies.",
            "Keep Learning": "Start with basic scenarios and build your confidence step by step."
        }
        
        return suggestions.get(effectiveness_rating, "Keep practicing - you're getting stronger!")
    
    def generate_cyberbullying_scenarios(self, difficulty: str) -> List[Dict]:
        """Generate cyberbullying scenarios based on difficulty"""
        
        scenarios = {
            "beginner": [
                {
                    "type": "name_calling",
                    "description": "Someone keeps posting mean comments about your appearance on your photos.",
                    "severity": "mild",
                    "recommended_actions": ["block_bully", "report_behavior", "tell_adult"],
                    "options": ["Block them", "Report to platform", "Tell a trusted adult", "Post mean comments back", "Ignore completely"]
                }
            ],
            "intermediate": [
                {
                    "type": "exclusion", 
                    "description": "A group of classmates created a group chat and are posting about excluding you from activities.",
                    "severity": "moderate",
                    "recommended_actions": ["document_evidence", "tell_adult", "support_friend"],
                    "options": ["Screenshot evidence", "Tell a teacher or parent", "Support other excluded students", "Try to join anyway", "Start rumors about them"]
                }
            ],
            "advanced": [
                {
                    "type": "threats",
                    "description": "Someone is sending you threatening messages and sharing your personal information online.",
                    "severity": "severe",
                    "recommended_actions": ["document_evidence", "report_behavior", "tell_adult", "block_bully"],
                    "options": ["Save all evidence", "Report to platform and authorities", "Tell parents/teachers immediately", "Block all contact", "Threaten them back"]
                }
            ]
        }
        
        return scenarios.get(difficulty, scenarios["beginner"])
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "What is Cyberbullying? 🤔",
                    "content": "Cyberbullying is when someone uses technology to intentionally hurt, embarrass, or threaten another person repeatedly. It can happen through social media, games, messages, or any digital platform. Remember: it's NEVER okay and it's NEVER your fault!"
                },
                {
                    "title": "Defense Strategies That Work! 🛡️",
                    "content": "🚫 BLOCK the bully to stop direct contact\n📝 DOCUMENT evidence (screenshots, messages)\n📢 REPORT to the platform or website\n👨‍👩‍👧‍👦 TELL a trusted adult immediately\n🤝 SUPPORT friends who are being bullied\n💪 DON'T fight back or engage with the bully\n❤️ TAKE CARE of your emotional well-being"
                },
                {
                    "title": "You Are Not Alone! 🤗",
                    "content": "🌟 You are stronger than you know\n💝 It's not your fault - ever!\n📞 Help is always available\n👥 Friends and family care about you\n🏆 Standing up for yourself takes courage\n🌈 This situation will get better\n💪 You have the power to get through this!"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Scenario Trainer", "Response Strategy Builder", "Confidence Booster", "Support Network Creator"],
            "support_resources": [
                "Crisis Text Line: Text HOME to 741741",
                "StopBullying.gov",
                "National Suicide Prevention Lifeline: 988",
                "Local school counselors and trusted adults"
            ]
        }
