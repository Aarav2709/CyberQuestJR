from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os
import re
import random
import json
import uuid
from typing import List, Optional, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberquest.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    experience_level = Column(String)
    interests = Column(Text)  # JSON string of interests
    created_at = Column(DateTime, default=datetime.utcnow)

class CourseProgress(Base):
    __tablename__ = "course_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    course_id = Column(String, index=True)
    completed = Column(Boolean, default=False)
    score = Column(Float, default=0.0)
    completion_date = Column(DateTime, nullable=True)
    course_content = Column(Text)  # AI-generated course content
    quiz_attempts = Column(Integer, default=0)
    best_quiz_score = Column(Float, default=0.0)

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    issued_date = Column(DateTime, default=datetime.utcnow)
    certificate_id = Column(String, unique=True, index=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Flask app
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    # Try to get API key from user input or set a default for demo
    GEMINI_API_KEY = "demo_key_will_use_fallback"

if GEMINI_API_KEY and GEMINI_API_KEY != "demo_key_will_use_fallback":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        print("🤖 Google Gemini AI initialized successfully!")
    except Exception as e:
        gemini_model = None
        print(f"⚠️ Warning: Failed to initialize Gemini AI: {e}. Using enhanced fallback content.")
else:
    gemini_model = None
    print("🎯 Using enhanced AI-like fallback content generation system.")

# Clean COURSES dictionary with only basic info and pre-made quizzes
COURSES = {
    "password-basics": {
        "title": "Password Heroes",
        "description": "Learn to create super strong passwords that protect your digital world like a superhero shield!",
        "icon": "🔐",
        "level": "Beginner",
        "difficulty": 1,
        "estimatedTime": "15 min",
        "quiz_questions": [
            {
                "question": "What makes a password super strong?",
                "options": ["Your birthday", "A mix of letters, numbers, and symbols", "Your pet's name", "password123"],
                "correct_answer": 1,
                "explanation": "Strong passwords use different types of characters and are hard to guess!"
            },
            {
                "question": "How long should a strong password be?",
                "options": ["4 characters", "6 characters", "At least 8 characters", "Exactly 10 characters"],
                "correct_answer": 2,
                "explanation": "Longer passwords are much harder to crack - aim for at least 8 characters!"
            },
            {
                "question": "Should you use the same password for all your accounts?",
                "options": ["Yes, it's easier to remember", "No, each account should have a unique password", "Only for unimportant accounts", "It doesn't matter"],
                "correct_answer": 1,
                "explanation": "Each account should have its own unique password so if one gets compromised, the others stay safe!"
            },
            {
                "question": "What should you do if you think your password has been compromised?",
                "options": ["Ignore it", "Change it immediately", "Wait a week", "Tell everyone"],
                "correct_answer": 1,
                "explanation": "If you suspect your password is compromised, change it right away to protect your account!"
            },
            {
                "question": "Which of these is the strongest password?",
                "options": ["password", "12345678", "Rainbow$Ninja#2024!", "myname123"],
                "correct_answer": 2,
                "explanation": "Rainbow$Ninja#2024! uses uppercase, lowercase, numbers, symbols, and is long - making it very strong!"
            }
        ]
    },
    "phishing-awareness": {
        "title": "Phishing Detective",
        "description": "Become a super detective and learn to spot fake emails and websites that try to trick you!",
        "icon": "🕵️",
        "level": "Beginner",
        "difficulty": 1,
        "estimatedTime": "20 min",
        "quiz_questions": [
            {
                "question": "What is phishing?",
                "options": ["A type of fishing", "Tricking people online to steal their information", "A computer game", "A social media platform"],
                "correct_answer": 1,
                "explanation": "Phishing is when criminals trick people into giving away personal information online!"
            },
            {
                "question": "What should you do if you receive a suspicious email?",
                "options": ["Click all the links", "Delete it and tell an adult", "Reply with your password", "Forward it to friends"],
                "correct_answer": 1,
                "explanation": "Always delete suspicious emails and tell a trusted adult - never click suspicious links!"
            },
            {
                "question": "Which is a red flag in an email?",
                "options": ["Perfect grammar", "Your real name", "Urgent threats and pressure", "A legitimate company logo"],
                "correct_answer": 2,
                "explanation": "Urgent threats and pressure tactics are classic signs of phishing emails!"
            },
            {
                "question": "Will legitimate companies ask for your password via email?",
                "options": ["Yes, always", "No, never", "Sometimes", "Only banks do this"],
                "correct_answer": 1,
                "explanation": "Legitimate companies will NEVER ask for your password or sensitive information via email!"
            },
            {
                "question": "What should you check before clicking a link?",
                "options": ["Nothing, just click it", "Hover over it to see where it really goes", "The color of the text", "The font size"],
                "correct_answer": 1,
                "explanation": "Always hover over links to see the real destination before clicking!"
            }
        ]
    },
    "digital-footprints": {
        "title": "Digital Footprint Explorer",
        "description": "Discover how to manage your online presence and keep your digital footprint safe and positive!",
        "icon": "👣",
        "level": "Beginner",
        "difficulty": 2,
        "estimatedTime": "25 min",
        "quiz_questions": [
            {
                "question": "What is a digital footprint?",
                "options": ["Footprints made by robots", "All the traces you leave online", "A type of computer virus", "A digital art project"],
                "correct_answer": 1,
                "explanation": "Your digital footprint is all the information and traces you leave behind when using the internet!"
            },
            {
                "question": "Why should you be careful about what you post online?",
                "options": ["It doesn't matter", "It can affect your future opportunities", "Only for adults", "It's just for fun"],
                "correct_answer": 1,
                "explanation": "What you post online can be seen by future schools, employers, and others - so keep it positive!"
            },
            {
                "question": "Who can see your digital footprint?",
                "options": ["Only you", "Your friends", "Future employers and schools", "Nobody"],
                "correct_answer": 2,
                "explanation": "Your digital footprint can be seen by many people, including future employers and schools!"
            },
            {
                "question": "What should you do before posting something online?",
                "options": ["Post it immediately", "Think about how it might affect your future", "Ask everyone's permission", "Only post at night"],
                "correct_answer": 1,
                "explanation": "Always think before you post - ask yourself if you'd be comfortable with anyone seeing it!"
            },
            {
                "question": "Can you completely erase your digital footprint?",
                "options": ["Yes, easily", "No, things online can be permanent", "Only with special software", "Only if you're under 18"],
                "correct_answer": 1,
                "explanation": "Once something is online, it can be very difficult or impossible to completely remove!"
            }
        ]
    },
    "social-media-safety": {
        "title": "Social Media Guardian",
        "description": "Learn how to have fun on social media while staying safe and protecting your privacy!",
        "icon": "📱",
        "level": "Intermediate",
        "difficulty": 2,
        "estimatedTime": "30 min",
        "quiz_questions": [
            {
                "question": "What information should you NEVER share on social media?",
                "options": ["Your favorite color", "Your full address and phone number", "Your favorite movie", "Your pet's name"],
                "correct_answer": 1,
                "explanation": "Never share personal information like your address, phone number, or school details on social media!"
            },
            {
                "question": "Who should you accept friend requests from?",
                "options": ["Everyone who sends one", "Only people you know in real life", "Anyone with a nice profile picture", "Random people"],
                "correct_answer": 1,
                "explanation": "Only accept friend requests from people you actually know and trust in real life!"
            },
            {
                "question": "What should you do if someone online makes you feel uncomfortable?",
                "options": ["Keep talking to them", "Block them and tell a trusted adult", "Give them your address", "Meet them in person"],
                "correct_answer": 1,
                "explanation": "If someone makes you uncomfortable online, block them immediately and tell a trusted adult!"
            },
            {
                "question": "Is it safe to share your location on social media?",
                "options": ["Yes, always", "No, it can be dangerous", "Only with strangers", "Only at school"],
                "correct_answer": 1,
                "explanation": "Sharing your location can let strangers know where you are, which can be very dangerous!"
            },
            {
                "question": "What should you check before posting a photo?",
                "options": ["Nothing", "If it shows personal information in the background", "Only the lighting", "The number of likes it might get"],
                "correct_answer": 1,
                "explanation": "Always check if photos accidentally show personal information like addresses, school names, or private details!"
            }
        ]
    },
    "cyber-bullying": {
        "title": "Kindness Champion",
        "description": "Learn how to stand up against cyberbullying and create a positive online environment for everyone!",
        "icon": "🛡️",
        "level": "Intermediate",
        "difficulty": 2,
        "estimatedTime": "25 min",
        "quiz_questions": [
            {
                "question": "What is cyberbullying?",
                "options": ["Playing games online", "Using technology to hurt or harass others", "Making new friends online", "Learning about computers"],
                "correct_answer": 1,
                "explanation": "Cyberbullying is using digital platforms to deliberately hurt, threaten, or embarrass someone!"
            },
            {
                "question": "If you're being cyberbullied, what should you do first?",
                "options": ["Fight back with mean comments", "Don't save any evidence", "Save evidence and tell a trusted adult", "Keep it secret"],
                "correct_answer": 2,
                "explanation": "Save screenshots as evidence and immediately tell a trusted adult who can help you!"
            },
            {
                "question": "What should you do if you see someone else being cyberbullied?",
                "options": ["Ignore it", "Join in", "Report it and offer support to the victim", "Share it with others"],
                "correct_answer": 2,
                "explanation": "Be an upstander! Report cyberbullying and offer support to the person being targeted!"
            },
            {
                "question": "Which of these is considered cyberbullying?",
                "options": ["Sending encouraging messages", "Sharing embarrassing photos of someone without permission", "Complimating someone's post", "Asking for homework help"],
                "correct_answer": 1,
                "explanation": "Sharing embarrassing content about someone without permission is a form of cyberbullying!"
            },
            {
                "question": "How can you prevent accidentally cyberbullying someone?",
                "options": ["Think before you post or comment", "Post whatever you want", "Only use private accounts", "Never use the internet"],
                "correct_answer": 0,
                "explanation": "Always think about how your words might affect others before posting or commenting online!"
            }
        ]
    },
    "privacy-guardian": {
        "title": "Privacy Guardian",
        "description": "Master the art of protecting your personal information and maintaining privacy in the digital world!",
        "icon": "🔒",
        "level": "Advanced",
        "difficulty": 3,
        "estimatedTime": "35 min",
        "quiz_questions": [
            {
                "question": "Why is online privacy important?",
                "options": ["It's not important", "To protect your personal information from misuse", "Only for celebrities", "Just for fun"],
                "correct_answer": 1,
                "explanation": "Online privacy protects your personal information from being misused by criminals or companies!"
            },
            {
                "question": "What are privacy settings used for?",
                "options": ["Making your profile look better", "Controlling who can see your information", "Increasing followers", "Making posts viral"],
                "correct_answer": 1,
                "explanation": "Privacy settings help you control who can see your posts, photos, and personal information!"
            },
            {
                "question": "Which type of information should you keep private?",
                "options": ["Your favorite hobby", "Your home address and school name", "Your favorite color", "Your favorite book"],
                "correct_answer": 1,
                "explanation": "Keep personal details like your address, school, and family information private for your safety!"
            },
            {
                "question": "What should you do before downloading an app?",
                "options": ["Download it immediately", "Check what permissions it asks for", "Give it access to everything", "Never read the terms"],
                "correct_answer": 1,
                "explanation": "Always check what information and permissions an app requests before downloading it!"
            },
            {
                "question": "Is it safe to use public Wi-Fi for online banking?",
                "options": ["Yes, always", "No, it's not secure", "Only in libraries", "Only with friends"],
                "correct_answer": 1,
                "explanation": "Public Wi-Fi is not secure - never do banking or enter passwords on public networks!"
            }
        ]
    }
}

# Utility functions
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise

def generate_smart_fallback_content(course_info: dict, user_age: int, experience_level: str, user_interests: list) -> dict:
    """Generate minimal fallback content only when AI completely fails"""

    return {
        "content": f"""
� **{course_info['title']}**

Welcome to this cybersecurity lesson!

**What you'll learn:**
{course_info['description']}

**Important:** This is a simplified version. For the full AI-generated lesson with detailed explanations, examples, and interactive content, please try refreshing the page or contact support.

**Key Topics:**
- Understanding the basics of {course_info['title'].lower()}
- Best practices and safety tips
- Real-world applications

Let's get started with the exercises and quiz!
        """,
        "exercises": [
            {
                "title": f"Basic {course_info['title']} Practice",
                "description": "Practice the fundamentals you just learned",
                "type": "scenario",
                "instructions": "Apply what you've learned about cybersecurity in a practical scenario."
            },
            {
                "title": "Security Awareness Check",
                "description": "Test your understanding of security concepts",
                "type": "scenario",
                "instructions": "Evaluate different security situations and choose the safest approach."
            }
        ]
    }

def generate_certificate_id() -> str:
    """Generate a unique certificate ID"""
    return f"CQ-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

# API Routes

@app.route("/api/users", methods=["POST"])
def create_user():
    """Create a new user profile"""
    try:
        data = request.get_json()
        name = data.get("name")
        age = data.get("age")
        experience_level = data.get("experience_level")
        interests = data.get("interests", [])

        if not all([name, age, experience_level]):
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        db_user = User(
            name=name,
            age=age,
            experience_level=experience_level,
            interests=",".join(interests)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return jsonify({
            "id": db_user.id,
            "name": db_user.name,
            "age": db_user.age,
            "experience_level": db_user.experience_level,
            "interests": db_user.interests.split(",") if db_user.interests else []
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Get user profile"""
    try:
        db = get_db()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "experience_level": user.experience_level,
            "interests": user.interests.split(",") if user.interests else []
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/courses", methods=["GET"])
def get_courses():
    """Get all available courses"""
    return jsonify({"courses": COURSES})

@app.route("/api/courses/generate", methods=["POST"])
def generate_course_content():
    """Generate AI-powered course content"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        course_id = data.get("course_id")

        if not user_id or not course_id:
            return jsonify({"error": "Missing user_id or course_id"}), 400

        db = get_db()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if course_id not in COURSES:
            return jsonify({"error": "Course not found"}), 404

        course_info = COURSES[course_id]

        # Check if content already exists
        existing_progress = db.query(CourseProgress).filter(
            CourseProgress.user_id == user_id,
            CourseProgress.course_id == course_id
        ).first()

        if existing_progress and existing_progress.course_content:
            # Return existing content
            return json.loads(existing_progress.course_content)

        # Generate new content using AI
        try:
            user_interests = user.interests.split(",") if user.interests else []

            # Create comprehensive AI prompt for course content
            prompt = f"""
            Create detailed educational content for a cybersecurity course for children aged {user.age}.

            Course: {course_info['title']} - {course_info['description']}
            User Experience Level: {user.experience_level}
            User Interests: {', '.join(user_interests)}

            Focus on creating engaging, age-appropriate content that includes:

            1. **Introduction**: A fun, engaging introduction to the topic (2-3 paragraphs)
            2. **Main Content**: Detailed explanation with:
               - Key concepts explained simply
               - Real-world examples and scenarios
               - Step-by-step instructions
               - Tips and best practices
               - Common mistakes to avoid
            3. **Practical Exercises**: 3 hands-on exercises with clear instructions

            Make the content:
            - Fun and engaging for a {user.age}-year-old
            - Educational but not overwhelming
            - Include real examples and scenarios
            - Use emojis and friendly language
            - Practical and actionable

            Format as JSON:
            {{
                "content": "comprehensive educational content with introduction, main sections, and practical tips",
                "exercises": [
                    {{
                        "title": "exercise title",
                        "description": "what the student will learn",
                        "type": "password|email|scenario",
                        "instructions": "detailed step-by-step instructions"
                    }},
                    {{
                        "title": "second exercise title",
                        "description": "what the student will learn",
                        "type": "password|email|scenario",
                        "instructions": "detailed step-by-step instructions"
                    }},
                    {{
                        "title": "third exercise title",
                        "description": "what the student will learn",
                        "type": "password|email|scenario",
                        "instructions": "detailed step-by-step instructions"
                    }}
                ]
            }}

            Focus on quality educational content - the quiz will be handled separately.
            """

            ai_content = None

            if gemini_model:
                try:
                    response = gemini_model.generate_content(prompt)
                    response_text = response.text if hasattr(response, 'text') else str(response)
                    # Clean the response to extract JSON
                    if '```json' in response_text:
                        response_text = response_text.split('```json')[1].split('```')[0]
                    elif '```' in response_text:
                        response_text = response_text.split('```')[1].split('```')[0]

                    ai_content = json.loads(response_text.strip())
                    print(f"✅ AI generated content for course: {course_id}")
                except Exception as ai_error:
                    print(f"🤖 AI generation failed: {ai_error}, using enhanced fallback")
                    ai_content = None

            # Generate final course content with AI content + pre-made quiz
            if ai_content:
                # Use AI-generated content with our pre-made quiz
                course_content = {
                    "content": ai_content.get("content", ""),
                    "exercises": ai_content.get("exercises", []),
                    "quiz": {
                        "questions": course_info.get("quiz", [])
                    }
                }
            else:
                # Use enhanced fallback if AI failed
                course_content = generate_smart_fallback_content(
                    course_info, user.age, user.experience_level, user_interests
                )
                # Always use our pre-made quiz
                course_content["quiz"] = {
                    "questions": course_info.get("quiz", [])
                }

            print(f"🎯 Generated course content for: {course_id} (AI: {'Yes' if ai_content else 'Fallback'})")

            # Save content to database
            if existing_progress:
                existing_progress.course_content = json.dumps(course_content)
            else:
                progress = CourseProgress(
                    user_id=user_id,
                    course_id=course_id,
                    course_content=json.dumps(course_content)
                )
                db.add(progress)

            db.commit()

            return jsonify(course_content)

        except Exception as e:
            return jsonify({"error": f"Failed to generate course content: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/courses/submit-quiz", methods=["POST"])
def submit_quiz():
    """Submit quiz answers and get results"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        course_id = data.get("course_id")
        answers = data.get("answers", {})

        if not all([user_id, course_id]):
            return jsonify({"error": "Missing required fields"}), 400

        db = get_db()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        progress = db.query(CourseProgress).filter(
            CourseProgress.user_id == user_id,
            CourseProgress.course_id == course_id
        ).first()

        if not progress or not progress.course_content:
            return jsonify({"error": "Course content not found"}), 404

        course_content = json.loads(progress.course_content)
        quiz = course_content.get("quiz", {})
        questions = quiz.get("questions", [])

        # Calculate score
        correct_answers = 0
        total_questions = len(questions)
        results = []

        for i, question in enumerate(questions):
            user_answer = answers.get(str(i), -1)
            correct_answer = question.get("correct_answer", -1)
            is_correct = user_answer == correct_answer

            if is_correct:
                correct_answers += 1

            results.append({
                "question": question.get("question", ""),
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "explanation": question.get("explanation", "")
            })

        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        passed = score >= 70  # 70% passing grade

        # Update progress
        progress.quiz_attempts += 1
        if score > progress.best_quiz_score:
            progress.best_quiz_score = score

        if passed and not progress.completed:
            progress.completed = True
            progress.completion_date = datetime.utcnow()
            progress.score = score

        db.commit()

        return jsonify({
            "score": score,
            "passed": passed,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "results": results,
            "attempts": progress.quiz_attempts
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/exercises/validate", methods=["POST"])
def validate_exercise():
    """Validate exercise answers"""
    try:
        data = request.get_json()
        exercise_type = data.get("type", "")
        answer = data.get("answer", "")

        if exercise_type == "password":
            return jsonify(validate_password_strength(answer))
        elif exercise_type == "email":
            return jsonify(validate_email_safety(answer))
        elif exercise_type == "scenario":
            # For scenario-based exercises, provide feedback
            return jsonify({
                "feedback": "Good thinking! Remember to always verify suspicious messages.",
                "score": 85,
                "tips": ["Always check the sender", "Look for spelling mistakes", "Verify links before clicking"]
            })
        else:
            return jsonify({"error": "Unknown exercise type"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<int:user_id>/progress", methods=["GET"])
def get_user_progress(user_id):
    """Get user's progress across all courses"""
    try:
        db = get_db()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        progress_records = db.query(CourseProgress).filter(CourseProgress.user_id == user_id).all()

        progress = {}
        completed_courses = 0
        total_score = 0

        for record in progress_records:
            progress[record.course_id] = {
                "completed": record.completed,
                "score": record.score,
                "completion_date": record.completion_date.isoformat() if record.completion_date else None,
                "quiz_attempts": record.quiz_attempts,
                "best_quiz_score": record.best_quiz_score
            }

            if record.completed:
                completed_courses += 1
                total_score += record.score

        # Check if eligible for certificate
        eligible_for_certificate = completed_courses == len(COURSES)

        # Check if certificate already issued
        certificate = None
        if eligible_for_certificate:
            cert_record = db.query(Certificate).filter(Certificate.user_id == user_id).first()
            if cert_record:
                certificate = {
                    "certificate_id": cert_record.certificate_id,
                    "issued_date": cert_record.issued_date.isoformat()
                }

        return jsonify({
            "user_id": user_id,
            "completed_courses": completed_courses,
            "total_courses": len(COURSES),
            "average_score": total_score / completed_courses if completed_courses > 0 else 0,
            "progress": progress,
            "eligible_for_certificate": eligible_for_certificate,
            "certificate": certificate
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/users/<int:user_id>/certificate", methods=["POST"])
def issue_certificate(user_id):
    """Issue a certificate to a user who completed all courses"""
    try:
        db = get_db()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if user completed all courses
        completed_courses = db.query(CourseProgress).filter(
            CourseProgress.user_id == user_id,
            CourseProgress.completed == True
        ).count()

        if completed_courses != len(COURSES):
            return jsonify({"error": "User must complete all courses to receive certificate"}), 400

        # Check if certificate already exists
        existing_cert = db.query(Certificate).filter(Certificate.user_id == user_id).first()
        if existing_cert:
            return jsonify({
                "certificate_id": existing_cert.certificate_id,
                "issued_date": existing_cert.issued_date.isoformat(),
                "message": "Certificate already issued"
            })

        # Issue new certificate
        certificate_id = generate_certificate_id()
        certificate = Certificate(
            user_id=user_id,
            certificate_id=certificate_id
        )

        db.add(certificate)
        db.commit()

        return jsonify({
            "certificate_id": certificate_id,
            "issued_date": certificate.issued_date.isoformat(),
            "message": "Congratulations! You've completed all CyberQuest Jr courses!"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    """Get leaderboard of top performers"""
    try:
        db = get_db()
        # Get users with their progress
        users = db.query(User).all()
        leaderboard = []

        for user in users:
            progress_records = db.query(CourseProgress).filter(
                CourseProgress.user_id == user.id,
                CourseProgress.completed == True
            ).all()

            if progress_records:
                total_score = sum(record.score for record in progress_records)
                avg_score = total_score / len(progress_records)
                completed_courses = len(progress_records)

                # Check for certificate
                has_certificate = db.query(Certificate).filter(Certificate.user_id == user.id).first() is not None

                leaderboard.append({
                    "name": user.name,
                    "completed_courses": completed_courses,
                    "average_score": round(avg_score, 1),
                    "total_score": round(total_score, 1),
                    "has_certificate": has_certificate
                })

        # Sort by completed courses, then by average score
        leaderboard.sort(key=lambda x: (x["completed_courses"], x["average_score"]), reverse=True)

        return jsonify({"leaderboard": leaderboard[:10]})  # Top 10

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# Static file serving
@app.route("/")
def serve_frontend():
    """Serve the frontend application"""
    if os.path.exists("static/index.html"):
        return send_from_directory("static", "index.html")
    else:
        return jsonify({"message": "CyberQuest Jr API is running! Please build the frontend first."})

@app.route("/<path:path>")
def serve_spa(path):
    """Serve the SPA for any route (React Router support)"""
    # Let Flask handle static files automatically
    if os.path.exists("static/index.html"):
        return send_from_directory("static", "index.html")
    else:
        return jsonify({"message": "Frontend not found. Please build the frontend first."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
