from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.challenge import Challenge, ChallengeCreate, ChallengeWithTestCases
from app.db.database import get_db
from app.auth.jwt import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Challenge])
async def get_challenges(
    skip: int = 0,
    limit: int = 10,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            query = """
                SELECT id, title, description, difficulty, category, points, time_limit, 
                       created_at, updated_at
                FROM challenges
                WHERE 1=1
            """
            params = []
            
            if difficulty:
                query += " AND difficulty = $1"
                params.append(difficulty)
            
            if category:
                query += f" AND category = ${len(params) + 1}"
                params.append(category)
            
            query += " ORDER BY created_at DESC LIMIT $1 OFFSET $2"
            params.extend([limit, skip])
            
            challenges = await conn.fetch(query, *params)
            
            return [dict(challenge) for challenge in challenges]
            
    except Exception as e:
        print(f"Error fetching challenges: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching challenges"
        )

@router.get("/{challenge_id}", response_model=ChallengeWithTestCases)
async def get_challenge(
    challenge_id: str,
    current_user = Depends(get_current_user)
):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            # Get challenge details
            challenge = await conn.fetchrow("""
                SELECT id, title, description, difficulty, category, points, time_limit, 
                       created_at, updated_at
                FROM challenges
                WHERE id = $1
            """, challenge_id)
            
            if not challenge:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Challenge not found"
                )
            
            # Get test cases
            test_cases = await conn.fetch("""
                SELECT id, challenge_id, input, output, is_hidden
                FROM test_cases
                WHERE challenge_id = $1
            """, challenge_id)
            
            challenge_dict = dict(challenge)
            challenge_dict['test_cases'] = [dict(tc) for tc in test_cases]
            
            return challenge_dict
            
    except Exception as e:
        print(f"Error fetching challenge: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching challenge"
        )
