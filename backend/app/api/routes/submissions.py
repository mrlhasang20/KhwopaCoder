from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.submission import Submission, SubmissionCreate, SubmissionResponse
from app.auth.jwt import get_current_user
from app.db.database import get_db
from app.services.code_execution import execute_code
from app.services.badge_service import check_badges_after_submission
from app.services.activity_service import create_activity
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/", response_model=List[SubmissionResponse])
async def get_submissions(
    user_id: Optional[str] = None,
    challenge_id: Optional[str] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    # Build filter conditions
    where = {}
    if user_id:
        where["userId"] = user_id
    if challenge_id:
        where["challengeId"] = challenge_id
    if status:
        where["status"] = status
    
    # Get submissions
    pool = await get_db()
    async with pool.acquire() as conn:
        submissions = await conn.fetch("""
            SELECT id, user_id, challenge_id, code, language, status, runtime, memory, created_at
            FROM submissions
            WHERE user_id = $1 AND challenge_id = $2 AND status = $3
            ORDER BY created_at DESC
        """, current_user['id'], challenge_id, status)
    
    # Format response
    submission_responses = []
    for sub in submissions:
        submission_responses.append({
            **sub,
            "challengeTitle": sub["challengeId"],
            "challengeDifficulty": "Unknown",
            "userName": sub["userId"]
        })
    
    return submission_responses

@router.get("/me", response_model=List[SubmissionResponse])
async def get_my_submissions(
    challenge_id: Optional[str] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    # Build filter conditions
    where = {"userId": current_user.id}
    if challenge_id:
        where["challengeId"] = challenge_id
    if status:
        where["status"] = status
    
    # Get submissions
    pool = await get_db()
    async with pool.acquire() as conn:
        submissions = await conn.fetch("""
            SELECT id, user_id, challenge_id, code, language, status, runtime, memory, created_at
            FROM submissions
            WHERE user_id = $1 AND challenge_id = $2 AND status = $3
            ORDER BY created_at DESC
        """, current_user['id'], challenge_id, status)
    
    # Format response
    submission_responses = []
    for sub in submissions:
        submission_responses.append({
            **sub,
            "challengeTitle": sub["challengeId"],
            "challengeDifficulty": "Unknown",
            "userName": sub["userId"]
        })
    
    return submission_responses

@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: str, current_user = Depends(get_current_user)):
    pool = await get_db()
    async with pool.acquire() as conn:
        submission = await conn.fetchrow("""
            SELECT id, user_id, challenge_id, code, language, status, runtime, memory, created_at
            FROM submissions
            WHERE id = $1 AND user_id = $2
        """, submission_id, current_user['id'])
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found"
            )
        
        # Check if user is authorized to view this submission
        if submission["userId"] != current_user.id:
            # TODO: Add admin check
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this submission"
            )
        
        submission_response = {
            **submission,
            "challengeTitle": submission["challengeId"],
            "challengeDifficulty": "Unknown",
            "userName": submission["userId"]
        }
        
        return submission_response

@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    submission: SubmissionCreate,
    current_user = Depends(get_current_user)
):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Get challenge
        challenge = await conn.fetchrow("""
            SELECT id, title, difficulty, points, time_limit
            FROM challenges
            WHERE id = $1
        """, submission.challenge_id)
        
        if not challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found"
            )
        
        # Execute code against test cases
        execution_result = await execute_code(
            code=submission.code,
            language=submission.language,
            test_cases=challenge["testCases"],
            time_limit=challenge["time_limit"]
        )
        
        # Create submission
        submission_id = str(uuid.uuid4())
        new_submission = await conn.fetchrow("""
            INSERT INTO submissions (id, user_id, challenge_id, code, language, status, runtime, memory)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, user_id, challenge_id, code, language, status, runtime, memory, created_at
        """, submission_id, current_user['id'], submission.challenge_id, 
            submission.code, submission.language, execution_result["status"], 
            execution_result.get("runtime"), execution_result.get("memory"))
        
        # If submission is accepted, update user stats and broadcast
        if execution_result["status"] == "ACCEPTED":
            # Check if this is the first time the user has solved this challenge
            previous_accepted = await conn.fetchrow("""
                SELECT id
                FROM submissions
                WHERE user_id = $1 AND challenge_id = $2 AND status = $3 AND id != $4
            """, current_user['id'], submission.challenge_id, "ACCEPTED", new_submission["id"])
            
            if not previous_accepted:
                # Update user stats
                await conn.execute("""
                    UPDATE users
                    SET points = points + $1, solved = solved + 1
                    WHERE id = $2
                """, challenge["points"], current_user['id'])
                
                # Create activity
                await create_activity(
                    user_id=current_user['id'],
                    type="CHALLENGE_COMPLETED",
                    title=f"Completed '{challenge['title']}' Challenge",
                    description=f"You solved the challenge in {execution_result.get('runtime', 0) / 1000:.2f} seconds",
                    metadata={"challengeId": challenge["id"], "points": challenge["points"]}
                )
                
                # Check for badges
                await check_badges_after_submission(current_user['id'], challenge)
            
            # Broadcast submission to challenge topic
            await conn.execute("""
                INSERT INTO activities (user_id, type, title, description, metadata)
                VALUES ($1, $2, $3, $4, $5)
            """, current_user['id'], "new_submission", f"Completed '{challenge['title']}' Challenge", 
                f"You solved the challenge in {execution_result.get('runtime', 0) / 1000:.2f} seconds", 
                json.dumps({"challengeId": challenge["id"], "points": challenge["points"]}))
        else:
            # Create activity for attempt
            await create_activity(
                user_id=current_user['id'],
                type="CHALLENGE_ATTEMPTED",
                title=f"Attempted '{challenge['title']}' Challenge",
                description=f"You've made progress but haven't completed it yet",
                metadata={"challengeId": challenge["id"], "status": execution_result["status"]}
            )
        
        # Update user's last active timestamp
        await conn.execute("""
            UPDATE users
            SET last_active = $1
            WHERE id = $2
        """, datetime.now(), current_user['id'])
        
        submission_response = {
            **new_submission,
            "challengeTitle": challenge["title"],
            "challengeDifficulty": challenge["difficulty"],
            "userName": current_user['id']
        }
        
        return submission_response

@router.get("/challenge/{challenge_id}", response_model=List[SubmissionResponse])
async def get_challenge_submissions(
    challenge_id: str,
    current_user = Depends(get_current_user)
):
    pool = await get_db()
    async with pool.acquire() as conn:
        submissions = await conn.fetch("""
            SELECT id, user_id, challenge_id, code, language, status, runtime, memory, created_at
            FROM submissions
            WHERE challenge_id = $1 AND user_id = $2
            ORDER BY created_at DESC
        """, challenge_id, current_user['id'])
        return [dict(submission) for submission in submissions]
