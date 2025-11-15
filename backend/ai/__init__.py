"""AI package for game engine and challenge generation.

Exposes singleton instances for use across the backend so we avoid
re-initializing the Google GenAI client repeatedly.
"""

from .game_engine import GameEngine

# Global game engine instance; will gracefully fall back if GEMINI_API_KEY is missing
ai_engine = GameEngine()
