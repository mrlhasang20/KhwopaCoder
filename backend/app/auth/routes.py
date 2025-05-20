from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from app.core.config import settings
from app.schemas.auth import Token, UserCreate, UserLogin
from app.schemas.user import UserResponse
from app.auth.jwt import create_access_token, get_current_user
from app.db.database import get_db
import uuid
from pydantic import ValidationError
import traceback

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register", response_model=UserResponse)
async def register(request: Request, user_data: UserCreate):
    try:
        # Print raw request data for debugging
        raw_data = await request.json()
        print("\n=== RAW REQUEST DATA ===")
        print(raw_data)
        print("=======================")

        # Print validated data
        print("\n=== VALIDATED DATA ===")
        print("Email:", user_data.email)
        print("Name:", user_data.name)
        print("Batch:", user_data.batch)
        print("Password length:", len(user_data.password))
        print("GitHub:", user_data.github)
        print("LinkedIn:", user_data.linkedin)
        print("===================================")
        
        pool = await get_db()
        
        async with pool.acquire() as conn:
            # Check if user already exists
            existing_user = await conn.fetchrow(
                "SELECT id FROM users WHERE email = $1",
                user_data.email
            )
            
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Create new user
            hashed_password = get_password_hash(user_data.password)
            user_id = uuid.uuid4()
            
            try:
                # Insert user
                user = await conn.fetchrow("""
                    INSERT INTO users (id, email, name, password, batch, github, linkedin)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id, email, name, batch, avatar, github, linkedin, points, solved, streak, 
                             last_active, created_at, updated_at
                """, user_id, user_data.email, user_data.name, hashed_password, 
                    user_data.batch, user_data.github, user_data.linkedin)
                
                # Create default user settings
                await conn.execute("""
                    INSERT INTO user_settings (user_id)
                    VALUES ($1)
                """, user_id)
                
                # Convert the user data to a dictionary
                user_dict = dict(user)
                user_dict['id'] = str(user_dict['id'])
                
                print("=== Registration Success ===")
                print("User created successfully:", user_dict)
                print("=========================\n")
                
                return user_dict
                
            except Exception as db_error:
                print(f"\n=== Database Error ===")
                print(f"Error type: {type(db_error)}")
                print(f"Error message: {str(db_error)}")
                print(f"====================\n")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database error: {str(db_error)}"
                )
            
    except ValidationError as ve:
        print("\n=== VALIDATION ERROR DETAILS ===")
        print("Error type:", type(ve))
        print("Error message:", str(ve))
        print("Error details:", ve.errors())
        print("Full traceback:")
        print(traceback.format_exc())
        print("===============================")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": ve.errors()}
        )
    except Exception as e:
        print("\n=== UNEXPECTED ERROR ===")
        print("Error type:", type(e))
        print("Error message:", str(e))
        print("Full traceback:")
        print(traceback.format_exc())
        print("========================")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration error: {str(e)}"
        )

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        pool = await get_db()
        
        async with pool.acquire() as conn:
            # Find user by email
            user = await conn.fetchrow(
                "SELECT id, password FROM users WHERE email = $1",
                form_data.username
            )
            
            if not user or not verify_password(form_data.password, user['password']):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Create access token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user['id']}, expires_delta=access_token_expires
            )
            
            return {"access_token": access_token, "token_type": "bearer"}
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        print("=== BACKEND LOGIN START ===")
        print(f"1. Login attempt for email: {user_data.email}")
        
        pool = await get_db()
        
        async with pool.acquire() as conn:
            print("2. Checking user in database")
            user = await conn.fetchrow("""
                SELECT id, email, name, batch, avatar, github, linkedin, points, solved, streak,
                       last_active, created_at, updated_at
                FROM users 
                WHERE email = $1
            """, user_data.email)
            
            if not user:
                print("3. User not found")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            print("4. User found, verifying password")
            password_valid = await conn.fetchval(
                "SELECT password FROM users WHERE email = $1",
                user_data.email
            )
            
            if not verify_password(user_data.password, password_valid):
                print("5. Password verification failed")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            print("6. Password verified, creating token")
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": str(user['id'])}, expires_delta=access_token_expires
            )
            
            print("7. Updating last_active timestamp")
            await conn.execute("""
                UPDATE users 
                SET last_active = CURRENT_TIMESTAMP 
                WHERE id = $1
            """, user['id'])
            
            user_dict = dict(user)
            user_dict['id'] = str(user_dict['id'])
            
            print("8. Preparing response")
            response_data = {
                "access_token": access_token,
                "token_type": "bearer",
                "user": user_dict
            }
            print("9. Response data:", response_data)
            print("=== BACKEND LOGIN COMPLETE ===")
            
            return response_data
            
    except Exception as e:
        print("=== BACKEND LOGIN ERROR ===")
        print(f"Error: {str(e)}")
        print("Error type:", type(e))
        print("=== BACKEND LOGIN ERROR END ===")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user
