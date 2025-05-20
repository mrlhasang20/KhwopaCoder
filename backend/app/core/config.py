from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Get the absolute path to the backend directory
BACKEND_DIR = Path(__file__).parent.parent.parent

# Load environment variables from .env file
load_dotenv(dotenv_path=BACKEND_DIR / '.env')

# Add this after loading the environment variables
print(f"Database URL: {os.getenv('DATABASE_URL')}")

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Khwopacoder"
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    DIRECT_URL: Optional[str] = os.getenv("DIRECT_URL")
    
    # WebSocket
    WEBSOCKET_URL: str = os.getenv("WEBSOCKET_URL", "ws://localhost:8000/ws")
    
    class Config:
        env_file = BACKEND_DIR / '.env'
        case_sensitive = True

settings = Settings()
