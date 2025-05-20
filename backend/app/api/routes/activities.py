from fastapi import APIRouter, Depends
from typing import List
from app.schemas.activity import ActivityResponse
from app.auth.jwt import get_current_user
from app.db.database import get_db

router = APIRouter()

@router.get("/me", response_model=List[ActivityResponse])
async def get_my_activities(current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        activities = await conn.fetch("""
            SELECT id, user_id, type, title, description, metadata, created_at
            FROM activities
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        """, current_user['id'])
        return [dict(activity) for activity in activities]

@router.get("/recent", response_model=List[ActivityResponse])
async def get_recent_activities():
    pool = await get_db()
    async with pool.acquire() as conn:
        activities = await conn.fetch("""
            SELECT a.*, u.name as user_name
            FROM activities a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 20
        """)
        return [dict(activity) for activity in activities]
