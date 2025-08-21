from sqlalchemy.orm import declarative_base
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
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
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("🤖 Google Gemini AI initialized successfully!")
else:
    gemini_model = None
    print("⚠️ Warning: GEMINI_API_KEY not found. AI features will use fallback content.")

# Course definitions
COURSES = {
    "password-basics": {
        "title": "Password Heroes",
        "description": "Learn to create super strong passwords that protect your digital world like a superhero shield!",
        "icon": "🔐",
        "level": "Beginner",
        "difficulty": 1,
        "estimatedTime": "15 min"
    },
    "phishing-awareness": {
        "title": "Phishing Detective",
        "description": "Become an expert detective at spotting fake emails and suspicious messages that try to trick you!",
        "icon": "🕵️",
        "level": "Beginner",
        "difficulty": 1,
        "estimatedTime": "20 min"
    },
    "digital-footprints": {
        "title": "Digital Footprint Tracker",
        "description": "Understand what traces you leave online and how to manage them like a pro!",
        "icon": "👣",
        "level": "Intermediate",
        "difficulty": 2,
        "estimatedTime": "25 min"
    },
    "social-media-safety": {
        "title": "Safe Social Media",
        "description": "Navigate social platforms safely and responsibly while having fun with friends!",
        "icon": "📱",
        "level": "Intermediate",
        "difficulty": 2,
        "estimatedTime": "30 min"
    },
    "cyber-bullying": {
        "title": "Cyber Bullying Defense",
        "description": "Learn to identify, prevent, and respond to online bullying like a true cyber warrior!",
        "icon": "🛡️",
        "level": "Intermediate",
        "difficulty": 2,
        "estimatedTime": "25 min"
    },
    "privacy-guardian": {
        "title": "Privacy Guardian",
        "description": "Master the art of protecting your personal information and privacy online!",
        "icon": "🔒",
        "level": "Advanced",
        "difficulty": 3,
        "estimatedTime": "35 min"
    }
}

# Pre-made quiz questions for each course
COURSE_QUIZZES = {
    "password-basics": {
        "questions": [
            {
                "question": "What makes a password strong?",
                "options": ["Using your name and birthday", "Having at least 8 characters with letters, numbers, and symbols", "Using 'password123'", "Making it easy to remember"],
                "correct_answer": 1,
                "explanation": "A strong password has at least 8 characters and includes uppercase letters, lowercase letters, numbers, and symbols!"
            },
            {
                "question": "How often should you change your passwords?",
                "options": ["Never", "Every day", "When you think they might be compromised", "Only on your birthday"],
                "correct_answer": 2,
                "explanation": "You should change passwords when you suspect they might be compromised or shared accidentally."
            },
            {
                "question": "Should you share your password with your best friend?",
                "options": ["Yes, best friends share everything", "No, passwords should always be private", "Only if they promise not to tell", "Yes, but only on weekends"],
                "correct_answer": 1,
                "explanation": "Passwords should NEVER be shared with anyone, not even your best friend. Keep them private and safe!"
            },
            {
                "question": "What's a good way to remember strong passwords?",
                "options": ["Write them on sticky notes", "Use the same password everywhere", "Use a password manager", "Tell your parents to remember them"],
                "correct_answer": 2,
                "explanation": "A password manager is a safe tool that helps you create and remember strong, unique passwords for all your accounts."
            },
            {
                "question": "If you see someone typing their password, what should you do?",
                "options": ["Try to memorize it", "Look away to respect their privacy", "Help them type it faster", "Take a picture"],
                "correct_answer": 1,
                "explanation": "Always look away when someone is entering their password to respect their privacy and security."
            }
        ]
    },
    "phishing-awareness": {
        "questions": [
            {
                "question": "What is phishing?",
                "options": ["A type of fishing with nets", "Fake messages trying to steal your information", "A computer game", "A way to catch viruses"],
                "correct_answer": 1,
                "explanation": "Phishing is when bad people send fake messages (emails, texts) to try to trick you into giving them your personal information."
            },
            {
                "question": "You get an email saying 'You won $1000! Click here!' What should you do?",
                "options": ["Click the link immediately", "Tell an adult and don't click anything", "Forward it to all your friends", "Reply with your address"],
                "correct_answer": 1,
                "explanation": "This is likely a phishing email! Always tell a trusted adult about suspicious messages and never click unknown links."
            },
            {
                "question": "How can you spot a phishing email?",
                "options": ["It has your name in it", "It asks for personal information or passwords", "It's from someone you know", "It has nice pictures"],
                "correct_answer": 1,
                "explanation": "Phishing emails often ask for personal information, passwords, or money. Real companies will never ask for this information via email."
            },
            {
                "question": "What should you do if you accidentally click a suspicious link?",
                "options": ["Keep clicking to see what happens", "Tell an adult immediately", "Try to undo it yourself", "Ignore it and hope nothing happens"],
                "correct_answer": 1,
                "explanation": "If you accidentally click a suspicious link, tell a trusted adult right away so they can help protect your information."
            },
            {
                "question": "Which email address looks more trustworthy?",
                "options": ["support@amaz0n.com", "support@amazon.com", "supp0rt@amazon.co", "support@amazom.com"],
                "correct_answer": 1,
                "explanation": "The real Amazon email would be support@amazon.com. Be careful of emails that replace letters with numbers or have misspellings!"
            }
        ]
    },
    "digital-footprints": {
        "questions": [
            {
                "question": "What is a digital footprint?",
                "options": ["A picture of your foot", "The trail of information you leave online", "A type of computer virus", "A way to track animals"],
                "correct_answer": 1,
                "explanation": "Your digital footprint is all the information about you that exists online - like posts, photos, and websites you visit."
            },
            {
                "question": "Once you post something online, what happens to it?",
                "options": ["It disappears after a day", "It stays there forever, even if you delete it", "Only your friends can see it", "It automatically becomes private"],
                "correct_answer": 1,
                "explanation": "Once something is posted online, it can stay there forever! Other people might have copied or saved it before you delete it."
            },
            {
                "question": "Before posting a photo, you should ask yourself:",
                "options": ["Is this the funniest photo ever?", "Would I be okay if everyone in the world saw this?", "Will this get lots of likes?", "Is my hair looking good?"],
                "correct_answer": 1,
                "explanation": "Always think: 'Would I be comfortable if anyone could see this?' This helps you make smart choices about what to share."
            },
            {
                "question": "What information should you NEVER share online?",
                "options": ["Your favorite color", "Your home address and phone number", "Your favorite movie", "Your pet's name"],
                "correct_answer": 1,
                "explanation": "Never share personal information like your address, phone number, school name, or where you'll be at certain times."
            },
            {
                "question": "Who can see your 'private' social media posts?",
                "options": ["Only you", "Your friends and possibly the company that runs the platform", "Nobody", "Only your family"],
                "correct_answer": 1,
                "explanation": "Even 'private' posts can be seen by the social media company, and settings can change. Always post carefully!"
            }
        ]
    },
    "social-media-safety": {
        "questions": [
            {
                "question": "What should you do if a stranger wants to be your friend online?",
                "options": ["Accept immediately - more friends is better!", "Ask a trusted adult before accepting", "Accept but don't talk to them", "Send them your phone number"],
                "correct_answer": 1,
                "explanation": "Always ask a trusted adult before accepting friend requests from people you don't know in real life."
            },
            {
                "question": "Someone online wants to meet you in person. What should you do?",
                "options": ["Meet them at a public place", "Tell your parents and let them decide", "Go alone to show you're grown up", "Meet them near your school"],
                "correct_answer": 1,
                "explanation": "NEVER meet online friends in person without your parents knowing and being involved. Tell a trusted adult immediately."
            },
            {
                "question": "What's the best privacy setting for your social media?",
                "options": ["Public - everyone should see my posts!", "Friends only", "Friends of friends", "It doesn't matter"],
                "correct_answer": 1,
                "explanation": "Keep your posts set to 'Friends only' so only people you know and trust can see what you share."
            },
            {
                "question": "If someone is being mean to you online, you should:",
                "options": ["Be mean back to them", "Block them and tell a trusted adult", "Post about it publicly", "Just ignore it completely"],
                "correct_answer": 1,
                "explanation": "Block bullies and always tell a trusted adult. You don't have to deal with online meanness alone!"
            },
            {
                "question": "How much time should you spend on social media each day?",
                "options": ["As much as possible", "Only during school hours", "A reasonable amount with breaks for other activities", "All night long"],
                "correct_answer": 2,
                "explanation": "It's important to balance screen time with other activities like playing outside, reading, and spending time with family!"
            }
        ]
    },
    "cyber-bullying": {
        "questions": [
            {
                "question": "What is cyberbullying?",
                "options": ["Playing games online", "Using technology to hurt or embarrass someone", "Learning about computers", "Making online friends"],
                "correct_answer": 1,
                "explanation": "Cyberbullying is when someone uses technology (like phones, computers, or social media) to be mean, threaten, or embarrass someone else."
            },
            {
                "question": "If someone is cyberbullying you, what should you do FIRST?",
                "options": ["Bully them back", "Don't save any evidence", "Tell a trusted adult immediately", "Post about it on social media"],
                "correct_answer": 2,
                "explanation": "The first thing to do is tell a trusted adult like a parent, teacher, or counselor. They can help you handle the situation safely."
            },
            {
                "question": "Should you screenshot or save evidence of cyberbullying?",
                "options": ["No, just delete everything", "Yes, it can help adults understand what's happening", "Only if it's really bad", "Only on weekends"],
                "correct_answer": 1,
                "explanation": "Yes! Save screenshots or evidence to show trusted adults. This helps them understand what's happening and how to help you."
            },
            {
                "question": "If you see someone else being cyberbullied, what should you do?",
                "options": ["Join in so you don't become a target", "Ignore it - it's not your problem", "Support the victim and tell an adult", "Share it with everyone"],
                "correct_answer": 2,
                "explanation": "Be an upstander! Support the person being bullied and tell a trusted adult. Your kindness can make a big difference."
            },
            {
                "question": "True or False: It's okay to say things online that you wouldn't say in person.",
                "options": ["True - the internet is different", "False - treat others with respect everywhere", "True - but only on weekends", "It depends on the website"],
                "correct_answer": 1,
                "explanation": "False! Always treat others with kindness and respect, whether online or in person. Real people with real feelings are behind every screen."
            }
        ]
    },
    "privacy-guardian": {
        "questions": [
            {
                "question": "What does 'privacy' mean online?",
                "options": ["Keeping your personal information safe and controlled", "Making sure no one can find you", "Only using private computers", "Never going online"],
                "correct_answer": 0,
                "explanation": "Privacy means controlling who can see your personal information and keeping your private details safe from people who shouldn't have them."
            },
            {
                "question": "Which of these is okay to share on a public profile?",
                "options": ["Your full name and address", "Your school name and schedule", "Your favorite hobby", "Your phone number"],
                "correct_answer": 2,
                "explanation": "Sharing your hobbies is generally safe! But never share personal details like your address, phone number, or school information."
            },
            {
                "question": "What should you check before downloading an app?",
                "options": ["If your friends have it", "The app's privacy policy and permissions", "If it's free", "If it has good graphics"],
                "correct_answer": 1,
                "explanation": "Always check what information the app wants to access and read reviews. Some apps ask for more information than they actually need!"
            },
            {
                "question": "When is it okay to give out your personal information online?",
                "options": ["When a website asks for it", "When you're talking to online friends", "Only with parent permission on trusted sites", "Never, under any circumstances"],
                "correct_answer": 2,
                "explanation": "Only share personal information on trusted websites and with your parents' permission. They can help you decide what's safe to share."
            },
            {
                "question": "What's the safest way to use public Wi-Fi?",
                "options": ["Avoid logging into important accounts", "Share your passwords with others", "Download lots of apps", "Give your personal information to anyone who asks"],
                "correct_answer": 0,
                "explanation": "On public Wi-Fi, avoid logging into important accounts like email or banking. Public networks are less secure than your home Wi-Fi."
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

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength with detailed feedback"""
    score = 0
    feedback = []

    if len(password) >= 8:
        score += 2
    else:
        feedback.append("Password should be at least 8 characters long")

    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Include at least one uppercase letter")

    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Include at least one lowercase letter")

    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Include at least one number")

    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Include at least one special character")

    strength = "Weak"
    if score >= 5:
        strength = "Strong"
    elif score >= 3:
        strength = "Medium"

    return {
        "score": score,
        "max_score": 6,
        "strength": strength,
        "feedback": feedback,
        "is_strong": score >= 5
    }

def validate_email_safety(email: str) -> Dict[str, Any]:
    """Check if an email looks suspicious"""
    suspicious_domains = ["fakeemail.com", "phishing.net", "suspicious.org", "scam.biz"]
    suspicious_keywords = ["urgent", "winner", "prize", "click now", "verify account", "suspended"]

    is_suspicious = False
    warnings = []

    # Check domain
    if "@" in email:
        domain = email.split("@")[1].lower()
        if domain in suspicious_domains:
            is_suspicious = True
            warnings.append(f"Domain '{domain}' is known to be suspicious")

    # Check for suspicious keywords
    email_lower = email.lower()
    for keyword in suspicious_keywords:
        if keyword in email_lower:
            is_suspicious = True
            warnings.append(f"Contains suspicious keyword: '{keyword}'")

    return {
        "is_suspicious": is_suspicious,
        "warnings": warnings,
        "safety_score": 0 if is_suspicious else 100
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

            # AI prompt for ONLY course content and exercises (NOT quiz)
            prompt = f"""
            Create educational content for a cybersecurity course for children aged {user.age}.

            Course: {course_info['title']} - {course_info['description']}
            User Experience Level: {user.experience_level}
            User Interests: {', '.join(user_interests)}

            Generate ONLY:
            1. Educational content (explanation, examples, tips) - make it engaging and age-appropriate
            2. 3 practical exercises with clear instructions

            Format the response as JSON with this structure:
            {{
                "content": "detailed educational content here - make it comprehensive, fun and educational for kids",
                "exercises": [
                    {{
                        "title": "exercise title",
                        "description": "what to do",
                        "type": "password|email|scenario",
                        "instructions": "step by step instructions"
                    }}
                ]
            }}

            Make the content detailed, fun, and appropriate for a {user.age}-year-old with {user.experience_level} experience.
            Include real-world examples, tips, and make it engaging with emojis and kid-friendly language.
            """

            if gemini_model:
                response = gemini_model.generate_content(prompt)
                response_text = response.text if hasattr(response, 'text') else str(response)

                print(f"🤖 AI Raw Response: {response_text}")  # Debug log

                # Clean the response - remove markdown code blocks if present
                cleaned_response = response_text.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]  # Remove ```json
                if cleaned_response.startswith('```'):
                    cleaned_response = cleaned_response[3:]   # Remove ```
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]  # Remove closing ```
                cleaned_response = cleaned_response.strip()

                print(f"🧹 Cleaned Response: {cleaned_response[:200]}...")  # Debug log

                # Parse AI response for content and exercises
                try:
                    ai_content = json.loads(cleaned_response)
                    course_content = ai_content.get('content', f"Welcome to {course_info['title']}!")
                    exercises = ai_content.get('exercises', [])
                    print(f"✅ AI JSON Parsed Successfully")  # Debug log
                except json.JSONDecodeError as e:
                    print(f"❌ JSON Parse Error: {e}")  # Debug log
                    print(f"🔧 Trying to extract content manually from: {response_text[:200]}...")  # Debug log
                    # Fallback if AI response isn't valid JSON
                    course_content = f"Welcome to {course_info['title']}! 🚀\n\n{course_info['description']}\n\nIn this course, you'll learn important skills and have fun with interactive activities!"
                    exercises = [
                        {
                            "title": "Practice Exercise",
                            "description": "Let's practice what we've learned!",
                            "type": "scenario",
                            "instructions": "Think about how you would apply these cybersecurity concepts in real life."
                        }
                    ]
            else:
                # Fallback if AI is not available
                course_content = f"Welcome to {course_info['title']}! 🚀\n\n{course_info['description']}\n\nIn this course, you'll learn important skills and have fun with interactive activities!"
                exercises = [
                    {
                        "title": "Practice Exercise",
                        "description": "Let's practice what we've learned!",
                        "type": "scenario",
                        "instructions": "Think about how you would apply these cybersecurity concepts in real life."
                    }
                ]

            # Get PRE-MADE quiz questions for this course
            quiz_data = COURSE_QUIZZES.get(course_id, {
                "questions": [
                    {
                        "question": "What did you learn in this course?",
                        "options": ["Important cybersecurity concepts", "Nothing useful", "How to play games", "How to break computers"],
                        "correct_answer": 0,
                        "explanation": "This course teaches important cybersecurity concepts to keep you safe online!"
                    }
                ]
            })

            # Combine AI-generated content with pre-made quiz
            final_course_content = {
                "content": course_content,
                "exercises": exercises,
                "quiz": quiz_data
            }

            # Save content to database
            if existing_progress:
                existing_progress.course_content = json.dumps(final_course_content)
            else:
                progress = CourseProgress(
                    user_id=user_id,
                    course_id=course_id,
                    course_content=json.dumps(final_course_content)
                )
                db.add(progress)

            db.commit()

            return jsonify(final_course_content)

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
