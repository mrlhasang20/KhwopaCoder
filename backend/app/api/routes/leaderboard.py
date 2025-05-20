from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.user import UserResponse
from app.auth.jwt import get_current_user
from app.db.database import get_db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_leaderboard():
    pool = await get_db()
    async with pool.acquire() as conn:
        users = await conn.fetch("""
            SELECT id, email, name, batch, avatar, github, linkedin, 
                   points, solved, streak, last_active, created_at, updated_at
            FROM users
            ORDER BY points DESC, solved DESC
            LIMIT 100
        """)
        return [dict(user) for user in users]

@router.get("/batch/{batch}", response_model=List[UserResponse])
async def get_batch_leaderboard(batch: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        users = await conn.fetch("""
            SELECT id, email, name, batch, avatar, github, linkedin, 
                   points, solved, streak, last_active, created_at, updated_at
            FROM users
            WHERE batch = $1
            ORDER BY points DESC, solved DESC
            LIMIT 100
        """, batch)
        return [dict(user) for user in users]

@router.get("/top", response_model=List[dict])
async def get_top_performers(
    limit: int = 3,
    current_user = Depends(get_current_user)
):
    # Get top users by points
    users = await prisma.user.find_many(
        order={"points": "desc"},
        take=limit
    )
    
    # Format response
    top_performers = []
    for i, user in enumerate(users):
        # Get badge count
        badge_count = await prisma.userbadge.count(where={"userId": user.id})
        
        top_performers.append({
            "id": user.id,
            "rank": i + 1,
            "name": user.name,
            "avatar": user.avatar,
            "batch": user.batch,
            "points": user.points,
            "solved": user.solved,
            "badges": badge_count,
            "github": user.github,
            "linkedin": user.linkedin
        })
    
    return top_performers

@router.get("/me", response_model=dict)
async def get_my_rank(
    period: Optional[str] = Query("overall", enum=["overall", "monthly", "weekly"]),
    current_user = Depends(get_current_user)
):
    # Get full leaderboard
    leaderboard = await get_leaderboard()
    
    # Find current user in leaderboard
    user_rank = None
    for entry in leaderboard:
        if entry["id"] == current_user.id:
            user_rank = entry
            break
    
    if not user_rank:
        # If user is not in leaderboard, create a default entry
        badge_count = await prisma.userbadge.count(where={"userId": current_user.id})
        
        user_rank = {
            "id": current_user.id,
            "rank": len(leaderboard) + 1,
            "name": current_user.name,
            "avatar": current_user.avatar,
            "batch": current_user.batch,
            "points": current_user.points,
            "solved": current_user.solved,
            "badges": badge_count,
            "github": current_user.github,
            "linkedin": current_user.linkedin
        }
    
    # Calculate percentile
    total_users = len(leaderboard)
    if total_users > 0:
        percentile = 100 - (user_rank["rank"] / total_users * 100)
    else:
        percentile = 100
    
    # Add percentile to response
    user_rank["percentile"] = round(percentile, 1)
    
    return user_rank
