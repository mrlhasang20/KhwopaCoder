from app.db.database import get_db
from datetime import datetime

async def create_activity(user_id: str, activity_type: str, title: str, description: str, metadata: dict = None):
    pool = await get_db()
    async with pool.acquire() as conn:
        activity = await conn.fetchrow("""
            INSERT INTO activities (user_id, type, title, description, metadata)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_id, type, title, description, metadata, created_at
        """, user_id, activity_type, title, description, metadata)
        return dict(activity)

async def get_user_activities(user_id: str, limit: int = 10):
    pool = await get_db()
    async with pool.acquire() as conn:
        activities = await conn.fetch("""
            SELECT id, user_id, type, title, description, metadata, created_at
            FROM activities
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        """, user_id, limit)
        return [dict(activity) for activity in activities]

async def get_recent_activities(limit: int = 20):
    pool = await get_db()
    async with pool.acquire() as conn:
        activities = await conn.fetch("""
            SELECT a.*, u.name as user_name
            FROM activities a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT $1
        """, limit)
        return [dict(activity) for activity in activities]

async def check_streak(user_id: str):
    """Check and update user's coding streak."""
    
    pool = await get_db()
    async with pool.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT streak, last_active
            FROM users
            WHERE id = $1
        """, user_id)
        
        if not user:
            return
        
        from datetime import datetime, timedelta
        
        # Get the user's last active date
        last_active = user['last_active']
        
        # Get current date
        now = datetime.now()
        
        # Check if the user was active yesterday
        yesterday = now.date() - timedelta(days=1)
        
        if last_active.date() == yesterday:
            # User was active yesterday, increment streak
            updated_user = await conn.fetchrow("""
                UPDATE users
                SET streak = $1 + 1
                WHERE id = $2
                RETURNING streak
            """, user['streak'], user_id)
            
            # Check if streak milestone reached
            new_streak = updated_user['streak']
            
            if new_streak in [7, 14, 30, 60, 90]:
                # Create streak milestone activity
                await create_activity(
                    user_id=user_id,
                    activity_type="STREAK",
                    title=f"{new_streak}-Day Coding Streak",
                    description=f"You've been coding for {new_streak} days in a row",
                    metadata={"streak": new_streak}
                )
        
        elif last_active.date() < yesterday:
            # User wasn't active yesterday, reset streak to 1
            await conn.execute("""
                UPDATE users
                SET streak = 1
                WHERE id = $1
            """, user_id)
