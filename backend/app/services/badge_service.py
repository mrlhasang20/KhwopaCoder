import json
from datetime import datetime, timedelta
from app.db.database import get_db
from app.services.activity_service import create_activity

async def check_badges_after_submission(user_id: str, challenge: dict):
    """Check if user has earned any badges after a submission."""
    
    # Get all badges
    badges = await get_db()
    async with badges.acquire() as conn:
        badges = await conn.fetch("""
            SELECT * FROM badges
        """)
    
    # Get user's earned badges
    user_badges = await get_user_badges(user_id)
    earned_badge_ids = {ub['id'] for ub in user_badges}
    
    # Get user data
    user = await get_db()
    async with user.acquire() as conn:
        user = await conn.fetchrow("""
            SELECT * FROM users
            WHERE id = $1
        """, user_id)
    
    # Check each badge
    for badge in badges:
        # Skip if already earned
        if badge['id'] in earned_badge_ids:
            continue
        
        try:
            criteria = json.loads(badge['criteria'])
            earned = await check_badge_criteria(user_id, criteria, user, challenge)
            
            if earned:
                # Award badge
                await award_badge(user_id, badge['id'])
                
                # Create activity
                await create_activity(
                    user_id=user_id,
                    type="BADGE_EARNED",
                    title=f"Earned '{badge['name']}' Badge",
                    description=badge['description'],
                    metadata={"badgeId": badge['id']}
                )
        except Exception as e:
            print(f"Error checking badge {badge['name']}: {str(e)}")

async def check_badge_criteria(user_id: str, criteria: dict, user: dict, current_challenge: dict = None) -> bool:
    """Check if user meets the criteria for a badge."""
    
    criteria_type = criteria.get("type")
    
    if criteria_type == "challenges_solved":
        # Check total challenges solved
        required_count = criteria.get("count", 1)
        count = await get_db()
        async with count.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED'
            """, user_id)
        return count >= required_count
    
    elif criteria_type == "category_challenges":
        # Check challenges solved in a specific category
        category = criteria.get("category")
        required_count = criteria.get("count", 1)
        count = await get_db()
        async with count.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED' AND challenge = $2
            """, user_id, category)
        return count >= required_count
    
    elif criteria_type == "streak":
        # Check user's streak
        required_days = criteria.get("days", 1)
        return user['streak'] >= required_days
    
    elif criteria_type == "difficulty_challenges":
        # Check challenges solved at a specific difficulty
        difficulty = criteria.get("difficulty")
        required_count = criteria.get("count", 1)
        count = await get_db()
        async with count.acquire() as conn:
            count = await conn.fetchval("""
                SELECT COUNT(DISTINCT challenge_id)
                FROM submissions
                WHERE user_id = $1 AND status = 'ACCEPTED' AND difficulty = $2
            """, user_id, difficulty)
        return count >= required_count
    
    elif criteria_type == "quick_solve":
        # Check if user solved a challenge quickly
        if not current_challenge:
            return False
        
        time_limit = criteria.get("seconds", 180)  # Default 3 minutes
        
        # Get the user's fastest submission for this challenge
        submission = await get_db()
        async with submission.acquire() as conn:
            submission = await conn.fetchrow("""
                SELECT runtime
                FROM submissions
                WHERE user_id = $1 AND challenge_id = $2 AND status = 'ACCEPTED'
                ORDER BY runtime ASC
                LIMIT 1
            """, user_id, current_challenge['id'])
        
        if submission and submission['runtime']:
            # Convert milliseconds to seconds
            runtime_seconds = submission['runtime'] / 1000
            return runtime_seconds <= time_limit
        
        return False
    
    # Default case
    return False

async def get_user_badges(user_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        badges = await conn.fetch("""
            SELECT b.*, ub.earned_at
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = $1
        """, user_id)
        return [dict(badge) for badge in badges]

async def award_badge(user_id: str, badge_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Check if user already has the badge
        existing = await conn.fetchrow("""
            SELECT id FROM user_badges
            WHERE user_id = $1 AND badge_id = $2
        """, user_id, badge_id)
        
        if existing:
            return dict(existing)
            
        # Award the badge
        badge = await conn.fetchrow("""
            INSERT INTO user_badges (user_id, badge_id)
            VALUES ($1, $2)
            RETURNING id, user_id, badge_id, earned_at
        """, user_id, badge_id)
        
        return dict(badge)

async def check_and_award_badges(user_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Get user stats
        user = await conn.fetchrow("""
            SELECT points, solved, streak
            FROM users
            WHERE id = $1
        """, user_id)
        
        # Get all badges
        badges = await conn.fetch("""
            SELECT * FROM badges
        """)
        
        awarded_badges = []
        for badge in badges:
            # Check if user meets badge criteria
            # This is a simplified example - you'll need to implement your own badge criteria logic
            if badge['criteria'] == 'first_solve' and user['solved'] == 1:
                awarded = await award_badge(user_id, badge['id'])
                awarded_badges.append(awarded)
            elif badge['criteria'] == 'streak_7' and user['streak'] >= 7:
                awarded = await award_badge(user_id, badge['id'])
                awarded_badges.append(awarded)
                
        return awarded_badges
