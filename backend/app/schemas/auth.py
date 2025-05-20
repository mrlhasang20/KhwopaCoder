from pydantic import BaseModel, EmailStr
from typing import Optional

from app.models.database import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    batch: str
    github: Optional[str] = None
    linkedin: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
