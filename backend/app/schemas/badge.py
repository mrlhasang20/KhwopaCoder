from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BadgeBase(BaseModel):
    name: str
    description: str
    icon: str
    color: str
    criteria: str  # JSON string describing how to earn the badge

class BadgeCreate(BadgeBase):
    pass

class BadgeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    criteria: Optional[str] = None

class Badge(BadgeBase):
    id: str

class BadgeResponse(Badge):
    pass

class UserBadge(BaseModel):
    id: str
    user_id: str
    badge_id: str
    earned_at: datetime

class BadgeWithProgress(Badge):
    earned: bool = False
    earned_at: Optional[datetime] = None
    progress: Optional[int] = None
    total: Optional[int] = None
