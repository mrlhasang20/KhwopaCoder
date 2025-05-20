from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.submission import Submission, SubmissionCreate, SubmissionResponse
from app.db.database import get_db
from app.auth.jwt import get_current_user
import uuid

router = APIRouter()

@router.post("/", response_model=SubmissionResponse)
async def create_submission(
    submission: SubmissionCreate,
    current_user = Depends(get_current_user)
):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            # Get challenge details
            challenge = await conn.fetchrow("""
                SELECT id, title, time_limit
                FROM challenges
                WHERE id = $1
            """, submission.challenge_id)
            
            if not challenge:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Challenge not found"
                )
            
            # Create submission
            submission_id = str(uuid.uuid4())
            submission_data = await conn.fetchrow("""
                INSERT INTO submissions (id, user_id, challenge_id, code, language, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, user_id, challenge_id, code, language, status, runtime, memory, created_at
            """, submission_id, current_user['id'], submission.challenge_id, 
                submission.code, submission.language, "ACCEPTED")
            
            # Get user details
            user = await conn.fetchrow("""
                SELECT name
                FROM users
                WHERE id = $1
            """, current_user['id'])
            
            # Prepare response
            response = dict(submission_data)
            response['challenge_title'] = challenge['title']
            response['user_name'] = user['name']
            
            # Update user stats if submission is accepted
            if response['status'] == "ACCEPTED":
                await conn.execute("""
                    UPDATE users
                    SET points = points + $1,
                        solved = solved + 1,
                        last_active = CURRENT_TIMESTAMP
                    WHERE id = $2
                """, challenge['points'], current_user['id'])
            
            return response
            
    except Exception as e:
        print(f"Error creating submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating submission"
        )

@router.get("/user/{user_id}", response_model=List[SubmissionResponse])
async def get_user_submissions(
    user_id: str,
    skip: int = 0,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            submissions = await conn.fetch("""
                SELECT s.id, s.user_id, s.challenge_id, s.code, s.language, s.status,
                       s.runtime, s.memory, s.created_at,
                       c.title as challenge_title,
                       u.name as user_name
                FROM submissions s
                JOIN challenges c ON s.challenge_id = c.id
                JOIN users u ON s.user_id = u.id
                WHERE s.user_id = $1
                ORDER BY s.created_at DESC
                LIMIT $2 OFFSET $3
            """, user_id, limit, skip)
            
            return [dict(submission) for submission in submissions]
            
    except Exception as e:
        print(f"Error fetching user submissions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching submissions"
        )

@router.get("/challenge/{challenge_id}", response_model=List[SubmissionResponse])
async def get_challenge_submissions(
    challenge_id: str,
    skip: int = 0,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            submissions = await conn.fetch("""
                SELECT s.id, s.user_id, s.challenge_id, s.code, s.language, s.status,
                       s.runtime, s.memory, s.created_at,
                       c.title as challenge_title,
                       u.name as user_name
                FROM submissions s
                JOIN challenges c ON s.challenge_id = c.id
                JOIN users u ON s.user_id = u.id
                WHERE s.challenge_id = $1
                ORDER BY s.created_at DESC
                LIMIT $2 OFFSET $3
            """, challenge_id, limit, skip)
            
            return [dict(submission) for submission in submissions]
            
    except Exception as e:
        print(f"Error fetching challenge submissions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching submissions"
        )
