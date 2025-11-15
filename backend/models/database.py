from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberquest_game.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    anonymous_name = Column(String, index=True)  # For anonymous players
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

class ModuleProgress(Base):
    __tablename__ = "module_progress"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer)
    module_name = Column(String)
    progress_percentage = Column(Float, default=0.0)
    challenges_completed = Column(Integer, default=0)
    best_score = Column(Integer, default=0)
    time_spent = Column(Integer, default=0)  # in seconds
    last_played = Column(DateTime, default=datetime.utcnow)

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

# Create all tables
Base.metadata.create_all(bind=engine)
