"""
Phishing Detective - Become a detective and spot fake emails and websites!
AI-powered phishing detection training game.
"""
import random
from typing import Dict, List
from ai.challenge_generator import ChallengeGenerator

class PhishingDetectiveModule:
    def __init__(self):
        self.module_id = "phishing-awareness"
        self.title = "Phishing Detective"
        self.description = "Become a detective and spot fake emails and websites before they trick you!"
        self.difficulty = "beginner"
        self.duration = "20 mins"
        self.icon = "🕵️"
        self.ai_generator = ChallengeGenerator()
    
    async def generate_challenge(self, player_level: str = "beginner") -> Dict:
        """Generate AI-powered phishing detection challenges"""
        
        ai_prompt = f"""
        Create a phishing detection game for kids (age 8-18).
        Skill level: {player_level}
        
        Generate a detective-style challenge that teaches phishing recognition.
        Include:
        1. A detective story scenario
        2. Fake emails/websites to analyze
        3. Clues and red flags to identify
        4. Interactive investigation tools
        5. Evidence collection and case solving
        
        Make it like solving a mystery with points for finding clues.
        Return as JSON with scenario, evidence, clues, scoring, and game_elements.
        """
        
        ai_content = await self.ai_generator.generate_challenge(ai_prompt, "phishing_detection")
        
        challenge = {
            "module_id": self.module_id,
            "challenge_id": f"pd_{random.randint(1000, 9999)}",
            "title": "Phishing Detective Case",
            "ai_content": ai_content,
            "game_mechanics": {
                "detective_rank": "Rookie Detective",
                "case_difficulty": player_level,
                "evidence_found": 0,
                "clues_discovered": [],
                "magnifying_glass_power": 100,
                "tools": ["magnifying_glass", "evidence_bag", "analysis_kit", "case_notes"]
            },
            "interactive_elements": {
                "email_inspector": True,
                "url_analyzer": True,
                "sender_verification": True,
                "case_file_builder": True
            }
        }
        
        return challenge
    
    def analyze_email(self, email_data: Dict) -> Dict:
        """Analyze an email for phishing indicators like a detective"""
        
        suspicion_score = 0
        evidence = []
        red_flags = []
        safe_signs = []
        
        sender = email_data.get("sender", "")
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        links = email_data.get("links", [])
        
        # Sender analysis
        suspicious_domains = ["gmaiI.com", "paypaI.com", "amazom.com", "faceboook.com"]
        if any(domain in sender.lower() for domain in suspicious_domains):
            suspicion_score += 30
            evidence.append("🚨 Suspicious sender domain detected!")
            red_flags.append("Fake domain mimicking real company")
        elif sender.endswith((".edu", ".gov", ".org")):
            safe_signs.append("✅ Legitimate domain type")
        
        # Subject analysis
        urgent_keywords = ["urgent", "immediate", "act now", "expire", "suspended", "verify now"]
        if any(keyword in subject.lower() for keyword in urgent_keywords):
            suspicion_score += 25
            evidence.append("⚠️ Urgent language detected in subject!")
            red_flags.append("Creates false sense of urgency")
        
        # Body content analysis
        phishing_indicators = [
            "click here", "verify account", "confirm identity", "update payment",
            "suspended account", "security alert", "prize winner", "free money"
        ]
        
        found_indicators = [indicator for indicator in phishing_indicators if indicator in body.lower()]
        if found_indicators:
            suspicion_score += len(found_indicators) * 15
            evidence.append(f"🎣 Found {len(found_indicators)} phishing phrases!")
            red_flags.extend([f"Uses phrase: '{indicator}'" for indicator in found_indicators])
        
        # Link analysis
        for link in links:
            if self._is_suspicious_link(link):
                suspicion_score += 20
                evidence.append(f"🔗 Suspicious link detected: {link}")
                red_flags.append("Suspicious or shortened URLs")
        
        # Grammar and spelling
        spelling_errors = self._count_spelling_errors(body)
        if spelling_errors > 3:
            suspicion_score += 15
            evidence.append(f"📝 Multiple spelling errors found: {spelling_errors}")
            red_flags.append("Poor grammar and spelling")
        
        # Calculate verdict
        if suspicion_score >= 60:
            verdict = "PHISHING DETECTED!"
            detective_comment = "🕵️ Excellent detective work! This is definitely a phishing attempt."
        elif suspicion_score >= 30:
            verdict = "SUSPICIOUS - INVESTIGATE FURTHER"
            detective_comment = "🤔 Some red flags detected. Be very careful!"
        else:
            verdict = "LIKELY SAFE"
            detective_comment = "👍 Looks legitimate, but always stay vigilant!"
        
        return {
            "suspicion_score": min(100, suspicion_score),
            "verdict": verdict,
            "detective_comment": detective_comment,
            "evidence_collected": evidence,
            "red_flags": red_flags,
            "safe_signs": safe_signs,
            "detective_points": max(0, 100 - suspicion_score) if verdict == "LIKELY SAFE" else suspicion_score,
            "case_solved": True if verdict in ["PHISHING DETECTED!", "LIKELY SAFE"] else False
        }
    
    def _is_suspicious_link(self, link: str) -> bool:
        """Check if a link looks suspicious"""
        suspicious_indicators = [
            "bit.ly", "tinyurl", "t.co",  # URL shorteners
            "secure-bank-update", "paypal-verify", "amazon-security",  # Fake domains
            "http://" if "login" in link or "account" in link else None,  # HTTP for sensitive sites
        ]
        return any(indicator and indicator in link.lower() for indicator in suspicious_indicators)
    
    def _count_spelling_errors(self, text: str) -> int:
        """Simple spelling error detection (mock implementation)"""
        common_errors = ["recieve", "seperate", "occurence", "definately", "neccessary"]
        return sum(1 for error in common_errors if error in text.lower())
    
    def generate_phishing_scenarios(self, difficulty: str) -> List[Dict]:
        """Generate different phishing scenarios based on difficulty"""
        
        scenarios = {
            "beginner": [
                {
                    "type": "fake_bank_email",
                    "sender": "security@bankofamericca.com",
                    "subject": "URGENT: Account Suspended - Verify Now!",
                    "body": "Your account has been suspended due to suspicious activity. Click here to verify your identity immediately or your account will be closed permanently.",
                    "links": ["http://bankverify-security.fake.com/login"],
                    "correct_answer": "phishing"
                }
            ],
            "intermediate": [
                {
                    "type": "social_media_hack",
                    "sender": "security@facebook-security.com",
                    "subject": "Someone tried to log into your account",
                    "body": "We detected an unusual login attempt. If this wasn't you, please verify your account by clicking the link below.",
                    "links": ["https://bit.ly/fb-security-check"],
                    "correct_answer": "phishing"
                }
            ],
            "advanced": [
                {
                    "type": "spear_phishing",
                    "sender": "hr@yourcompany.com",
                    "subject": "Updated Employee Handbook",
                    "body": "Please review the updated employee handbook. Download it from our secure portal using your company credentials.",
                    "links": ["https://company-portal-secure.fake.net/download"],
                    "correct_answer": "phishing"
                }
            ]
        }
        
        return scenarios.get(difficulty, scenarios["beginner"])
    
    def get_learning_content(self) -> Dict:
        """Return educational content for the module"""
        return {
            "sections": [
                {
                    "title": "What is Phishing? 🎣",
                    "content": "Phishing is when cyber criminals pretend to be someone you trust (like your bank or favorite website) to steal your personal information. It's like fishing, but instead of catching fish, they're trying to catch your secrets!"
                },
                {
                    "title": "Detective Tools & Red Flags 🔍",
                    "content": "🚨 URGENT language and threats\n📧 Suspicious sender addresses\n🔗 Strange or shortened links\n📝 Spelling and grammar mistakes\n💰 Offers that seem too good to be true\n🔐 Requests for passwords or personal info"
                },
                {
                    "title": "Detective Action Plan 🕵️‍♂️",
                    "content": "✋ STOP and think before clicking\n🔍 LOOK for red flags and clues\n🤔 ASK yourself: 'Does this make sense?'\n👨‍👩‍👧‍👦 TELL a trusted adult if unsure\n🗑️ DELETE suspicious emails\n📞 VERIFY by contacting the real company directly"
                }
            ],
            "interactive_demo": True,
            "mini_games": ["Email Detective", "Spot the Fake", "Evidence Collector", "Case Solver"]
        }
