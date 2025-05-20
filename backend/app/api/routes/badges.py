from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.badge import BadgeResponse
from app.auth.jwt import get_current_user
from app.db.database import get_db

router = APIRouter()

@router.get("/", response_model=List[BadgeResponse])
async def get_badges():
    pool = await get_db()
    async with pool.acquire() as conn:
        badges = await conn.fetch("""
            SELECT id, name, description, icon, color, criteria
            FROM badges
        """)
        return [dict(badge) for badge in badges]

@router.get("/me", response_model=List[BadgeResponse])
async def get_my_badges(current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        badges = await conn.fetch("""
            SELECT b.*, ub.earned_at
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = $1
        """, current_user['id'])
        return [dict(badge) for badge in badges]

@router.post("/", response_model=BadgeResponse, status_code=status.HTTP_201_CREATED)
async def create_badge(badge: BadgeResponse, current_user = Depends(get_current_user)):
    # TODO: Add admin check
    
    # Create badge
    pool = await get_db()
    async with pool.acquire() as conn:
        new_badge = await conn.fetchrow("""
            INSERT INTO badges (name, description, icon, color, criteria)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, description, icon, color, criteria
        """, badge.name, badge.description, badge.icon, badge.color, badge.criteria)
        return dict(new_badge)

@router.put("/{badge_id}", response_model=BadgeResponse)
async def update_badge(badge_id: str, badge_update: BadgeResponse, current_user = Depends(get_current_user)):
    # TODO: Add admin check
    
    # Check if badge exists
    pool = await get_db()
    async with pool.acquire() as conn:
        existing_badge = await conn.fetchrow("""
            SELECT id, name, description, icon, color, criteria
            FROM badges
            WHERE id = $1
        """, badge_id)
        if not existing_badge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Badge not found"
            )
    
    # Update badge
    updated_badge = await conn.fetchrow("""
        UPDATE badges
        SET name = $1, description = $2, icon = $3, color = $4, criteria = $5
        WHERE id = $6
        RETURNING id, name, description, icon, color, criteria
    """, badge_update.name, badge_update.description, badge_update.icon, badge_update.color, badge_update.criteria, badge_id)
    
    return dict(updated_badge)

@router.delete("/{badge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_badge(badge_id: str, current_user = Depends(get_current_user)):
    # TODO: Add admin check
    
    # Check if badge exists
    pool = await get_db()
    async with pool.acquire() as conn:
        existing_badge = await conn.fetchrow("""
            SELECT id
            FROM badges
            WHERE id = $1
        """, badge_id)
        if not existing_badge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Badge not found"
            )
    
    # Delete badge
    await conn.execute("""
        DELETE FROM badges
        WHERE id = $1
    """, badge_id)
    
    return None

async def calculate_badge_progress(user_id: str, criteria: dict):
    """Calculate progress towards earning a badge based on criteria."""
    criteria_type = criteria.get("type")
    
    if criteria_type == "challenges_solved":
        # Count total challenges solved
        pool = await get_db()
        async with pool.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED'
            """, user_id)
            return count, criteria.get("count", 1)
    
    elif criteria_type == "category_challenges":
        # Count challenges solved in a specific category
        category = criteria.get("category")
        pool = await get_db()
        async with pool.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED' AND challenge = $2
            """, user_id, category)
            return count, criteria.get("count", 1)
    
    elif criteria_type == "streak":
        # Get user's current streak
        pool = await get_db()
        async with pool.acquire() as conn:
            user = await conn.fetchrow("""
                SELECT streak
                FROM users
                WHERE id = $1
            """, user_id)
            return user['streak'], criteria.get("days", 1)
    
    elif criteria_type == "difficulty_challenges":
        # Count challenges solved at a specific difficulty
        difficulty = criteria.get("difficulty")
        pool = await get_db()
        async with pool.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED' AND challenge = $2
            """, user_id, difficulty)
            return count, criteria.get("count", 1)
    
    # Default case
    return 0, 1
