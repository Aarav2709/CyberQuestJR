"""
Privacy Guardian - Protect your personal information like a professional guardian!
AI-powered advanced privacy protection training game.
"""
import random
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class PrivacyGuardianModule:
    def __init__(self):
        self.module_id = "privacy-guardian"
        self.title = "Privacy Guardian"
        self.description = "Protect your personal information like a professional guardian!"
        self.difficulty = "advanced"
        self.duration = "35 mins"
        self.icon = "🔒"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "advanced") -> Dict:
        """Generate AI-powered privacy protection challenges"""
        
        ai_prompt = f"""
        Create an advanced privacy protection challenge for kids and teens (age 8-18).
        Skill level: {player_level}
        
        Generate a comprehensive challenge about digital privacy protection.
        Include:
        1. Advanced privacy settings and configurations
        2. Data protection and encryption concepts
        3. Identity protection strategies
        4. Understanding data collection and tracking
        5. Privacy laws and digital rights
        
        Make it empowering and practical with real-world applications.
        Return as JSON with scenarios, privacy_tools, protection_strategies, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "privacy_protection")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"pg_{random.randint(1000, 9999)}",
            "title": "Privacy Guardian Mission",
            "ai_content": ai_content,
            "game_mechanics": {
                "guardian_level": "Apprentice Guardian",
                "privacy_shield_strength": 100,
                "data_leaks_prevented": 0,
                "privacy_tools": ["vpn", "encrypted_messaging", "privacy_browser", "secure_passwords", "two_factor_auth"],
                "threats_detected": [],
                "guardian_points": 0
            },
            "interactive_elements": {
                "privacy_scanner": True,
                "data_leak_detector": True,
                "permission_manager": True,
                "privacy_policy_analyzer": True
            }
        }
        
        return challenge
    
    def evaluate_privacy_setup(self, privacy_config: Dict) -> Dict:
        """Evaluate user's privacy configuration like a security audit"""
        
        guardian_score = 0
        privacy_strengths = []
        privacy_weaknesses = []
        protection_level = ""
        recommendations = []
        
        # Evaluate different privacy aspects
        aspects = {
            "social_media_privacy": privacy_config.get("social_media", {}),
            "browser_settings": privacy_config.get("browser", {}),
            "app_permissions": privacy_config.get("apps", {}),
            "account_security": privacy_config.get("accounts", {}),
            "data_sharing": privacy_config.get("data_sharing", {})
        }
        
        for aspect_name, settings in aspects.items():
            aspect_score = self._evaluate_privacy_aspect(aspect_name, settings)
            guardian_score += aspect_score["score"]
            
            if aspect_score["score"] >= 80:
                privacy_strengths.append(aspect_score["feedback"])
            else:
                privacy_weaknesses.append(aspect_score["improvement"])
                recommendations.extend(aspect_score["recommendations"])
        
        # Calculate overall protection level
        average_score = guardian_score / len(aspects) if aspects else 0
        
        if average_score >= 90:
            protection_level = "Master Guardian 🏆"
            guardian_title = "Privacy Master"
        elif average_score >= 75:
            protection_level = "Expert Guardian 🛡️"
            guardian_title = "Privacy Expert"
        elif average_score >= 60:
            protection_level = "Guardian in Training 📚"
            guardian_title = "Privacy Learner"
        else:
            protection_level = "Apprentice Guardian 🌱"
            guardian_title = "Privacy Beginner"
        
        return {
            "guardian_score": min(100, guardian_score),
            "protection_level": protection_level,
            "guardian_title": guardian_title,
            "privacy_strengths": privacy_strengths,
            "privacy_weaknesses": privacy_weaknesses,
            "recommendations": recommendations,
            "privacy_grade": self._calculate_privacy_grade(average_score),
            "next_mission": self._get_next_mission(protection_level),
            "guardian_achievements": self._check_guardian_achievements(guardian_score, privacy_strengths)
        }
    
    def _evaluate_privacy_aspect(self, aspect_name: str, settings: Dict) -> Dict:
        """Evaluate a specific privacy aspect"""
        
        evaluations = {
            "social_media_privacy": self._evaluate_social_media_privacy(settings),
            "browser_settings": self._evaluate_browser_privacy(settings),
            "app_permissions": self._evaluate_app_permissions(settings),
            "account_security": self._evaluate_account_security(settings),
            "data_sharing": self._evaluate_data_sharing(settings)
        }
        
        return evaluations.get(aspect_name, {
            "score": 0,
            "feedback": "Unknown privacy aspect",
            "improvement": "Need to configure this aspect",
            "recommendations": ["Set up proper privacy controls"]
        })
    
    def _evaluate_social_media_privacy(self, settings: Dict) -> Dict:
        """Evaluate social media privacy settings"""
        
        score = 0
        recommendations = []
        
        # Check profile visibility
        if settings.get("profile_private", False):
            score += 25
        else:
            recommendations.append("Set profile to private")
        
        # Check post visibility
        if settings.get("posts_friends_only", False):
            score += 20
        else:
            recommendations.append("Limit posts to friends only")
        
        # Check location sharing
        if not settings.get("location_sharing", True):
            score += 20
        else:
            recommendations.append("Turn off location sharing")
        
        # Check tagged photo approval
        if settings.get("tag_approval", False):
            score += 15
        else:
            recommendations.append("Enable tag approval")
        
        # Check search visibility
        if not settings.get("searchable", True):
            score += 20
        else:
            recommendations.append("Disable search visibility")
        
        return {
            "score": score,
            "feedback": "🔒 Social media privacy well configured!" if score >= 80 else "📱 Social media needs privacy improvements",
            "improvement": "Social media privacy needs attention" if score < 80 else None,
            "recommendations": recommendations
        }
    
    def _evaluate_browser_privacy(self, settings: Dict) -> Dict:
        """Evaluate browser privacy settings"""
        
        score = 0
        recommendations = []
        
        if settings.get("private_browsing", False):
            score += 20
        else:
            recommendations.append("Use private/incognito browsing")
        
        if settings.get("block_trackers", False):
            score += 25
        else:
            recommendations.append("Enable tracker blocking")
        
        if settings.get("clear_cookies", False):
            score += 20
        else:
            recommendations.append("Regularly clear cookies")
        
        if settings.get("secure_dns", False):
            score += 20
        else:
            recommendations.append("Use secure DNS")
        
        if settings.get("https_only", False):
            score += 15
        else:
            recommendations.append("Enable HTTPS-only mode")
        
        return {
            "score": score,
            "feedback": "🌐 Browser privacy excellently configured!" if score >= 80 else "🔍 Browser privacy needs improvement",
            "improvement": "Browser privacy settings need updates" if score < 80 else None,
            "recommendations": recommendations
        }
    
    def _evaluate_app_permissions(self, settings: Dict) -> Dict:
        """Evaluate app permission management"""
        
        score = 0
        recommendations = []
        
        if settings.get("location_restricted", False):
            score += 25
        else:
            recommendations.append("Restrict location access for apps")
        
        if settings.get("camera_controlled", False):
            score += 25
        else:
            recommendations.append("Control camera permissions")
        
        if settings.get("microphone_controlled", False):
            score += 25
        else:
            recommendations.append("Control microphone permissions")
        
        if settings.get("contacts_restricted", False):
            score += 25
        else:
            recommendations.append("Restrict contact access")
        
        return {
            "score": score,
            "feedback": "📱 App permissions excellently managed!" if score >= 80 else "⚙️ App permissions need review",
            "improvement": "App permissions need tighter control" if score < 80 else None,
            "recommendations": recommendations
        }
    
    def _evaluate_account_security(self, settings: Dict) -> Dict:
        """Evaluate account security measures"""
        
        score = 0
        recommendations = []
        
        if settings.get("two_factor_auth", False):
            score += 30
        else:
            recommendations.append("Enable two-factor authentication")
        
        if settings.get("strong_passwords", False):
            score += 25
        else:
            recommendations.append("Use strong, unique passwords")
        
        if settings.get("password_manager", False):
            score += 25
        else:
            recommendations.append("Use a password manager")
        
        if settings.get("login_alerts", False):
            score += 20
        else:
            recommendations.append("Enable login alerts")
        
        return {
            "score": score,
            "feedback": "🔐 Account security is fortress-level!" if score >= 80 else "🔓 Account security needs strengthening",
            "improvement": "Account security requires immediate attention" if score < 80 else None,
            "recommendations": recommendations
        }
    
    def _evaluate_data_sharing(self, settings: Dict) -> Dict:
        """Evaluate data sharing practices"""
        
        score = 0
        recommendations = []
        
        if not settings.get("analytics_sharing", True):
            score += 25
        else:
            recommendations.append("Opt out of analytics sharing")
        
        if not settings.get("ad_personalization", True):
            score += 25
        else:
            recommendations.append("Disable ad personalization")
        
        if settings.get("data_download_requested", False):
            score += 25
        else:
            recommendations.append("Request your data from major platforms")
        
        if settings.get("read_privacy_policies", False):
            score += 25
        else:
            recommendations.append("Read privacy policies of services you use")
        
        return {
            "score": score,
            "feedback": "📊 Data sharing excellently controlled!" if score >= 80 else "📈 Data sharing needs more control",
            "improvement": "Data sharing practices need review" if score < 80 else None,
            "recommendations": recommendations
        }
    
    def _calculate_privacy_grade(self, score: float) -> str:
        """Calculate letter grade for privacy protection"""
        
        if score >= 95:
            return "A+ Privacy Master"
        elif score >= 90:
            return "A Privacy Expert"
        elif score >= 85:
            return "A- Privacy Pro"
        elif score >= 80:
            return "B+ Privacy Learner"
        elif score >= 75:
            return "B Privacy Student"
        elif score >= 70:
            return "B- Privacy Beginner"
        else:
            return "C Privacy Apprentice"
    
    def _get_next_mission(self, protection_level: str) -> str:
        """Get next mission based on current level"""
        
        missions = {
            "Master Guardian 🏆": "Train other Privacy Guardians and become a mentor!",
            "Expert Guardian 🛡️": "Advanced threat detection and enterprise privacy!",
            "Guardian in Training 📚": "Master advanced privacy tools and techniques!",
            "Apprentice Guardian 🌱": "Focus on basic privacy fundamentals and build your skills!"
        }
        
        return missions.get(protection_level, "Continue your privacy protection journey!")
    
    def _check_guardian_achievements(self, score: int, strengths: List[str]) -> List[str]:
        """Check which guardian achievements have been unlocked"""
        
        achievements = []
        
        if score >= 400:  # Max score from 5 aspects * 100 each
            achievements.append("🏆 Privacy Master - Perfect protection!")
        
        if len(strengths) >= 4:
            achievements.append("🛡️ Guardian Shield - Excellent across all areas!")
        
        if score >= 300:
            achievements.append("🔐 Security Expert - Advanced protection skills!")
        
        if len(strengths) >= 2:
            achievements.append("📚 Privacy Scholar - Learning effectively!")
        
        if score >= 200:
            achievements.append("🌱 Privacy Warrior - Good foundation!")
        
        return achievements
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "What is a Privacy Guardian? 🔒",
                    "content": "Privacy Guardians are digital protectors who understand that personal information is like treasure that needs to be guarded carefully. You have the right to control your own data and decide who can access your information!"
                },
                {
                    "title": "Guardian Tools & Techniques 🛡️",
                    "content": "🔐 Use strong, unique passwords for everything\n🔒 Enable two-factor authentication\n🌐 Use privacy-focused browsers and search engines\n📱 Review and control app permissions\n🚫 Limit data sharing and tracking\n🔍 Regularly audit your privacy settings\n📊 Understand what data companies collect about you"
                },
                {
                    "title": "Advanced Guardian Skills 🏆",
                    "content": "🛡️ Use VPNs for extra protection\n🔒 Understand encryption and secure messaging\n📜 Read and understand privacy policies\n🎯 Recognize and avoid privacy threats\n👥 Help friends and family protect their privacy\n📚 Stay updated on privacy laws and rights\n🌟 Become a privacy advocate in your community"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Privacy Settings Master", "Data Leak Prevention", "Permission Controller", "Guardian Trainer"],
            "advanced_topics": [
                "Understanding GDPR and privacy rights",
                "Encryption and secure communications",
                "VPNs and anonymous browsing",
                "Data portability and deletion rights",
                "Privacy by design principles"
            ]
        }
