from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

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

class PowerUpPurchase(BaseModel):
    session_id: str
    power_up_id: str

class ChallengeRequest(BaseModel):
    player_id: int
    module_name: str
    difficulty: Optional[str] = "beginner"
    previous_performance: Optional[Dict[str, Any]] = {}

class ChallengeResponse(BaseModel):
    challenge_id: str
    module_id: str
    title: str
    ai_content: Dict[str, Any]
    game_mechanics: Optional[Dict[str, Any]] = None
    interactive_elements: Optional[Dict[str, Any]] = None
    module_info: Optional[Dict[str, Any]] = None
    difficulty: str
    timestamp: str

class ProgressUpdate(BaseModel):
    player_id: int
    module_name: str
    progress_percentage: float
    time_spent: int
    score: Optional[int] = None

class ModuleProgressResponse(BaseModel):
    module_name: str
    progress_percentage: float
    challenges_completed: int
    best_score: int
    time_spent: int
    last_played: datetime

class ModuleCompletion(BaseModel):
    session_id: str
    final_score: int
    achievements_earned: List[str]
