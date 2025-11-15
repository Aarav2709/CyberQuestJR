from typing import Dict, List, Any, Optional
import json
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from models.database import GameSession, Player, Achievement, AIChallenge
from models.schemas import GameSessionCreate, ChallengeAnswer, ChallengeResult
from ai.game_engine import ai_engine
from modules.phishing_links import phishing_module

class GameController:
    def __init__(self):
        self.modules = {
            "phishing-links": phishing_module,
            # We can add more modules here later
        }
        
        self.achievements = {
            "first_challenge": {"title": "First Steps", "description": "Complete your first challenge", "icon": "👶", "xp": 50},
            "phishing_master": {"title": "Phishing Master", "description": "Complete all phishing challenges", "icon": "🎣", "xp": 200},
            "perfect_module": {"title": "Perfect Score", "description": "Complete a module without losing lives", "icon": "⭐", "xp": 150},
            "speed_runner": {"title": "Speed Runner", "description": "Complete 3 challenges in under 30 seconds each", "icon": "⚡", "xp": 100},
        }
    
    async def start_game_session(self, session_data: GameSessionCreate, db: Session) -> Dict[str, Any]:
        """Start a new game session"""
        
        # Check if player exists
        player = db.query(Player).filter(Player.id == session_data.player_id).first()
        if not player:
            raise ValueError("Player not found")
        
        # Check if module exists
        if session_data.module_name not in self.modules:
            raise ValueError(f"Module {session_data.module_name} not found")
        
        # Create new session
        session_id = str(uuid.uuid4())
        
        game_session = GameSession(
            session_id=session_id,
            player_id=session_data.player_id,
            module_name=session_data.module_name,
            current_challenge=0,
            score=0,
            lives=3,
            power_ups=json.dumps({}),
            session_data=json.dumps({"started_at": datetime.utcnow().isoformat()}),
            is_active=True
        )
        
        db.add(game_session)
        db.commit()
        
        # Generate first challenge
        first_challenge = await self.get_next_challenge(session_id, db)
        
        return {
            "session_id": session_id,
            "module_name": session_data.module_name,
            "current_challenge": first_challenge,
            "score": 0,
            "lives": 3,
            "power_ups": {},
            "message": f"Welcome to {self.modules[session_data.module_name].title}! 🎮"
        }
    
    async def get_next_challenge(self, session_id: str, db: Session) -> Dict[str, Any]:
        """Get the next challenge for a session"""
        
        session = db.query(GameSession).filter(GameSession.session_id == session_id).first()
        if not session or not session.is_active:
            raise ValueError("Invalid or inactive session")
        
        # Update challenge number
        session.current_challenge += 1
        
        # Generate challenge using AI
        player = db.query(Player).filter(Player.id == session.player_id).first()
        player_data = {
            "level": player.level,
            "experience": player.experience_points,
            "previous_scores": []  # We could track this later
        }
        
        # Determine difficulty based on player level and challenge number
        if player.level <= 2 or session.current_challenge <= 2:
            difficulty = "beginner"
        elif player.level <= 5 or session.current_challenge <= 4:
            difficulty = "intermediate"
        else:
            difficulty = "advanced"
        
        challenge = await ai_engine.generate_challenge(
            session.module_name, 
            difficulty, 
            session.current_challenge,
            player_data
        )
        
        # Store challenge in database for verification
        ai_challenge = AIChallenge(
            challenge_id=challenge["challenge_id"],
            module_name=session.module_name,
            difficulty=difficulty,
            challenge_data=json.dumps(challenge)
        )
        db.add(ai_challenge)
        
        db.commit()
        
        return challenge
    
    async def submit_answer(self, answer_data: ChallengeAnswer, db: Session) -> ChallengeResult:
        """Process a challenge answer"""
        
        session = db.query(GameSession).filter(GameSession.session_id == answer_data.session_id).first()
        if not session or not session.is_active:
            raise ValueError("Invalid or inactive session")
        
        # Get the current challenge data
        current_challenge = db.query(AIChallenge).filter(
            AIChallenge.module_name == session.module_name
        ).order_by(AIChallenge.created_at.desc()).first()
        
        if not current_challenge:
            raise ValueError("No active challenge found")
        
        challenge_data = json.loads(current_challenge.challenge_data)
        
        # Check if answer is correct
        is_correct = answer_data.answer == challenge_data["correct_answer"]
        
        # Calculate points
        base_points = challenge_data.get("points", 100)
        time_bonus = 0
        
        if answer_data.time_taken and answer_data.time_taken < 30:
            time_bonus = 25  # Speed bonus
        
        points_earned = base_points + time_bonus if is_correct else 0
        
        # Update session
        if is_correct:
            session.score += points_earned
        else:
            session.lives -= 1
        
        # Generate personalized feedback
        feedback = await ai_engine.generate_personalized_feedback(
            answer_data.answer,
            challenge_data["correct_answer"],
            challenge_data
        )
        
        # Check for achievements
        achievements_earned = await self._check_achievements(session, is_correct, answer_data.time_taken, db)
        
        # Check if game is completed or game over
        game_completed = False
        next_challenge = None
        
        if session.lives <= 0:
            session.is_active = False
            session.completed_at = datetime.utcnow()
            feedback += " Game Over! Don't worry, you learned a lot! 🌟"
        elif session.current_challenge >= 5:  # Module completed
            session.is_active = False
            session.completed_at = datetime.utcnow()
            game_completed = True
            
            # Award completion achievements
            await self._award_completion_achievements(session, db)
            
            feedback += " 🎉 Module completed! You're a cybersecurity hero!"
        else:
            # Generate next challenge
            try:
                next_challenge = await self.get_next_challenge(answer_data.session_id, db)
            except:
                pass  # Handle gracefully
        
        db.commit()
        
        return ChallengeResult(
            correct=is_correct,
            points_earned=points_earned,
            new_score=session.score,
            lives_remaining=session.lives,
            feedback=feedback,
            next_challenge=next_challenge,
            game_completed=game_completed
        )
    
    async def _check_achievements(self, session: GameSession, is_correct: bool, time_taken: Optional[float], db: Session) -> List[str]:
        """Check and award achievements"""
        
        achievements_earned = []
        player = db.query(Player).filter(Player.id == session.player_id).first()
        
        # First challenge achievement
        if session.current_challenge == 1 and is_correct:
            existing = db.query(Achievement).filter(
                Achievement.player_id == player.id,
                Achievement.achievement_type == "first_challenge"
            ).first()
            
            if not existing:
                achievement = Achievement(
                    player_id=player.id,
                    achievement_type="first_challenge",
                    title=self.achievements["first_challenge"]["title"],
                    description=self.achievements["first_challenge"]["description"],
                    icon=self.achievements["first_challenge"]["icon"]
                )
                db.add(achievement)
                
                # Award XP
                player.experience_points += self.achievements["first_challenge"]["xp"]
                achievements_earned.append("first_challenge")
        
        # Speed runner achievement
        if is_correct and time_taken and time_taken < 30:
            # Check how many speed challenges they've completed
            session_data = json.loads(session.session_data or "{}")
            speed_count = session_data.get("speed_challenges", 0) + 1
            session_data["speed_challenges"] = speed_count
            session.session_data = json.dumps(session_data)
            
            if speed_count >= 3:
                existing = db.query(Achievement).filter(
                    Achievement.player_id == player.id,
                    Achievement.achievement_type == "speed_runner"
                ).first()
                
                if not existing:
                    achievement = Achievement(
                        player_id=player.id,
                        achievement_type="speed_runner",
                        title=self.achievements["speed_runner"]["title"],
                        description=self.achievements["speed_runner"]["description"],
                        icon=self.achievements["speed_runner"]["icon"]
                    )
                    db.add(achievement)
                    player.experience_points += self.achievements["speed_runner"]["xp"]
                    achievements_earned.append("speed_runner")
        
        return achievements_earned
    
    async def _award_completion_achievements(self, session: GameSession, db: Session):
        """Award achievements for completing a module"""
        
        player = db.query(Player).filter(Player.id == session.player_id).first()
        
        # Module-specific achievements
        if session.module_name == "phishing-links":
            existing = db.query(Achievement).filter(
                Achievement.player_id == player.id,
                Achievement.achievement_type == "phishing_master"
            ).first()
            
            if not existing:
                achievement = Achievement(
                    player_id=player.id,
                    achievement_type="phishing_master",
                    title=self.achievements["phishing_master"]["title"],
                    description=self.achievements["phishing_master"]["description"],
                    icon=self.achievements["phishing_master"]["icon"]
                )
                db.add(achievement)
                player.experience_points += self.achievements["phishing_master"]["xp"]
        
        # Perfect score achievement
        if session.lives == 3:  # Didn't lose any lives
            existing = db.query(Achievement).filter(
                Achievement.player_id == player.id,
                Achievement.achievement_type == "perfect_module"
            ).first()
            
            if not existing:
                achievement = Achievement(
                    player_id=player.id,
                    achievement_type="perfect_module",
                    title=self.achievements["perfect_module"]["title"],
                    description=self.achievements["perfect_module"]["description"],
                    icon=self.achievements["perfect_module"]["icon"]
                )
                db.add(achievement)
                player.experience_points += self.achievements["perfect_module"]["xp"]
        
        # Update player level based on XP
        new_level = (player.experience_points // 1000) + 1
        if new_level > player.level:
            player.level = new_level
            player.coins += 100  # Level up bonus
    
    def get_available_modules(self, player_level: int) -> List[Dict[str, Any]]:
        """Get list of available modules for a player"""
        
        modules = []
        
        # Phishing Links - Available from level 1
        if player_level >= 1:
            modules.append({
                "name": "phishing-links",
                "title": "🎣 Phishing Links Detective",
                "description": "Learn to spot dangerous links and fake websites",
                "icon": "🔍",
                "difficulty": "beginner",
                "estimated_time": "15-20 minutes",
                "required_level": 1,
                "unlock_cost": 0,
                "unlocked": True
            })
        
        # More modules can be added here...
        
        return modules
    
    async def get_module_content(self, module_name: str) -> Dict[str, Any]:
        """Get educational content for a module"""
        
        if module_name not in self.modules:
            raise ValueError(f"Module {module_name} not found")
        
        module = self.modules[module_name]
        
        if hasattr(module, 'get_learning_content'):
            return module.get_learning_content()
        else:
            return {
                "title": module.title,
                "description": module.description,
                "content": "Educational content coming soon!"
            }

# Global game controller instance
game_controller = GameController()
