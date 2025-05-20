from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    batch: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    batch: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None

class UserInDB(UserBase):
    id: str
    password: str
    points: int
    solved: int
    streak: int
    last_active: datetime
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    batch: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None
    points: int = 0
    solved: int = 0
    streak: int = 0
    last_active: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class UserSettings(BaseModel):
    email_notifications: bool
    achievement_notifications: bool
    weekly_digest: bool
    dark_mode: bool
    compact_view: bool

class UserSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    achievement_notifications: Optional[bool] = None
    weekly_digest: Optional[bool] = None
    dark_mode: Optional[bool] = None
    compact_view: Optional[bool] = None
