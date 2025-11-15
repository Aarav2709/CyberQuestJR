from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import json
import random
import uuid
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberquest_game.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Pydantic models
class QuizAnswer(BaseModel):
    question_id: str
    answer: str

class QuizSubmission(BaseModel):
    quiz_type: str
    answers: List[QuizAnswer]
    anonymous_name: str

class QuizFeedback(BaseModel):
    title: str
    message: str
    encouragement: str

class QuizResult(BaseModel):
    score: float
    level: str
    feedback: QuizFeedback

class CourseGenerationRequest(BaseModel):
    quiz_type: str
    assessment_result: dict
    answers: List[dict]

# Database models
class QuizProgress(Base):
    __tablename__ = "quiz_progress"
    id = Column(Integer, primary_key=True, index=True)
    anonymous_name = Column(String(50), index=True)
    quiz_type = Column(String(50))
    score = Column(Integer)
    level = Column(String(50))
    completed_at = Column(DateTime, default=datetime.utcnow)

class PersonalizedCourse(Base):
    __tablename__ = "personalized_courses"
    id = Column(Integer, primary_key=True, index=True)
    anonymous_name = Column(String(50), index=True)
    course_content = Column(Text)
    difficulty = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database tables
Base.metadata.create_all(bind=engine)

# Learning modules content
LEARNING_MODULES = {
    "password_security": {
        "title": "Password Heroes 🔒",
        "description": "Learn how to create and maintain strong passwords",
        "levels": ["Beginner", "Intermediate", "Advanced"],
        "content": {
            "Beginner": [
                "Why passwords are important",
                "Basic password rules",
                "Common password mistakes"
            ],
            "Intermediate": [
                "Creating strong passwords",
                "Password managers",
                "Two-factor authentication"
            ],
            "Advanced": [
                "Encryption basics",
                "Advanced password techniques",
                "Security best practices"
            ]
        }
    },
    "phishing": {
        "title": "Phishing Detective 🎣",
        "description": "Learn to spot and avoid phishing attempts",
        "levels": ["Beginner", "Intermediate", "Advanced"],
        "content": {
            "Beginner": [
                "What is phishing?",
                "Common phishing signs",
                "Basic email safety"
            ],
            "Intermediate": [
                "Advanced phishing techniques",
                "Social engineering awareness",
                "Reporting phishing attempts"
            ],
            "Advanced": [
                "Spear phishing",
                "Business email compromise",
                "Anti-phishing tools"
            ]
        }
    },
    "privacy": {
        "title": "Privacy Guardian 🛡️",
        "description": "Protect your personal information online",
        "levels": ["Beginner", "Intermediate", "Advanced"],
        "content": {
            "Beginner": [
                "What is privacy?",
                "Personal information basics",
                "Safe social media use"
            ],
            "Intermediate": [
                "Digital footprint",
                "Privacy settings",
                "Data protection"
            ],
            "Advanced": [
                "Privacy laws",
                "Advanced privacy tools",
                "Identity protection"
            ]
        }
    }
}

# FastAPI app setup
app = FastAPI(title="CyberQuest Jr API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Quiz content
QUIZ_CONTENT = {
    "assessment": {
        "title": "Cybersecurity Assessment 🎯",
        "questions": [
            {
                "id": 1,
                "question": "What's the most important thing to consider when creating a password? 🔑",
                "options": [
                    "Making it easy to remember",
                    "Using complex combinations of characters",
                    "Using your birthday",
                    "Keeping it short"
                ],
                "correct_answer": "Using complex combinations of characters",
                "explanation": "Complex passwords with different types of characters are harder to crack! 🛡️"
            },
            {
                "id": 2,
                "question": "What should you do if you receive a suspicious email? 📧",
                "options": [
                    "Open all attachments",
                    "Click links to check them",
                    "Delete it without opening",
                    "Forward it to friends"
                ],
                "correct_answer": "Delete it without opening",
                "explanation": "When in doubt, it's safest to delete suspicious emails! 🚫"
            },
            {
                "id": 3,
                "question": "What is two-factor authentication? 🔐",
                "options": [
                    "Using two different passwords",
                    "Having two email accounts",
                    "Using a password and another verification method",
                    "Sharing your password with two friends"
                ],
                "correct_answer": "Using a password and another verification method",
                "explanation": "Two factors are better than one for security! 🛡️"
            }
        ]
    },
    "password_security": {
        "title": "Password Heroes Quiz 🔒",
        "questions": [
            {
                "id": 1,
                "question": "What makes a password strong? 💪",
                "options": [
                    "Using your name",
                    "Using 'password123'",
                    "Using a mix of letters, numbers, and symbols",
                    "Using your birth date"
                ],
                "correct_answer": "Using a mix of letters, numbers, and symbols",
                "explanation": "Strong passwords use a mix of different characters to make them harder to guess! 🌟"
            },
            {
                "id": 2,
                "question": "How often should you change your password? 🕒",
                "options": [
                    "Never",
                    "Every few months",
                    "Every day",
                    "Once a year"
                ],
                "correct_answer": "Every few months",
                "explanation": "Changing passwords regularly helps keep your accounts safe! 🔄"
            },
            {
                "id": 3,
                "question": "Is it safe to share your password with friends? 🤔",
                "options": [
                    "Yes, if they're good friends",
                    "Yes, if they promise not to tell",
                    "No, never share passwords",
                    "Only with best friends"
                ],
                "correct_answer": "No, never share passwords",
                "explanation": "Passwords are like toothbrushes - never share them with anyone! 🦷"
            }
        ]
    },
    "phishing": {
        "title": "Phishing Detective Quiz 🎣",
        "questions": [
            {
                "id": 1,
                "question": "What is phishing? 🎣",
                "options": [
                    "A fun fishing game",
                    "Trying to trick people into sharing private information",
                    "A type of fish",
                    "A new social media app"
                ],
                "correct_answer": "Trying to trick people into sharing private information",
                "explanation": "Phishing is when bad guys try to trick you into sharing private info! Stay alert! 🚨"
            },
            {
                "id": 2,
                "question": "What should you do if you receive a suspicious email? 📧",
                "options": [
                    "Click all the links to check them",
                    "Reply with your personal information",
                    "Delete it and don't click any links",
                    "Forward it to all your friends"
                ],
                "correct_answer": "Delete it and don't click any links",
                "explanation": "When in doubt, stay safe and don't click! Report suspicious emails to a trusted adult 🛡️"
            }
        ]
    },
    "privacy": {
        "title": "Privacy Guardian Quiz 🛡️",
        "questions": [
            {
                "id": 1,
                "question": "What information should you keep private online? 🤫",
                "options": [
                    "Your favorite color",
                    "Your home address and phone number",
                    "Your favorite game",
                    "Your opinion about pizza"
                ],
                "correct_answer": "Your home address and phone number",
                "explanation": "Personal information like addresses and phone numbers should stay private! 🏠"
            },
            {
                "id": 2,
                "question": "What should you do before posting photos online? 📸",
                "options": [
                    "Post them immediately",
                    "Ask a parent or guardian first",
                    "Add lots of personal details",
                    "Tag everyone you know"
                ],
                "correct_answer": "Ask a parent or guardian first",
                "explanation": "Always check with a trusted adult before sharing photos online! 👥"
            }
        ]
    }
}

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberquest_game.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    from ai.challenge_generator import ChallengeGenerator
    challenge_gen = ChallengeGenerator()
    GEMINI_ENABLED = True
    print("🎮 Google GenAI enabled for AI-powered gaming experience")
else:
    GEMINI_ENABLED = False
    print("⚠️  GEMINI_API_KEY not found - using fallback gaming content")

app = FastAPI(title="CyberQuest Jr Gaming Platform", description="AI-Powered Gamified Cybersecurity Learning", version="2.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Optional AI engine (Gemini) for challenge generation
try:
    from ai.game_engine import ai_engine
except Exception:
    ai_engine = None

# Database Models for Gaming System
class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    level = Column(Integer, default=1)
    experience_points = Column(Integer, default=0)
    coins = Column(Integer, default=100)
    current_module = Column(String, default="cyber-basics")
    avatar = Column(String, default="🦸")
    created_at = Column(DateTime, default=datetime.utcnow)

class GameSession(Base):
    __tablename__ = "game_sessions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    player_id = Column(Integer)
    module_name = Column(String)
    current_challenge = Column(Integer, default=0)
    score = Column(Integer, default=0)
    lives = Column(Integer, default=3)
    power_ups = Column(Text)  # JSON string
    session_data = Column(Text)  # JSON string for game state
    is_active = Column(Boolean, default=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer)
    achievement_type = Column(String)
    title = Column(String)
    description = Column(String)
    icon = Column(String)
    earned_at = Column(DateTime, default=datetime.utcnow)

class AIChallenge(Base):
    __tablename__ = "ai_challenges"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(String, unique=True, index=True)
    module_name = Column(String)
    difficulty = Column(String)
    challenge_data = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for Gaming API
class PlayerCreate(BaseModel):
    username: str
    avatar: Optional[str] = "🦸"

class PlayerResponse(BaseModel):
    id: int
    username: str
    level: int
    experience_points: int
    coins: int
    current_module: str
    avatar: str

class GameSessionCreate(BaseModel):
    player_id: int
    module_name: str

class GameSessionResponse(BaseModel):
    session_id: str
    current_challenge: int
    score: int
    lives: int
    power_ups: Dict[str, Any]
    is_active: bool

class ChallengeAnswer(BaseModel):
    session_id: str
    answer: str
    time_taken: Optional[float] = None

class ChallengeResult(BaseModel):
    correct: bool
    points_earned: int
    new_score: int
    lives_remaining: int
    feedback: str
    next_challenge: Optional[Dict[str, Any]] = None
    game_completed: bool = False

class GameModule(BaseModel):
    name: str
    title: str
    description: str
    icon: str
    difficulty: str
    estimated_time: str
    required_level: int
    unlock_cost: int

# Gaming Modules Configuration
GAME_MODULES = {
    "cyber-basics": {
        "name": "cyber-basics",
        "title": "🌟 Cyber Safety Adventure",
        "description": "Start your journey as a cyber hero! Learn the basics while having fun with interactive challenges.",
        "icon": "🛡️",
        "difficulty": "beginner",
        "estimated_time": "20-30 minutes",
        "required_level": 1,
        "unlock_cost": 0,
        "challenges": 5,
        "topics": ["passwords", "email_safety", "safe_browsing", "personal_info", "cyber_bullying"]
    },
    "password-defender": {
        "name": "password-defender",
        "title": "🔐 Password Defender Challenge",
        "description": "Become a password superhero! Create unbreakable passwords and defend against cyber villains.",
        "icon": "🔐",
        "difficulty": "beginner",
        "estimated_time": "15-25 minutes",
        "required_level": 2,
        "unlock_cost": 50,
        "challenges": 4,
        "topics": ["password_strength", "password_managers", "two_factor_auth", "password_attacks"]
    },
    "phishing-detective": {
        "name": "phishing-detective",
        "title": "🕵️ Phishing Detective Mission",
        "description": "Put on your detective hat! Hunt down sneaky phishing attempts and save the digital world.",
        "icon": "🕵️",
        "difficulty": "intermediate",
        "estimated_time": "25-35 minutes",
        "required_level": 3,
        "unlock_cost": 100,
        "challenges": 6,
        "topics": ["email_phishing", "website_spoofing", "social_engineering", "fake_apps", "scam_detection", "reporting"]
    },
    "social-guardian": {
        "name": "social-guardian",
        "title": "👥 Social Media Guardian",
        "description": "Master the art of safe social media! Protect yourself and others from online dangers.",
        "icon": "👥",
        "difficulty": "intermediate",
        "estimated_time": "30-40 minutes",
        "required_level": 4,
        "unlock_cost": 150,
        "challenges": 7,
        "topics": ["privacy_settings", "cyberbullying", "fake_profiles", "oversharing", "digital_footprint", "online_friends", "content_sharing"]
    },
    "crypto-master": {
        "name": "crypto-master",
        "title": "🔬 Cryptography Master Quest",
        "description": "Unlock the secrets of encryption! Become a master of digital security codes and ciphers.",
        "icon": "🔬",
        "difficulty": "advanced",
        "estimated_time": "45-60 minutes",
        "required_level": 6,
        "unlock_cost": 250,
        "challenges": 8,
        "topics": ["basic_encryption", "public_key", "digital_signatures", "blockchain", "secure_communication", "cryptanalysis", "quantum_crypto", "practical_crypto"]
    }
}

# Power-ups and Game Elements
POWER_UPS = {
    "hint_potion": {"name": "🧪 Hint Potion", "cost": 10, "description": "Get a helpful hint for the current challenge"},
    "shield_armor": {"name": "🛡️ Shield Armor", "cost": 25, "description": "Protect yourself from losing a life on wrong answer"},
    "time_freeze": {"name": "❄️ Time Freeze", "cost": 15, "description": "Get extra time for timed challenges"},
    "double_coins": {"name": "💰 Double Coins", "cost": 30, "description": "Double coins earned for the next 3 challenges"},
    "life_restore": {"name": "❤️ Life Restore", "cost": 20, "description": "Restore one lost life"},
    "skip_challenge": {"name": "⚡ Skip Challenge", "cost": 40, "description": "Skip a difficult challenge without penalty"}
}

ACHIEVEMENTS = {
    "first_steps": {"title": "First Steps", "description": "Complete your first challenge", "icon": "👶", "xp_reward": 50},
    "password_pro": {"title": "Password Pro", "description": "Complete Password Defender module", "icon": "🔐", "xp_reward": 200},
    "detective_badge": {"title": "Detective Badge", "description": "Complete Phishing Detective module", "icon": "🕵️", "xp_reward": 300},
    "social_guardian": {"title": "Social Guardian", "description": "Complete Social Guardian module", "icon": "👥", "xp_reward": 400},
    "crypto_master": {"title": "Crypto Master", "description": "Complete Cryptography Master module", "icon": "🔬", "xp_reward": 500},
    "perfect_score": {"title": "Perfect Score", "description": "Complete a module without losing any lives", "icon": "⭐", "xp_reward": 150},
    "speed_demon": {"title": "Speed Demon", "description": "Complete 5 challenges in under 30 seconds each", "icon": "⚡", "xp_reward": 100},
    "coin_collector": {"title": "Coin Collector", "description": "Collect 1000 coins", "icon": "💰", "xp_reward": 75},
    "level_master": {"title": "Level Master", "description": "Reach level 10", "icon": "🏆", "xp_reward": 250}
}

@app.get("/api/quiz/generate/{quiz_type}")
async def generate_quiz(quiz_type: str):
    """Generate a cybersecurity quiz - no authentication needed!"""

    if quiz_type not in QUIZ_CONTENT:
        raise HTTPException(status_code=404, detail="Quiz type not found.")

    return QUIZ_CONTENT[quiz_type]
    FALLBACK_QUIZZES = {
        "password_security": {
            "title": "Password Heroes Quiz 🔒",
            "questions": [
                {
                    "id": 1,
                    "question": "What makes a password strong? 💪",
                    "options": [
                        "Using your name",
                        "Using 'password123'",
                        "Using a mix of letters, numbers, and symbols",
                        "Using your birth date"
                    ],
                    "correct_answer": "Using a mix of letters, numbers, and symbols",
                    "explanation": "Strong passwords use a mix of different characters to make them harder to guess! 🌟"
                },
                {
                    "id": 2,
                    "question": "How often should you change your password? 🕒",
                    "options": [
                        "Never",
                        "Every few months",
                        "Every day",
                        "Once a year"
                    ],
                    "correct_answer": "Every few months",
                    "explanation": "Changing passwords regularly helps keep your accounts safe! 🔄"
                },
                {
                    "id": 3,
                    "question": "Is it safe to share your password with friends? 🤔",
                    "options": [
                        "Yes, if they're good friends",
                        "Yes, if they promise not to tell",
                        "No, never share passwords",
                        "Only with best friends"
                    ],
                    "correct_answer": "No, never share passwords",
                    "explanation": "Passwords are like toothbrushes - never share them with anyone! 🦷"
                }
            ]
        },
        "phishing": {
            "title": "Phishing Detective Quiz 🎣",
            "questions": [
                {
                    "id": 1,
                    "question": "What is phishing? 🎣",
                    "options": [
                        "A fun fishing game",
                        "Trying to trick people into sharing private information",
                        "A type of fish",
                        "A new social media app"
                    ],
                    "correct_answer": "Trying to trick people into sharing private information",
                    "explanation": "Phishing is when bad guys try to trick you into sharing private info! Stay alert! 🚨"
                }
            ]
        }
    }

    return FALLBACK_QUIZZES.get(quiz_type, {
        "title": "General Cybersecurity Quiz 🔒",
        "questions": [
            {
                "id": 1,
                "question": "What's the best way to stay safe online? 🤔",
                "options": [
                    "Share everything with everyone",
                    "Never use the internet",
                    "Be careful and think before clicking",
                    "Click on every link you see"
                ],
                "correct_answer": "Be careful and think before clicking",
                "explanation": "Being careful and thinking before clicking helps keep you safe online! 🛡️"
            }
        ]
    })

@app.post("/api/quiz/submit")
async def submit_quiz(request: Request, db: Session = Depends(get_db)):
    """Submit quiz answers and get results - no authentication needed!"""

    # Get raw request data for debugging
    try:
        raw_data = await request.json()
        print(f"🔍 Raw request data: {raw_data}")
        print(f"🔍 Data type: {type(raw_data)}")

        # Validate the data manually first
        if not isinstance(raw_data, dict):
            print("❌ Not a dictionary")
            raise HTTPException(status_code=422, detail="Request data must be a JSON object")

        # Fix the data format if needed
        if 'answers' in raw_data:
            fixed_answers = []
            for i, answer in enumerate(raw_data['answers']):
                if isinstance(answer, dict):
                    # Create the correct format
                    fixed_answer = {
                        'question_id': str(answer.get('question_id', f'q{i+1}')),
                        'answer': answer.get('answer', '')
                    }
                    fixed_answers.append(fixed_answer)
                    print(f"✅ Fixed answer {i}: {fixed_answer}")
            raw_data['answers'] = fixed_answers

        # Add anonymous_name if missing
        if 'anonymous_name' not in raw_data:
            raw_data['anonymous_name'] = f"CyberHero{hash(str(raw_data['answers'])) % 1000}"
            print(f"✅ Added anonymous_name: {raw_data['anonymous_name']}")

        # Now try to create the pydantic model
        submission = QuizSubmission(**raw_data)
        print(f"✅ Pydantic validation successful: {submission}")

    except Exception as e:
        print(f"🚨 Error processing request: {e}")
        print(f"🚨 Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=422, detail=f"Invalid request format: {str(e)}")

    print(f"Received submission: {submission}")  # Debug log

    total_questions = len(submission.answers)
    if total_questions == 0:
        raise HTTPException(status_code=400, detail="No answers provided")

    correct_answers = 0

    # Get the quiz questions to verify answers
    if submission.quiz_type in QUIZ_CONTENT:
        quiz_questions = QUIZ_CONTENT[submission.quiz_type]["questions"]

        for answer in submission.answers:
            question_id = int(answer.question_id)  # Convert string to int
            user_answer = answer.answer

            # Find the corresponding question
            question = next((q for q in quiz_questions if q["id"] == question_id), None)
            if question:
                # Check if the answer is correct by comparing the full text
                if user_answer == question["correct_answer"]:
                    correct_answers += 1
                    print(f"Question {question_id}: CORRECT")
                else:
                    print(f"Question {question_id}: WRONG - Expected: '{question['correct_answer']}', Got: '{user_answer}'")
            else:
                print(f"Question {question_id}: NOT FOUND in quiz questions")
    else:
        # Fallback: assume all answers are correct if quiz type not found
        correct_answers = len(submission.answers)

    score = (correct_answers / total_questions) * 100
    print(f"Final score: {score}% ({correct_answers}/{total_questions})")

    # Normalize level into skill tiers expected by the frontend
    if score >= 80:
        level = "advanced"
        feedback_obj = {
            "title": "Cybersecurity Expert! 🏆",
            "message": "Amazing work! You're a cybersecurity superstar!",
            "encouragement": "You're ready for advanced challenges! 🚀",
        }
    elif score >= 60:
        level = "intermediate"
        feedback_obj = {
            "title": "Cyber Defender! 🛡️",
            "message": "Well done! You have solid cybersecurity foundations!",
            "encouragement": "Let's build on your strong knowledge! 💪",
        }
    else:
        level = "beginner"
        feedback_obj = {
            "title": "Future Cyber Hero! 🌟",
            "message": "Great start! You're beginning your cybersecurity journey!",
            "encouragement": "Every expert was once a beginner! 🎯",
        }

    # Save progress to database
    progress = QuizProgress(
        anonymous_name=submission.anonymous_name,
        quiz_type=submission.quiz_type,
        score=int(score),
        level=level,
    )
    db.add(progress)

    db.commit()

    return QuizResult(score=score, level=level, feedback=QuizFeedback(**feedback_obj))

@app.post("/api/course/generate")
async def generate_personalized_course(request: CourseGenerationRequest, db: Session = Depends(get_db)):
    """Generate a personalized course based on assessment results"""

    assessment_result = request.assessment_result
    score = assessment_result.get("score", 0)
    level = assessment_result.get("level", "beginner")

    # Determine skill level
    if score >= 80:
        skill_level = "advanced"
    elif score >= 60:
        skill_level = "intermediate"
    else:
        skill_level = "beginner"

    print(f"Generating course for skill level: {skill_level}, score: {score}%")

    # Use AI to generate personalized course if available
    if GEMINI_ENABLED:
        try:
            # Analyze wrong answers to identify weak areas
            weak_areas = []
            correct_areas = []

            if request.quiz_type == "assessment" and QUIZ_CONTENT.get("assessment"):
                quiz_questions = QUIZ_CONTENT["assessment"]["questions"]

                for answer in request.answers:
                    question_id = answer.get("question_id")
                    user_answer = answer.get("answer")
                    is_correct = answer.get("is_correct", False)

                    # Find the corresponding question
                    question = next((q for q in quiz_questions if q["id"] == question_id), None)
                    if question:
                        question_text = question["question"].lower()

                        # Categorize the question topic
                        if "password" in question_text:
                            topic = "password_security"
                        elif "phishing" in question_text or "email" in question_text:
                            topic = "phishing_detection"
                        elif "social" in question_text or "friend" in question_text:
                            topic = "social_engineering"
                        elif "privacy" in question_text or "information" in question_text:
                            topic = "privacy_protection"
                        elif "wi-fi" in question_text or "network" in question_text:
                            topic = "network_security"
                        else:
                            topic = "general_cybersecurity"

                        if is_correct:
                            correct_areas.append(topic)
                        else:
                            weak_areas.append(topic)

            # Remove duplicates while preserving order
            weak_areas = list(dict.fromkeys(weak_areas))
            correct_areas = list(dict.fromkeys(correct_areas))

            weak_areas_text = ", ".join(weak_areas) if weak_areas else "general cybersecurity concepts"
            strong_areas_text = ", ".join(correct_areas) if correct_areas else "none identified yet"

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

            # Generate course using Google GenAI
            course_data = challenge_gen.generate_personalized_course(score, skill_level, weak_areas_text, strong_areas_text)
            print(f"AI generated course content: {course_data}")

            # Save to database
            personalized_course = PersonalizedCourse(
                anonymous_name=f"CyberHero{random.randint(100,999)}",
                course_content=json.dumps(course_data),
                difficulty=skill_level,
            )
            db.add(personalized_course)
            db.commit()

            print(f"Successfully generated AI course: {course_data['title']}")
            return course_data

        except Exception as e:
            print(f"AI course generation failed: {e}")
            # Continue to fallback

    # Enhanced fallback course generation based on wrong answers
    print("Using fallback course generation")

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
                {"name": "Advanced Password Mastery", "description": "Two-factor authentication, password managers, and biometric security", "icon": "🔒", "duration": "25 mins", "difficulty": "intermediate"},
                {"name": "Network Security Scout", "description": "Understanding Wi-Fi security, VPNs, and safe browsing", "icon": "📡", "duration": "30 mins", "difficulty": "intermediate"},
                {"name": "Digital Footprint Manager", "description": "Control and monitor your online presence across platforms", "icon": "👣", "duration": "28 mins", "difficulty": "intermediate"},
                {"name": "Advanced Threat Detection", "description": "Identify malware, ransomware, and sophisticated cyber threats", "icon": "🎯", "duration": "35 mins", "difficulty": "intermediate"},
                {"name": "Incident Response Hero", "description": "What to do when cybersecurity problems happen", "icon": "🚨", "duration": "25 mins", "difficulty": "intermediate"}
            ],
            "estimated_duration": "2 hours 20 minutes"
        },
        "advanced": {
            "title": "🏆 Cybersecurity Expert Mastery Path",
            "description": "Master advanced concepts and become a cybersecurity leader who can protect others and share knowledge!",
            "skill_level": "advanced",
            "modules": [
                {"name": "Cryptography & Encryption", "description": "Understanding how data is protected with advanced encryption", "icon": "🔐", "duration": "40 mins", "difficulty": "advanced"},
                {"name": "Ethical Hacking Fundamentals", "description": "Think like a white-hat hacker to find and fix vulnerabilities", "icon": "⚡", "duration": "45 mins", "difficulty": "advanced"},
                {"name": "Security Architecture", "description": "Design secure systems and understand enterprise security", "icon": "🏗️", "duration": "38 mins", "difficulty": "advanced"},
                {"name": "Digital Forensics Basics", "description": "Investigate digital crimes and understand evidence collection", "icon": "🔍", "duration": "42 mins", "difficulty": "advanced"},
                {"name": "Cybersecurity Leadership", "description": "Teach others and lead cybersecurity initiatives in your community", "icon": "👑", "duration": "30 mins", "difficulty": "advanced"}
            ],
            "estimated_duration": "3 hours 15 minutes"
        }
    }

    course_data = fallback_courses.get(skill_level, fallback_courses["beginner"])

    # Save to database (simplified - only store essential data)
    personalized_course = PersonalizedCourse(
        anonymous_name=f"CyberHero{random.randint(100, 999)}",
        course_content=json.dumps(course_data),
        difficulty=skill_level,
    )
    db.add(personalized_course)
    db.commit()

    print(f"Generated fallback course: {course_data['title']}")
    return course_data

@app.get("/api/modules/{module_name}")
async def get_module(module_name: str):
    """Get learning module content - no authentication needed!"""

    if module_name not in LEARNING_MODULES:
        raise HTTPException(status_code=404, detail="Module not found.")

    return LEARNING_MODULES[module_name]

# Game endpoints
@app.post("/api/game/start")
async def start_game_session(request: Request, db: Session = Depends(get_db)):
    """Start a new game session"""
    try:
        data = await request.json()

        # Create a simple game session response
        session_id = str(uuid.uuid4())

        return {
            "session_id": session_id,
            "module_name": data.get("module_name", ""),
            "current_challenge": 1,
            "score": 0,
            "lives": 3,
            "power_ups": {},
            "message": f"Welcome to the {data.get('module_name', 'Game')} module! 🎮"
        }
    except Exception as e:
        print(f"Error starting game session: {e}")
        raise HTTPException(status_code=500, detail="Failed to start game session")

@app.get("/api/game/{session_id}/challenge")
async def get_game_challenge(session_id: str):
    """Get the current challenge for a game session"""
    # Simple mock challenge for now
    challenges = [
        {
            "id": 1,
            "type": "multiple_choice",
            "question": "Which of these passwords is the strongest?",
            "options": ["password123", "MyDog'sName!", "P@ssw0rd2024!", "qwerty"],
            "correct_answer": "P@ssw0rd2024!",
            "explanation": "This password uses uppercase, lowercase, numbers, and special characters!"
        },
        {
            "id": 2,
            "type": "multiple_choice",
            "question": "What should you do if you receive a suspicious email?",
            "options": ["Click all links", "Delete immediately", "Reply with personal info", "Forward to friends"],
            "correct_answer": "Delete immediately",
            "explanation": "Always delete suspicious emails to stay safe!"
        }
    ]

    challenge = random.choice(challenges)
    return {
        "challenge": challenge,
        "session_id": session_id,
        "challenge_number": random.randint(1, 5)
    }

@app.post("/api/game/answer")
async def submit_game_answer(request: Request):
    """Submit an answer to a game challenge"""
    try:
        data = await request.json()

        # Simple scoring logic
        is_correct = data.get("answer") == data.get("correct_answer")
        score = 10 if is_correct else 0

        return {
            "correct": is_correct,
            "score": score,
            "message": "Correct! Well done!" if is_correct else "Not quite right, try again!",
            "explanation": data.get("explanation", "")
        }
    except Exception as e:
        print(f"Error submitting answer: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit answer")

@app.post("/api/challenges/generate")
async def generate_challenge(request: Request):
    """Generate a new challenge for a specific module"""
    try:
        data = await request.json()
        module_name = data.get("module_name", "general")
        difficulty = data.get("difficulty", "beginner")

        # Define challenges by module and difficulty
        challenges = {
            "password-basics": {
                "beginner": [
                    {
                        "id": 1,
                        "type": "multiple_choice",
                        "question": "What makes a password strong? 🔐",
                        "options": ["It's easy to remember", "It uses uppercase, lowercase, numbers, and symbols", "It's your birthday", "It's short"],
                        "correct_answer": "It uses uppercase, lowercase, numbers, and symbols",
                        "explanation": "Strong passwords combine different character types to make them harder to guess! 💪"
                    },
                    {
                        "id": 2,
                        "type": "multiple_choice",
                        "question": "Which password is the strongest? 🛡️",
                        "options": ["password123", "MyBirthday2024", "Tr@il$9$aFe!", "qwerty"],
                        "correct_answer": "Tr@il$9$aFe!",
                        "explanation": "This password has uppercase, lowercase, numbers, and special characters - making it super strong! 🚀"
                    }
                ]
            },
            "phishing-awareness": {
                "beginner": [
                    {
                        "id": 1,
                        "type": "multiple_choice",
                        "question": "You receive an email saying 'URGENT: Click here to verify your account!' What should you do? 📧",
                        "options": ["Click the link immediately", "Delete the email", "Reply with your password", "Forward it to friends"],
                        "correct_answer": "Delete the email",
                        "explanation": "Legitimate companies never ask for passwords via email. When in doubt, delete! 🗑️"
                    },
                    {
                        "id": 2,
                        "type": "multiple_choice",
                        "question": "What's a red flag in emails that might be phishing? 🚩",
                        "options": ["Proper spelling", "Your real name", "Urgent threats or prizes", "Company logo"],
                        "correct_answer": "Urgent threats or prizes",
                        "explanation": "Phishing emails often create fake urgency or offer prizes to trick you! 🎣"
                    }
                ]
            }
        }

        # Get challenges for the module, default to password-basics if not found
        module_challenges = challenges.get(module_name, challenges["password-basics"])
        difficulty_challenges = module_challenges.get(difficulty, module_challenges["beginner"])

        # Select a random challenge
        challenge = random.choice(difficulty_challenges)

        return {
            "challenge": challenge,
            "module_name": module_name,
            "difficulty": difficulty,
            "total_challenges": len(difficulty_challenges)
        }

    except Exception as e:
        print(f"Error generating challenge: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate challenge")

@app.get("/api/progress")
async def get_progress():
    """Get general progress stats - no authentication needed!"""

    return {
        "available_modules": len(LEARNING_MODULES),
        "available_quizzes": len(QUIZ_CONTENT),
        "message": "Start learning anytime - no account needed! 🎉"
    }

# --- AI-powered challenge endpoints ---
@app.post("/api/ai/challenges/generate")
async def ai_generate_challenge(request: Request):
    """Generate an AI-powered interactive challenge (uses Gemini if configured)."""
    try:
        data = await request.json()
        challenge_type = data.get("challenge_type", "phishing")
        difficulty = data.get("difficulty", "beginner")
        topic = data.get("topic", "general")

        if ai_engine is None:
            # Fallback using static generator in this app
            return {
                "ai": False,
                "challenge": {
                    "id": f"fallback_{challenge_type}_{difficulty}",
                    "type": challenge_type,
                    "difficulty": difficulty,
                    "title": "Practice Challenge",
                    "description": "AI is not enabled. Here's a practice question!",
                    "interactive_elements": [
                        {
                            "type": "multiple_choice",
                            "question": "Is 'P@ssw0rd!' a strong password?",
                            "options": ["Yes", "No"],
                            "correct_answer": "Yes",
                            "explanation": "It mixes letters, numbers and a symbol."
                        }
                    ],
                    "learning_objectives": ["Password strength"],
                    "hints": ["Use a mix of characters"],
                    "rewards": {"points": 100, "badge": "Starter", "achievement": "First step"},
                },
            }

        # Use AI engine
        result = ai_engine.generate_challenge(challenge_type, difficulty, topic)
        return {"ai": True, "challenge": result}
    except Exception as e:
        logger.exception("Failed to generate AI challenge")
        raise HTTPException(status_code=500, detail="Failed to generate AI challenge")


@app.post("/api/ai/challenges/answer")
async def ai_submit_answer(request: Request):
    """Evaluate an answer for an AI-generated challenge."""
    try:
        data = await request.json()
        challenge_id = data.get("challenge_id", "")
        player_answer = data.get("answer", "")
        correct_answer = data.get("correct_answer", "")
        if not player_answer or not correct_answer:
            raise HTTPException(status_code=400, detail="Missing answer or correct answer")

        if ai_engine is None:
            # Simple comparison fallback
            is_correct = str(player_answer).strip().lower() == str(correct_answer).strip().lower()
            return {
                "correct": is_correct,
                "points_earned": 100 if is_correct else 25,
                "feedback": "Great job!" if is_correct else "Not quite right. Try again!",
            }

        eval_result = ai_engine.evaluate_player_response(challenge_id, player_answer, correct_answer)
        return eval_result
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to evaluate AI challenge answer")
        raise HTTPException(status_code=500, detail="Failed to evaluate answer")

app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")

@app.get("/{path:path}")
async def serve_frontend_routes(path: str):
    return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    print("🛡️  Starting CyberQuest Jr on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
