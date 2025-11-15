import json
import os
from typing import Dict, List, Any
import google.generativeai as genai

class ChallengeGenerator:
    def __init__(self):
        """Initialize the Google GenAI client"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        # Configure the GenAI client
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    def generate_phishing_challenge(self, difficulty: str = "beginner") -> Dict[str, Any]:
        """Generate a phishing detection challenge using Google GenAI"""
        try:
            prompt = f"""
            Create a phishing email detection challenge for a {difficulty} level cybersecurity student.

            Generate a JSON response with this exact structure:
            {{
                "challenge_type": "phishing_detection",
                "difficulty": "{difficulty}",
                "email": {{
                    "subject": "Realistic but suspicious email subject",
                    "sender": "Fake sender email address",
                    "body": "Full email body with phishing indicators",
                    "attachments": ["list of suspicious attachments if any"]
                }},
                "red_flags": ["List of 3-5 specific phishing indicators to look for"],
                "explanation": "Why this is a phishing email",
                "learning_points": ["Key cybersecurity lessons from this challenge"]
            }}

            Make it age-appropriate and educational for children aged 8-18.
            """

            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"Error generating phishing challenge: {e}")
            # Return a fallback challenge
            return {
                "challenge_type": "phishing_detection",
                "difficulty": difficulty,
                "email": {
                    "subject": "🎉 You've Won $1000! Click Here Now!",
                    "sender": "winner@totally-real-prizes.com",
                    "body": "Congratulations! You've been randomly selected to win $1000! Click this link immediately to claim your prize before it expires in 24 hours. Don't miss out on this amazing opportunity!",
                    "attachments": ["prize_claim_form.exe"]
                },
                "red_flags": [
                    "Too good to be true offer",
                    "Urgency tactics (24 hour deadline)",
                    "Suspicious email address",
                    "Executable attachment",
                    "Generic greeting"
                ],
                "explanation": "This is a classic scam email designed to trick people into clicking malicious links or downloading harmful files.",
                "learning_points": [
                    "Be skeptical of unexpected prizes or money",
                    "Check the sender's email address carefully",
                    "Never download suspicious attachments",
                    "Legitimate companies don't use urgency tactics"
                ]
            }

    def generate_password_challenge(self, difficulty: str = "beginner") -> Dict[str, Any]:
        """Generate a password strength challenge using Google GenAI"""
        try:
            prompt = f"""
            Create a password strength evaluation challenge for a {difficulty} level cybersecurity student.

            Generate a JSON response with this exact structure:
            {{
                "challenge_type": "password_strength",
                "difficulty": "{difficulty}",
                "passwords": [
                    {{
                        "password": "example password to evaluate",
                        "strength": "weak/medium/strong",
                        "issues": ["list of problems with this password"],
                        "improvements": ["how to make it better"]
                    }}
                ],
                "password_tips": ["5-6 essential password security tips"],
                "learning_points": ["Key lessons about password security"]
            }}

            Include 3-4 different passwords with varying strength levels.
            Make it educational and age-appropriate for children aged 8-18.
            """

            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"Error generating password challenge: {e}")
            # Return a fallback challenge
            return {
                "challenge_type": "password_strength",
                "difficulty": difficulty,
                "passwords": [
                    {
                        "password": "123456",
                        "strength": "weak",
                        "issues": ["Too short", "Only numbers", "Very common"],
                        "improvements": ["Add letters and symbols", "Make it longer", "Use unique combinations"]
                    },
                    {
                        "password": "password123",
                        "strength": "weak",
                        "issues": ["Common word", "Predictable pattern"],
                        "improvements": ["Use random words", "Add special characters", "Make it more unique"]
                    },
                    {
                        "password": "MyDog&Pizza2024!",
                        "strength": "strong",
                        "issues": [],
                        "improvements": ["Already excellent! Keep it private and unique"]
                    }
                ],
                "password_tips": [
                    "Use at least 12 characters",
                    "Mix uppercase, lowercase, numbers, and symbols",
                    "Avoid personal information",
                    "Don't reuse passwords",
                    "Use a password manager",
                    "Enable two-factor authentication"
                ],
                "learning_points": [
                    "Strong passwords are your first line of defense",
                    "Length and complexity both matter",
                    "Each account should have a unique password",
                    "Password managers make security easier"
                ]
            }

    def generate_personalized_course(self, score: Any, skill_level: str, weak_areas: Any = "", strong_areas: Any = "", **kwargs) -> Dict[str, Any]:
        """Generate a personalized cybersecurity course using Google GenAI.
        Accepts weak_areas/strong_areas as str or list, and supports assessment_score kwarg.
        """
        try:
            # Allow alternate arg name
            if score is None:
                score = kwargs.get("assessment_score", 0)
            # Normalize areas to text
            if isinstance(weak_areas, (list, tuple)):
                weak_areas_text = ", ".join(map(str, weak_areas)) or "general cybersecurity concepts"
            else:
                weak_areas_text = weak_areas or "general cybersecurity concepts"
            if isinstance(strong_areas, (list, tuple)):
                strong_areas_text = ", ".join(map(str, strong_areas)) or "none identified yet"
            else:
                strong_areas_text = strong_areas or "none identified yet"
            prompt = f"""
            Create a personalized cybersecurity course for a child aged 8-18 who scored {score}% on an assessment.

            Their skill level is: {skill_level}
            Areas that need improvement: {weak_areas_text}
            Areas they're already good at: {strong_areas_text}

            Create a JSON response with this exact structure:
            {{
                "title": "Engaging course title for kids",
                "description": "Fun description that motivates learning",
                "skill_level": "{skill_level}",
                "modules": [
                    {{
                        "name": "Module name",
                        "description": "What they'll learn in this module",
                        "icon": "Single appropriate emoji",
                        "duration": "Time estimate like '15 mins'",
                        "difficulty": "{skill_level}"
                    }}
                ],
                "estimated_duration": "Total course duration"
            }}

            Requirements:
            - Make it fun and engaging for kids
            - Focus heavily on the weak areas identified
            - Include 4-6 modules that build logically
            - Use encouraging, positive language
            - Include specific cybersecurity topics they need to learn
            - Make module names exciting (like "Password Superhero Training")
            """

            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result

        except Exception as e:
            print(f"Error generating personalized course: {e}")
            # Return a fallback course based on skill level
            fallback_courses = {
                "beginner": {
                    "title": "🌟 Cyber Safety Basics Adventure",
                    "description": "Start your cybersecurity journey with fun, easy-to-understand lessons that will make you a digital safety expert!",
                    "skill_level": "beginner",
                    "modules": [
                        {"name": "Password Superhero Training", "description": "Learn to create unbreakable passwords that protect your digital world", "icon": "🔐", "duration": "15 mins", "difficulty": "beginner"},
                        {"name": "Email Detective Academy", "description": "Become a master at spotting sneaky phishing emails and fake messages", "icon": "🕵️", "duration": "20 mins", "difficulty": "beginner"},
                        {"name": "Social Media Safety Shield", "description": "Stay safe and have fun while socializing online", "icon": "📱", "duration": "18 mins", "difficulty": "beginner"},
                        {"name": "Privacy Guardian Mission", "description": "Protect your personal information like a digital bodyguard", "icon": "🛡️", "duration": "22 mins", "difficulty": "beginner"},
                        {"name": "Smart Sharing Workshop", "description": "Learn what's safe to share and what should stay private", "icon": "🤝", "duration": "16 mins", "difficulty": "beginner"}
                    ],
                    "estimated_duration": "1 hour 30 minutes"
                },
                "intermediate": {
                    "title": "🚀 Cyber Hero Advanced Training",
                    "description": "Level up your skills and become a cybersecurity champion with advanced techniques and real-world scenarios!",
                    "skill_level": "intermediate",
                    "modules": [
                        {"name": "Advanced Threat Detection", "description": "Identify sophisticated cyber attacks before they strike", "icon": "🎯", "duration": "25 mins", "difficulty": "intermediate"},
                        {"name": "Network Security Fortress", "description": "Build impenetrable defenses for your digital networks", "icon": "🏰", "duration": "30 mins", "difficulty": "intermediate"},
                        {"name": "Incident Response Command", "description": "Lead the charge when security breaches occur", "icon": "⚡", "duration": "28 mins", "difficulty": "intermediate"},
                        {"name": "Cryptography Code Master", "description": "Master the art of encryption and secure communications", "icon": "🔐", "duration": "35 mins", "difficulty": "intermediate"},
                        {"name": "Social Engineering Defense", "description": "Protect against manipulation and psychological attacks", "icon": "🧠", "duration": "22 mins", "difficulty": "intermediate"}
                    ],
                    "estimated_duration": "2 hours 20 minutes"
                },
                "advanced": {
                    "title": "🏆 Cybersecurity Master Class",
                    "description": "Become an elite cybersecurity expert with cutting-edge techniques used by professionals worldwide!",
                    "skill_level": "advanced",
                    "modules": [
                        {"name": "Penetration Testing Lab", "description": "Learn ethical hacking techniques to find vulnerabilities", "icon": "🔍", "duration": "40 mins", "difficulty": "advanced"},
                        {"name": "Malware Analysis Workshop", "description": "Dissect and understand how malicious software works", "icon": "🦠", "duration": "45 mins", "difficulty": "advanced"},
                        {"name": "Digital Forensics Investigation", "description": "Uncover digital evidence and solve cyber crimes", "icon": "🔬", "duration": "50 mins", "difficulty": "advanced"},
                        {"name": "Security Architecture Design", "description": "Build enterprise-level security systems from scratch", "icon": "🏗️", "duration": "55 mins", "difficulty": "advanced"},
                        {"name": "Threat Intelligence Operations", "description": "Predict and prevent future cyber attacks", "icon": "🔮", "duration": "35 mins", "difficulty": "advanced"}
                    ],
                    "estimated_duration": "3 hours 45 minutes"
                }
            }

            return fallback_courses.get(skill_level, fallback_courses["beginner"])
