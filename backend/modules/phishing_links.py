from typing import Dict, List, Any
import random
import re
from urllib.parse import urlparse

class PhishingLinksModule:
    def __init__(self):
        self.module_name = "phishing-links"
        self.title = "🎣 Phishing Links Detective"
        self.description = "Become a master at spotting dangerous links and fake websites!"
        
    def analyze_url_safety(self, url: str) -> Dict[str, Any]:
        """Analyze a URL for phishing indicators"""
        
        safety_score = 100
        warnings = []
        
        # Parse URL
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
        except:
            return {"safe": False, "score": 0, "warnings": ["Invalid URL format"]}
        
        # Check for common phishing indicators
        if any(char in domain for char in ['xn--', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']):
            if domain.count('.') > 3:
                safety_score -= 30
                warnings.append("Too many subdomains - suspicious!")
        
        # Check for URL shorteners (can hide real destination)
        shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly']
        if any(short in domain for short in shorteners):
            safety_score -= 20
            warnings.append("Shortened URL - can't see real destination")
        
        # Check for misspellings of popular sites
        legit_sites = ['google', 'facebook', 'amazon', 'microsoft', 'apple', 'netflix', 'youtube']
        for site in legit_sites:
            if self._is_similar_but_different(domain, site):
                safety_score -= 50
                warnings.append(f"Suspicious spelling - looks like fake {site}")
        
        # Check for suspicious TLDs
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download']
        if any(tld in domain for tld in suspicious_tlds):
            safety_score -= 25
            warnings.append("Suspicious domain extension")
        
        # Check for HTTPS (good sign)
        if parsed.scheme != 'https':
            safety_score -= 15
            warnings.append("Not using secure HTTPS connection")
        
        return {
            "safe": safety_score >= 70,
            "score": max(0, safety_score),
            "warnings": warnings,
            "domain": domain
        }
    
    def _is_similar_but_different(self, domain: str, legitimate: str) -> bool:
        """Check if domain is suspiciously similar to a legitimate site"""
        # Simple similarity check for common phishing techniques
        if legitimate in domain and domain != f"{legitimate}.com":
            return True
        
        # Check for character substitution
        substitutions = {
            'o': '0', 'i': '1', 'e': '3', 'a': '@', 's': '$', 
            'g': '9', 'l': '1', 'm': 'rn', 'w': 'vv'
        }
        
        for orig, fake in substitutions.items():
            if legitimate.replace(orig, fake) in domain:
                return True
        
        return False
    
    def generate_phishing_examples(self, difficulty: str = "beginner") -> List[Dict[str, Any]]:
        """Generate phishing URL examples for training"""
        
        if difficulty == "beginner":
            return [
                {
                    "url": "https://g00gle.com/login",
                    "legitimate": "https://google.com",
                    "issue": "Uses '00' instead of 'oo' in Google",
                    "danger_level": "high"
                },
                {
                    "url": "http://amazon-security.tk/verify",
                    "legitimate": "https://amazon.com",
                    "issue": "Fake subdomain and suspicious .tk extension",
                    "danger_level": "high"
                },
                {
                    "url": "https://paypal-verification.secure-site.com",
                    "legitimate": "https://paypal.com",
                    "issue": "Fake PayPal subdomain on different domain",
                    "danger_level": "medium"
                }
            ]
        elif difficulty == "intermediate":
            return [
                {
                    "url": "https://microsoft-support.office365-help.net",
                    "legitimate": "https://support.microsoft.com",
                    "issue": "Looks official but wrong domain structure",
                    "danger_level": "medium"
                },
                {
                    "url": "https://appleid.apple.com-security.verify.tk",
                    "legitimate": "https://appleid.apple.com",
                    "issue": "Domain continues after legitimate part",
                    "danger_level": "high"
                }
            ]
        else:  # advanced
            return [
                {
                    "url": "https://login.microsoftonline.com.phishing-site.ru",
                    "legitimate": "https://login.microsoftonline.com",
                    "issue": "Legitimate URL used as subdomain of malicious site",
                    "danger_level": "very_high"
                }
            ]
    
    def create_interactive_challenge(self, challenge_type: str = "url_analysis") -> Dict[str, Any]:
        """Create an interactive phishing detection challenge"""
        
        if challenge_type == "url_analysis":
            # Generate a mix of safe and dangerous URLs
            safe_urls = [
                "https://github.com/security",
                "https://support.google.com/accounts",
                "https://www.microsoft.com/security",
                "https://help.netflix.com/contact"
            ]
            
            dangerous_urls = [
                "http://g00gle.com/verify-account",
                "https://microsoft-support.tk/urgent",
                "https://netflix.update-payment.com",
                "https://paypal-security.verify-now.net"
            ]
            
            # Pick one of each
            safe_url = random.choice(safe_urls)
            dangerous_url = random.choice(dangerous_urls)
            
            # Randomly choose which to ask about
            if random.choice([True, False]):
                target_url = safe_url
                correct_answer = "Safe to click"
                explanation = "This URL is from the legitimate website and uses HTTPS!"
            else:
                target_url = dangerous_url
                correct_answer = "Dangerous - don't click"
                explanation = "This URL has phishing indicators like misspelling or suspicious domain!"
            
            return {
                "challenge_type": "url_analysis",
                "title": "🔍 URL Safety Check",
                "description": "Analyze this URL for safety",
                "url_to_analyze": target_url,
                "question": f"Is this URL safe to click?\n\n{target_url}",
                "options": [
                    "Safe to click",
                    "Dangerous - don't click",
                    "Need more information",
                    "Check with an adult first"
                ],
                "correct_answer": correct_answer,
                "explanation": explanation,
                "analysis": self.analyze_url_safety(target_url)
            }
        
        elif challenge_type == "email_phishing":
            phishing_emails = [
                {
                    "sender": "security@paypaI.com",  # Capital I instead of l
                    "subject": "Urgent: Verify your account now!",
                    "issue": "Fake PayPal email with wrong character",
                    "danger_level": "high"
                },
                {
                    "sender": "support@amazon-security.com",
                    "subject": "Your order has been cancelled",
                    "issue": "Amazon doesn't use amazon-security.com domain",
                    "danger_level": "medium"
                }
            ]
            
            email = random.choice(phishing_emails)
            
            return {
                "challenge_type": "email_phishing",
                "title": "📧 Email Detective Challenge",
                "description": "Is this email legitimate?",
                "email_data": email,
                "question": f"You received an email from '{email['sender']}' with subject: '{email['subject']}'. Is this legitimate?",
                "options": [
                    "Yes, it's from the real company",
                    "No, it's a phishing attempt",
                    "Maybe - need to check more",
                    "Forward it to friends to ask"
                ],
                "correct_answer": "No, it's a phishing attempt",
                "explanation": f"Good catch! {email['issue']}. Always verify emails through official channels!"
            }
    
    def get_learning_content(self) -> Dict[str, Any]:
        """Get educational content for the phishing links module"""
        
        return {
            "title": "🎣 Master Phishing Detection",
            "sections": [
                {
                    "title": "What is Phishing? 🤔",
                    "content": "Phishing is when bad actors create fake websites or emails that look real to steal your personal information. They're like digital imposters!"
                },
                {
                    "title": "Spotting Fake URLs 🔍",
                    "content": """Learn to check these red flags:
• Misspelled domain names (g00gle.com vs google.com)
• Suspicious extensions (.tk, .ml, .ga)
• Too many subdomains (fake.site.real-site.com)
• No HTTPS lock icon
• Shortened URLs that hide the real destination"""
                },
                {
                    "title": "Email Red Flags 📧",
                    "content": """Watch out for:
• Urgent threats ("Account will be deleted!")
• Requests for passwords or personal info
• Misspelled sender addresses
• Generic greetings ("Dear Customer")
• Suspicious attachments or links"""
                },
                {
                    "title": "Stay Safe Tips 🛡️",
                    "content": """Protection strategies:
• Always type URLs directly or use bookmarks
• Hover over links to see real destination
• Check sender email addresses carefully
• When in doubt, contact the company directly
• Use official apps instead of email links"""
                }
            ]
        }

# Global module instance
phishing_module = PhishingLinksModule()
