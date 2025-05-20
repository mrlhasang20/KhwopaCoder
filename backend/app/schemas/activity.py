from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ActivityType(str, Enum):
    CHALLENGE_COMPLETED = "CHALLENGE_COMPLETED"
    BADGE_EARNED = "BADGE_EARNED"
    RANK_UP = "RANK_UP"
    CHALLENGE_ATTEMPTED = "CHALLENGE_ATTEMPTED"
    STREAK = "STREAK"

class ActivityBase(BaseModel):
    user_id: str
    type: ActivityType
    title: str
    description: str
    metadata: Optional[str] = None  # JSON string with additional data

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: str
    created_at: datetime

class ActivityResponse(Activity):
    user_name: str
