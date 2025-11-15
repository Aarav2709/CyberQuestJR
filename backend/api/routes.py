from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from models.database import get_db, Player, GameSession, Achievement
from models.schemas import PlayerCreate, PlayerResponse, GameSessionCreate, ChallengeAnswer, PowerUpPurchase
from api.game_controller import game_controller

router = APIRouter()

@router.post("/players", response_model=PlayerResponse)
async def create_player(player_data: PlayerCreate, db: Session = Depends(get_db)):
    """Create a new player"""
    
    # Check if username already exists
    existing = db.query(Player).filter(Player.username == player_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    player = Player(
        username=player_data.username,
        avatar=player_data.avatar
    )
    
    db.add(player)
    db.commit()
    db.refresh(player)
    
    return PlayerResponse(
        id=player.id,
        username=player.username,
        level=player.level,
        experience_points=player.experience_points,
        coins=player.coins,
        current_module=player.current_module,
        avatar=player.avatar
    )

@router.get("/players/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: int, db: Session = Depends(get_db)):
    """Get player information"""
    
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return PlayerResponse(
        id=player.id,
        username=player.username,
        level=player.level,
        experience_points=player.experience_points,
        coins=player.coins,
        current_module=player.current_module,
        avatar=player.avatar
    )

@router.get("/players/{player_id}/achievements")
async def get_player_achievements(player_id: int, db: Session = Depends(get_db)):
    """Get player's achievements"""
    
    achievements = db.query(Achievement).filter(Achievement.player_id == player_id).all()
    
    return [
        {
            "id": achievement.id,
            "type": achievement.achievement_type,
            "title": achievement.title,
            "description": achievement.description,
            "icon": achievement.icon,
            "earned_at": achievement.earned_at
        }
        for achievement in achievements
    ]

@router.get("/modules")
async def get_available_modules(player_id: int = None, db: Session = Depends(get_db)):
    """Get list of available game modules"""
    
    player_level = 1
    if player_id:
        player = db.query(Player).filter(Player.id == player_id).first()
        if player:
            player_level = player.level
    
    modules = game_controller.get_available_modules(player_level)
    return modules

@router.get("/modules/{module_name}/content")
async def get_module_content(module_name: str):
    """Get educational content for a module"""
    
    try:
        content = await game_controller.get_module_content(module_name)
        return content
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.database import get_db, GameSession, Player, ModuleProgress
from models.schemas import (
    ChallengeRequest, ChallengeResponse, GameSessionCreate, 
    PlayerCreate, ProgressUpdate, ModuleProgressResponse
)
from game.controller import GameController
import json

router = APIRouter()
game_controller = GameController()

@router.post("/game/start", response_model=dict)
async def start_game_session(session_data: GameSessionCreate, db: Session = Depends(get_db)):
    """Start a new gaming session"""
    
    # Get or create player (for demo, use player_id directly)
    player = db.query(Player).filter(Player.id == session_data.player_id).first()
    if not player:
        # Create a demo player if not exists
        player = Player(
            username=f"Player_{session_data.player_id}",
            anonymous_name=f"CyberHero_{session_data.player_id}"
        )
        db.add(player)
        db.commit()
        db.refresh(player)
    
    # Create game session
    import uuid
    session_id = str(uuid.uuid4())
    
    game_session = GameSession(
        session_id=session_id,
        player_id=player.id,
        module_name=session_data.module_name,
        current_challenge=0,
        score=0,
        lives=3,
        power_ups="{}",
        session_data="{}",
        is_active=True
    )
    db.add(game_session)
    db.commit()
    db.refresh(game_session)
    
    return {
        "session_id": session_id,
        "current_challenge": 0,
        "score": 0,
        "lives": 3,
        "power_ups": {},
        "is_active": True
    }

@router.post("/challenges/generate", response_model=ChallengeResponse)
async def generate_challenge(request: ChallengeRequest, db: Session = Depends(get_db)):
    """Generate an AI-powered challenge for a specific module"""
    
    challenge = await game_controller.generate_module_challenge(
        request.module_name,
        request.difficulty,
        request.previous_performance
    )
    
    return ChallengeResponse(**challenge)

@router.post("/game/submit")
async def submit_challenge_response(
    session_id: int,
    player_response: dict,
    db: Session = Depends(get_db)
):
    """Submit player response to a challenge and get feedback"""
    
    # Get game session
    session = db.query(GameSession).filter(GameSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    # Process response
    result = game_controller.process_player_response(
        session.module_id,
        player_response,
        json.loads(session.current_challenge) if session.current_challenge else {}
    )
    
    # Update session
    session.score += result.get("points", 0)
    session.challenges_completed += 1
    
    # Update player progress
    progress = db.query(ModuleProgress).filter(
        ModuleProgress.player_id == session.player_id,
        ModuleProgress.module_id == session.module_id
    ).first()
    
    if progress:
        progress.score = max(progress.score, session.score)
        progress.challenges_completed += 1
    else:
        progress = ModuleProgress(
            player_id=session.player_id,
            module_id=session.module_id,
            score=session.score,
            challenges_completed=1
        )
        db.add(progress)
    
    db.commit()
    
    return result

@router.get("/modules")
async def get_available_modules():
    """Get list of all available gaming modules"""
    return game_controller.get_available_modules()

@router.get("/modules/{module_id}")
async def get_module_info(module_id: str):
    """Get detailed information about a specific module"""
    module_info = game_controller.get_module_info(module_id)
    if not module_info:
        raise HTTPException(status_code=404, detail="Module not found")
    return module_info

@router.get("/modules/{module_id}/content")
async def get_module_content(module_id: str):
    """Get learning content for a specific module"""
    content = game_controller.get_module_content(module_id)
    if not content:
        raise HTTPException(status_code=404, detail="Module content not found")
    return content

@router.get("/player/{player_id}/progress")
async def get_player_progress(player_id: int, db: Session = Depends(get_db)):
    """Get player's progress across all modules"""
    
    progress_records = db.query(ModuleProgress).filter(
        ModuleProgress.player_id == player_id
    ).all()
    
    return [
        {
            "module_id": p.module_id,
            "score": p.score,
            "challenges_completed": p.challenges_completed,
            "completed_at": p.completed_at
        }
        for p in progress_records
    ]

@router.post("/game/answer")
async def submit_challenge_answer(answer_data: ChallengeAnswer, db: Session = Depends(get_db)):
    """Submit an answer to a challenge"""
    
    try:
        result = await game_controller.submit_answer(answer_data, db)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/game/{session_id}/status")
async def get_game_status(session_id: str, db: Session = Depends(get_db)):
    """Get current game session status"""
    
    session = db.query(GameSession).filter(GameSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.session_id,
        "module_name": session.module_name,
        "current_challenge": session.current_challenge,
        "score": session.score,
        "lives": session.lives,
        "is_active": session.is_active,
        "started_at": session.started_at,
        "completed_at": session.completed_at
    }

@router.post("/game/powerup")
async def use_powerup(powerup_data: PowerUpPurchase, db: Session = Depends(get_db)):
    """Use a power-up in the game"""
    
    session = db.query(GameSession).filter(GameSession.session_id == powerup_data.session_id).first()
    if not session or not session.is_active:
        raise HTTPException(status_code=400, detail="Invalid or inactive session")
    
    player = db.query(Player).filter(Player.id == session.player_id).first()
    
    # Power-up effects
    powerup_costs = {
        "hint": 10,
        "extra_life": 25,
        "time_freeze": 15,
        "skip_challenge": 40
    }
    
    cost = powerup_costs.get(powerup_data.power_up_id, 0)
    
    if player.coins < cost:
        raise HTTPException(status_code=400, detail="Not enough coins")
    
    player.coins -= cost
    
    # Apply power-up effect
    if powerup_data.power_up_id == "extra_life":
        session.lives += 1
    elif powerup_data.power_up_id == "skip_challenge":
        session.current_challenge += 1
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Power-up {powerup_data.power_up_id} activated!",
        "remaining_coins": player.coins,
        "new_lives": session.lives if powerup_data.power_up_id == "extra_life" else session.lives
    }

# Assessment and Quiz Routes
@router.get("/quiz/generate/{quiz_type}")
async def generate_quiz(quiz_type: str):
    """Generate assessment quiz for skill evaluation"""
    
    # Assessment quiz for determining skill level
    assessment_quiz = {
        "title": "🎯 Cybersecurity Skills Assessment",
        "questions": [
            {
                "id": 1,
                "question": "Which of these is the BEST password?",
                "options": ["password123", "MyDog2024!", "123456", "myname"],
                "correct_answer": "MyDog2024!",
                "explanation": "This password has uppercase, lowercase, numbers, and symbols - making it strong! 💪"
            },
            {
                "id": 2,
                "question": "You receive an email saying 'URGENT: Verify your account now!' with a suspicious link. What should you do?",
                "options": ["Click the link immediately", "Delete the email and report it as phishing", "Forward it to friends", "Reply with your password"],
                "correct_answer": "Delete the email and report it as phishing",
                "explanation": "Phishing emails try to trick you! Always be suspicious of urgent requests for personal info. 🚨"
            },
            {
                "id": 3,
                "question": "What information is safe to share on social media?",
                "options": ["Your home address", "Your school schedule", "Your favorite movie", "Your phone number"],
                "correct_answer": "Your favorite movie",
                "explanation": "Personal interests are okay to share, but never share personal details like addresses or schedules! 🎬"
            },
            {
                "id": 4,
                "question": "Someone you don't know online wants to meet you in person. What should you do?",
                "options": ["Meet them right away", "Tell a trusted adult and never meet alone", "Ignore them", "Give them your address"],
                "correct_answer": "Tell a trusted adult and never meet alone",
                "explanation": "Online strangers can be dangerous. Always involve a trusted adult in any meetup decisions! 👨‍👩‍👧‍👦"
            },
            {
                "id": 5,
                "question": "What should you do before connecting to public Wi-Fi?",
                "options": ["Connect immediately", "Check if it requires a password", "Ask an adult if it's safe", "Share the connection with strangers"],
                "correct_answer": "Ask an adult if it's safe",
                "explanation": "Public Wi-Fi can be risky! It's always best to check with an adult first. 📶"
            },
            {
                "id": 6,
                "question": "If you accidentally download something suspicious, what's the first thing you should do?",
                "options": ["Open it to see what it is", "Tell an adult immediately", "Share it with friends", "Delete your entire computer"],
                "correct_answer": "Tell an adult immediately",
                "explanation": "Don't panic! Get help from a trusted adult who can help you handle the situation safely. 🆘"
            }
        ]
    }
    
    return assessment_quiz

@router.post("/quiz/submit")
async def submit_quiz(submission: dict, db: Session = Depends(get_db)):
    """Submit quiz answers and get results with personalized course generation"""
    
    quiz_type = submission.get("quiz_type", "assessment")
    answers = submission.get("answers", [])
    anonymous_name = submission.get("anonymous_name", "CyberHero")
    
    if not answers:
        raise HTTPException(status_code=400, detail="No answers provided")
    
    # Calculate score
    total_questions = len(answers)
    correct_answers = 0
    
    # Assessment quiz correct answers
    correct_quiz_answers = {
        1: "MyDog2024!",
        2: "Delete the email and report it as phishing", 
        3: "Your favorite movie",
        4: "Tell a trusted adult and never meet alone",
        5: "Ask an adult if it's safe",
        6: "Tell an adult immediately"
    }
    
    for answer in answers:
        question_id = answer.get("question_id")
        user_answer = answer.get("answer")
        
        if question_id in correct_quiz_answers:
            if user_answer == correct_quiz_answers[question_id]:
                correct_answers += 1
    
    score = (correct_answers / total_questions) * 100
    
    # Determine skill level and feedback
    if score >= 80:
        level = "Advanced"
        skill_level = "advanced"
        feedback = {
            "title": "Cybersecurity Expert! 🏆",
            "message": "You have excellent cybersecurity knowledge!",
            "encouragement": "You're ready for advanced challenges! 🚀"
        }
    elif score >= 60:
        level = "Intermediate" 
        skill_level = "intermediate"
        feedback = {
            "title": "Cyber Defender! 🛡️",
            "message": "You have solid cybersecurity foundations!",
            "encouragement": "Let's build on your strong knowledge! 💪"
        }
    else:
        level = "Beginner"
        skill_level = "beginner"
        feedback = {
            "title": "Future Cyber Hero! 🌟",
            "message": "You're starting your cybersecurity journey!",
            "encouragement": "Every expert was once a beginner! 🎯"
        }
    
    # Generate personalized course using AI
    try:
        personalized_course = await generate_personalized_course_based_on_assessment(
            score, skill_level, answers, correct_quiz_answers
        )
    except Exception as e:
        print(f"AI course generation failed: {e}")
        # Fallback course generation
        personalized_course = generate_fallback_course(skill_level)
    
    return {
        "score": score,
        "level": level, 
        "feedback": feedback,
        "personalized_course": personalized_course
    }

async def generate_personalized_course_based_on_assessment(score, skill_level, answers, correct_answers):
    """Generate AI-powered personalized course based on assessment results"""
    
    # Analyze wrong answers to identify weak areas
    weak_areas = []
    strong_areas = []
    
    for answer in answers:
        question_id = answer.get("question_id")
        user_answer = answer.get("answer")
        
        if question_id in correct_answers:
            is_correct = user_answer == correct_answers[question_id]
            
            # Map questions to topics
            if question_id == 1:
                topic = "password_security"
            elif question_id == 2:
                topic = "phishing_detection"
            elif question_id == 3:
                topic = "privacy_protection"
            elif question_id == 4:
                topic = "stranger_safety"
            elif question_id == 5:
                topic = "network_security"
            elif question_id == 6:
                topic = "incident_response"
            else:
                continue
                
            if is_correct:
                strong_areas.append(topic)
            else:
                weak_areas.append(topic)
    
    # Generate AI course using the game controller
    from ai.challenge_generator import ChallengeGenerator
    ai_generator = ChallengeGenerator()
    
    course_data = ai_generator.generate_personalized_course(
        skill_level=skill_level,
        weak_areas=weak_areas,
        strong_areas=strong_areas,
        assessment_score=score
    )
    
    return course_data

def generate_fallback_course(skill_level):
    """Generate fallback course if AI fails"""
    
    courses = {
        "beginner": {
            "title": "🌟 Cyber Safety Basics Adventure",
            "description": "Start your cybersecurity journey with fun, easy-to-understand gaming modules!",
            "skill_level": "beginner",
            "modules": [
                {"name": "Password Heroes", "description": "Learn to create super-strong passwords", "icon": "🔐", "duration": "15 mins", "difficulty": "beginner"},
                {"name": "Phishing Detective", "description": "Spot fake emails and websites", "icon": "🕵️", "duration": "20 mins", "difficulty": "beginner"},
                {"name": "Privacy Guardian", "description": "Protect your personal information", "icon": "🛡️", "duration": "18 mins", "difficulty": "beginner"}
            ],
            "estimated_duration": "1 hour"
        },
        "intermediate": {
            "title": "🚀 Cyber Hero Training",
            "description": "Level up your skills with advanced gaming challenges!",
            "skill_level": "intermediate",
            "modules": [
                {"name": "Advanced Password Mastery", "description": "Master password security", "icon": "🔒", "duration": "25 mins", "difficulty": "intermediate"},
                {"name": "Social Media Safety", "description": "Navigate social platforms safely", "icon": "📱", "duration": "30 mins", "difficulty": "intermediate"},
                {"name": "Digital Footprints", "description": "Manage your online presence", "icon": "👣", "duration": "28 mins", "difficulty": "intermediate"}
            ],
            "estimated_duration": "1 hour 30 mins"
        },
        "advanced": {
            "title": "🏆 Cybersecurity Expert Path",
            "description": "Master advanced concepts with challenging gaming scenarios!",
            "skill_level": "advanced",
            "modules": [
                {"name": "Advanced Threat Detection", "description": "Identify sophisticated attacks", "icon": "🎯", "duration": "40 mins", "difficulty": "advanced"},
                {"name": "Incident Response Hero", "description": "Handle security incidents", "icon": "🚨", "duration": "45 mins", "difficulty": "advanced"},
                {"name": "Cybersecurity Leadership", "description": "Lead and teach others", "icon": "👑", "duration": "35 mins", "difficulty": "advanced"}
            ],
            "estimated_duration": "2 hours"
        }
    }
    
    return courses.get(skill_level, courses["beginner"])
