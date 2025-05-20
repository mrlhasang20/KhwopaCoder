from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserResponse
from app.db.database import get_db
from app.auth.jwt import get_current_user

router = APIRouter()

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user = Depends(get_current_user)):
    try:
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
            
            # Convert the user data to a dictionary
            user_dict = dict(user)
            
            # Convert UUID to string for the response
            user_dict['id'] = str(user_dict['id'])
            
            return user_dict
            
    except Exception as e:
        print(f"Error fetching user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching user details"
        )
