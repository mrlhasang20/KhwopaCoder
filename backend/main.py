from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.challenges.routes import router as challenges_router
from app.submissions.routes import router as submissions_router
from app.db.database import init_db, close_db
import asyncio
import signal

app = FastAPI(title="KhwopaCoder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(challenges_router, prefix="/challenges", tags=["challenges"])
app.include_router(submissions_router, prefix="/submissions", tags=["submissions"])

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# Handle graceful shutdown
def handle_exit(signum, frame):
    print("Shutting down gracefully...")
    asyncio.get_event_loop().stop()

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

@app.get("/")
async def root():
    return {"message": "Welcome to KhwopaCoder API"}