from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.db.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    pool = await get_db()
    async with pool.acquire() as conn:
        user = await conn.fetchrow(
            "SELECT id, email, name, batch, avatar, github, linkedin, points, solved, streak FROM users WHERE id = $1",
            user_id
        )
        if user is None:
            raise credentials_exception
        return dict(user)

# Add the missing functions for WebSocket authentication
def get_token_from_cookie(request: Request) -> Optional[str]:
    """Extract token from cookies in a request"""
    return request.cookies.get("token")

def get_token_from_query(token: str = None) -> Optional[str]:
    """Get token from query parameter"""
    return token

def decode_token(token: str) -> dict:
    """Decode a JWT token without validation"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return {}
