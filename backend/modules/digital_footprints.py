"""
Digital Footprints - Understand what traces you leave online and how to manage them safely!
AI-powered digital footprint awareness and management game.
"""
import random
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class DigitalFootprintsModule:
    def __init__(self):
        self.module_id = "digital-footprints"
        self.title = "Digital Footprints"
        self.description = "Understand what traces you leave online and how to manage them safely!"
        self.difficulty = "intermediate"
        self.duration = "25 mins"
        self.icon = "👣"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "intermediate") -> Dict:
        """Generate AI-powered digital footprint challenges"""
        
        ai_prompt = f"""
        Create a digital footprint awareness challenge for kids (age 8-18).
        Skill level: {player_level}
        
        Generate an interactive challenge about digital footprints and online privacy.
        Include:
        1. A story about leaving digital traces online
        2. Activities to identify different types of digital footprints
        3. Privacy settings and controls
        4. Interactive scenarios showing consequences
        5. Tools for managing digital identity
        
        Make it visual with footprint tracking and cleanup games.
        Return as JSON with scenario, activities, privacy_tips, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "digital_footprints")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"df_{random.randint(1000, 9999)}",
            "title": "Digital Footprint Tracker",
            "ai_content": ai_content,
            "game_mechanics": {
                "footprint_visibility": 100,  # How visible your footprints are
                "privacy_score": 0,
                "digital_traces": [],
                "cleanup_tools": ["privacy_settings", "content_removal", "profile_audit", "search_scrubber"],
                "tracking_level": player_level
            },
            "interactive_elements": {
                "footprint_visualizer": True,
                "privacy_scanner": True,
                "cleanup_simulator": True,
                "impact_predictor": True
            }
        }
        
        return challenge
    
    def analyze_digital_footprint(self, user_activities: List[Dict]) -> Dict:
        """Analyze user's digital activities and their footprint impact"""
        
        footprint_score = 0
        privacy_risks = []
        positive_actions = []
        recommendations = []
        footprint_map = []
        
        for activity in user_activities:
            activity_type = activity.get("type", "")
            content = activity.get("content", "")
            privacy_setting = activity.get("privacy", "public")
            platform = activity.get("platform", "")
            
            # Analyze different types of digital activities
            risk_score = self._calculate_activity_risk(activity_type, content, privacy_setting)
            footprint_score += risk_score
            
            # Track specific footprint elements
            footprint_element = {
                "activity": activity_type,
                "platform": platform,
                "visibility": privacy_setting,
                "risk_level": "high" if risk_score > 15 else "medium" if risk_score > 5 else "low",
                "permanence": self._get_permanence_level(activity_type, platform)
            }
            footprint_map.append(footprint_element)
            
            # Provide specific feedback
            if risk_score > 15:
                privacy_risks.append(f"⚠️ High risk: {activity_type} on {platform} is very visible")
            elif risk_score > 5:
                privacy_risks.append(f"🔶 Medium risk: {activity_type} could affect your reputation")
            else:
                positive_actions.append(f"✅ Good privacy: {activity_type} is well protected")
        
        # Generate recommendations
        recommendations = self._generate_recommendations(footprint_score, privacy_risks)
        
        # Calculate overall privacy grade
        privacy_grade = self._calculate_privacy_grade(footprint_score, len(user_activities))
        
        return {
            "footprint_score": min(100, footprint_score),
            "privacy_grade": privacy_grade,
            "footprint_map": footprint_map,
            "privacy_risks": privacy_risks,
            "positive_actions": positive_actions,
            "recommendations": recommendations,
            "cleanup_urgency": "high" if footprint_score > 60 else "medium" if footprint_score > 30 else "low",
            "digital_wellness_tips": self._get_wellness_tips(privacy_grade)
        }
    
    def _calculate_activity_risk(self, activity_type: str, content: str, privacy_setting: str) -> int:
        """Calculate risk score for a specific digital activity"""
        
        base_risks = {
            "social_media_post": 10,
            "photo_upload": 15,
            "location_check_in": 20,
            "personal_info_share": 25,
            "comment": 8,
            "like": 3,
            "search": 5,
            "online_purchase": 12
        }
        
        risk_score = base_risks.get(activity_type, 5)
        
        # Adjust for privacy settings
        privacy_multipliers = {
            "public": 2.0,
            "friends": 1.2,
            "private": 0.5,
            "custom": 0.8
        }
        
        risk_score *= privacy_multipliers.get(privacy_setting, 1.5)
        
        # Check content for sensitive information
        sensitive_keywords = ["address", "phone", "school", "password", "birthday", "family"]
        if any(keyword in content.lower() for keyword in sensitive_keywords):
            risk_score += 15
        
        return int(risk_score)
    
    def _get_permanence_level(self, activity_type: str, platform: str) -> str:
        """Determine how permanent this digital footprint is"""
        
        high_permanence = ["professional_networks", "news_articles", "court_records", "academic_publications"]
        medium_permanence = ["social_media_posts", "forum_comments", "reviews", "blogs"]
        low_permanence = ["temporary_stories", "private_messages", "search_history"]
        
        if activity_type in high_permanence or "professional" in platform.lower():
            return "permanent"
        elif activity_type in medium_permanence:
            return "long-term"
        else:
            return "temporary"
    
    def _generate_recommendations(self, footprint_score: int, privacy_risks: List[str]) -> List[str]:
        """Generate personalized recommendations for improving digital footprint"""
        
        recommendations = []
        
        if footprint_score > 60:
            recommendations.extend([
                "🔒 Review and tighten privacy settings on all platforms",
                "🗑️ Delete or hide risky posts and photos",
                "👀 Google yourself to see what others can find",
                "📱 Use privacy-focused apps and browsers"
            ])
        elif footprint_score > 30:
            recommendations.extend([
                "⚙️ Check privacy settings on main platforms",
                "🤔 Think before posting personal information",
                "👥 Limit who can see your posts and photos"
            ])
        else:
            recommendations.extend([
                "✅ You're doing great with digital privacy!",
                "📚 Keep learning about new privacy tools",
                "👨‍👩‍👧‍👦 Help friends learn about digital footprints too"
            ])
        
        return recommendations
    
    def _calculate_privacy_grade(self, footprint_score: int, activity_count: int) -> str:
        """Calculate overall privacy grade"""
        
        if activity_count == 0:
            return "Not Enough Data"
        
        average_risk = footprint_score / activity_count
        
        if average_risk <= 5:
            return "A+ Privacy Pro"
        elif average_risk <= 10:
            return "A- Privacy Aware"
        elif average_risk <= 15:
            return "B+ Learning Privacy"
        elif average_risk <= 20:
            return "B- Needs Improvement"
        else:
            return "C Privacy Beginner"
    
    def _get_wellness_tips(self, grade: str) -> List[str]:
        """Get digital wellness tips based on privacy grade"""
        
        tips = {
            "A+ Privacy Pro": [
                "🌟 You're a digital privacy superhero!",
                "📚 Share your knowledge with friends",
                "🔄 Regular privacy checkups keep you safe"
            ],
            "A- Privacy Aware": [
                "👍 Great privacy habits!",
                "🔍 Keep monitoring your digital footprint",
                "📱 Stay updated on new privacy features"
            ],
            "B+ Learning Privacy": [
                "📈 You're improving your privacy skills!",
                "⚙️ Focus on privacy settings",
                "🤔 Think before you post"
            ],
            "B- Needs Improvement": [
                "⚠️ Time to clean up your digital footprint",
                "🔒 Review all your privacy settings",
                "👨‍👩‍👧‍👦 Ask for help from trusted adults"
            ],
            "C Privacy Beginner": [
                "🎯 Start with basic privacy settings",
                "📚 Learn about digital footprints",
                "🛡️ Every small step improves your privacy"
            ]
        }
        
        return tips.get(grade, tips["C Privacy Beginner"])
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "What are Digital Footprints? 👣",
                    "content": "Digital footprints are all the traces you leave behind when you use the internet. Just like walking on sand leaves footprints, everything you do online leaves digital traces that others can follow and find!"
                },
                {
                    "title": "Types of Digital Footprints 🕵️‍♂️",
                    "content": "👣 ACTIVE: Things you post, share, or upload yourself\n👻 PASSIVE: Information collected about you (search history, location, cookies)\n📸 PERMANENT: Things that stay online forever\n⏰ TEMPORARY: Things that disappear after time\n🔍 SEARCHABLE: Information that shows up in search results"
                },
                {
                    "title": "Managing Your Digital Footprint 🛡️",
                    "content": "🔒 Use privacy settings on all platforms\n🤔 Think before you post anything\n🔍 Google yourself regularly\n🗑️ Delete old posts you don't want anymore\n👥 Control who can see your information\n📱 Use private browsing when needed\n⚙️ Review app permissions regularly"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Footprint Tracker", "Privacy Settings Challenge", "Digital Cleanup", "Search Detective"]
        }
