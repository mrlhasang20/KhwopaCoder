from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str
    batch: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    points: int
    solved: int
    streak: int
    last_active: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
