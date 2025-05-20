from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.user import UserResponse, UserUpdate, UserSettings, UserSettingsUpdate
from app.auth.jwt import get_current_user
from app.db.database import get_db

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users():
    pool = await get_db()
    async with pool.acquire() as conn:
        users = await conn.fetch("""
            SELECT id, email, name, batch, avatar, github, linkedin, points, solved, streak, 
                   last_active, created_at, updated_at
            FROM users
        """)
        return [dict(user) for user in users]

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT id, email, name, batch, avatar, github, linkedin, points, solved, streak, 
                   last_active, created_at, updated_at
            FROM users
            WHERE id = $1
        """, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return dict(user)

@router.put("/me", response_model=UserResponse)
async def update_user(user_update: UserUpdate, current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        param_count = 1
        
        if user_update.name is not None:
            update_fields.append(f"name = ${param_count}")
            params.append(user_update.name)
            param_count += 1
        if user_update.batch is not None:
            update_fields.append(f"batch = ${param_count}")
            params.append(user_update.batch)
            param_count += 1
        if user_update.github is not None:
            update_fields.append(f"github = ${param_count}")
            params.append(user_update.github)
            param_count += 1
        if user_update.linkedin is not None:
            update_fields.append(f"linkedin = ${param_count}")
            params.append(user_update.linkedin)
            param_count += 1
        if user_update.avatar is not None:
            update_fields.append(f"avatar = ${param_count}")
            params.append(user_update.avatar)
            param_count += 1
            
        if not update_fields:
            return current_user
            
        query = f"""
            UPDATE users
            SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${param_count}
            RETURNING id, email, name, batch, avatar, github, linkedin, points, solved, streak, 
                     last_active, created_at, updated_at
        """
        params.append(current_user['id'])
        
        updated_user = await conn.fetchrow(query, *params)
        return dict(updated_user)

@router.get("/me/settings", response_model=UserSettings)
async def get_user_settings(current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        settings = await conn.fetchrow("""
            SELECT id, user_id, email_notifications, achievement_notifications, 
                   weekly_digest, dark_mode, compact_view
            FROM user_settings
            WHERE user_id = $1
        """, current_user['id'])
        
        if not settings:
            # Create default settings
            settings = await conn.fetchrow("""
                INSERT INTO user_settings (user_id)
                VALUES ($1)
                RETURNING id, user_id, email_notifications, achievement_notifications, 
                         weekly_digest, dark_mode, compact_view
            """, current_user['id'])
            
        return dict(settings)

@router.put("/me/settings", response_model=UserSettings)
async def update_user_settings(settings_update: UserSettingsUpdate, current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Build update query dynamically based on provided fields
        update_fields = []
        params = []
        param_count = 1
        
        if settings_update.email_notifications is not None:
            update_fields.append(f"email_notifications = ${param_count}")
            params.append(settings_update.email_notifications)
            param_count += 1
        if settings_update.achievement_notifications is not None:
            update_fields.append(f"achievement_notifications = ${param_count}")
            params.append(settings_update.achievement_notifications)
            param_count += 1
        if settings_update.weekly_digest is not None:
            update_fields.append(f"weekly_digest = ${param_count}")
            params.append(settings_update.weekly_digest)
            param_count += 1
        if settings_update.dark_mode is not None:
            update_fields.append(f"dark_mode = ${param_count}")
            params.append(settings_update.dark_mode)
            param_count += 1
        if settings_update.compact_view is not None:
            update_fields.append(f"compact_view = ${param_count}")
            params.append(settings_update.compact_view)
            param_count += 1
            
        if not update_fields:
            # If no fields to update, return current settings
            settings = await conn.fetchrow("""
                SELECT id, user_id, email_notifications, achievement_notifications, 
                       weekly_digest, dark_mode, compact_view
                FROM user_settings
                WHERE user_id = $1
            """, current_user['id'])
            return dict(settings)
            
        query = f"""
            UPDATE user_settings
            SET {', '.join(update_fields)}
            WHERE user_id = ${param_count}
            RETURNING id, user_id, email_notifications, achievement_notifications, 
                     weekly_digest, dark_mode, compact_view
        """
        params.append(current_user['id'])
        
        updated_settings = await conn.fetchrow(query, *params)
        return dict(updated_settings)
