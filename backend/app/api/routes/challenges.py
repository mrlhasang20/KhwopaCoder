from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.challenge import Challenge, ChallengeCreate, ChallengeUpdate, ChallengeResponse, TestCaseCreate
from app.auth.jwt import get_current_user
from app.db.database import get_db
import uuid

router = APIRouter()

@router.get("/", response_model=List[ChallengeResponse])
async def get_challenges():
    pool = await get_db()
    async with pool.acquire() as conn:
        challenges = await conn.fetch("""
            SELECT id, title, description, difficulty, category, points, time_limit, created_at, updated_at
            FROM challenges
            ORDER BY created_at DESC
        """)
        return [dict(challenge) for challenge in challenges]

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        challenge = await conn.fetchrow("""
            SELECT id, title, description, difficulty, category, points, time_limit, created_at, updated_at
            FROM challenges
            WHERE id = $1
        """, challenge_id)
        
        if not challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found"
            )
            
        return dict(challenge)

@router.post("/", response_model=ChallengeResponse)
async def create_challenge(
    challenge: ChallengeCreate,
    current_user = Depends(get_current_user)
):
    pool = await get_db()
    async with pool.acquire() as conn:
        challenge_id = str(uuid.uuid4())
        new_challenge = await conn.fetchrow("""
            INSERT INTO challenges (id, title, description, difficulty, category, points, time_limit)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, title, description, difficulty, category, points, time_limit, created_at, updated_at
        """, challenge_id, challenge.title, challenge.description, 
            challenge.difficulty, challenge.category, challenge.points, challenge.time_limit)
        
        return dict(new_challenge)

@router.post("/{challenge_id}/test-cases")
async def add_test_case(
    challenge_id: str,
    test_case: TestCaseCreate,
    current_user = Depends(get_current_user)
):
    pool = await get_db()
    async with pool.acquire() as conn:
        test_case_id = str(uuid.uuid4())
        new_test_case = await conn.fetchrow("""
            INSERT INTO test_cases (id, challenge_id, input, output, is_hidden)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, challenge_id, input, output, is_hidden
        """, test_case_id, challenge_id, test_case.input, 
            test_case.output, test_case.is_hidden)
        
        return dict(new_test_case)

@router.put("/{challenge_id}", response_model=Challenge)
async def update_challenge(challenge_id: str, challenge_update: ChallengeUpdate, current_user = Depends(get_current_user)):
    # TODO: Add admin check
    
    # Check if challenge exists
    pool = await get_db()
    async with pool.acquire() as conn:
        existing_challenge = await conn.fetchrow("""
            SELECT id, title, description, difficulty, category, points, time_limit, created_at, updated_at
            FROM challenges
            WHERE id = $1
        """, challenge_id)
        if not existing_challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found"
            )
    
    # Update challenge
    update_data = {k: v for k, v in challenge_update.dict().items() if v is not None}
    updated_challenge = await conn.fetchrow("""
        UPDATE challenges
        SET title = $1, description = $2, difficulty = $3, category = $4, points = $5, time_limit = $6
        WHERE id = $7
        RETURNING id, title, description, difficulty, category, points, time_limit, created_at, updated_at
    """, update_data['title'], update_data['description'], update_data['difficulty'], 
        update_data['category'], update_data['points'], update_data['time_limit'], challenge_id)
    
    return dict(updated_challenge)

@router.delete("/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_challenge(challenge_id: str, current_user = Depends(get_current_user)):
    # TODO: Add admin check
    
    # Check if challenge exists
    pool = await get_db()
    async with pool.acquire() as conn:
        existing_challenge = await conn.fetchrow("""
            SELECT id, title, description, difficulty, category, points, time_limit, created_at, updated_at
            FROM challenges
            WHERE id = $1
        """, challenge_id)
        if not existing_challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found"
            )
    
    # Delete challenge (will cascade delete test cases)
    await conn.execute("DELETE FROM challenges WHERE id = $1", challenge_id)
    
    return None

@router.get("/random", response_model=ChallengeResponse)
async def get_random_challenge(
    difficulty: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    # Build filter conditions
    where = {}
    if difficulty:
        where["difficulty"] = difficulty
    
    # Get a random challenge
    pool = await get_db()
    async with pool.acquire() as conn:
        challenges = await conn.fetch("""
            SELECT id, title, description, difficulty, category, points, time_limit, created_at, updated_at
            FROM challenges
            WHERE difficulty = $1
            ORDER BY random()
            LIMIT 1
        """, difficulty)
        
        if not challenges:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No challenges found"
            )
        
        challenge = dict(challenges[0])
    
    # Check if user has completed this challenge
    pool = await get_db()
    async with pool.acquire() as conn:
        completed = await conn.fetchrow("""
            SELECT id, status
            FROM submissions
            WHERE userId = $1 AND challengeId = $2
        """, current_user['id'], challenge['id'])
    
    # Count users who solved this challenge
    pool = await get_db()
    async with pool.acquire() as conn:
        solved_count = await conn.fetchval("""
            SELECT COUNT(DISTINCT userId)
            FROM submissions
            WHERE challengeId = $1 AND status = 'ACCEPTED'
        """, challenge['id'])
    
    # Filter out hidden test cases for non-admin users
    pool = await get_db()
    async with pool.acquire() as conn:
        test_cases = await conn.fetch("""
            SELECT id, input, output, is_hidden
            FROM test_cases
            WHERE challengeId = $1 AND is_hidden = FALSE
        """, challenge['id'])
    
    visible_test_cases = [dict(tc) for tc in test_cases]
    
    challenge_response = {
        **challenge,
        "testCases": visible_test_cases,
        "solvedBy": solved_count,
        "completed": completed is not None
    }
    
    return challenge_response
