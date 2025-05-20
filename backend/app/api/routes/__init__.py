from fastapi import APIRouter
from app.api.routes import users, challenges, submissions, badges, activities, leaderboard

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(challenges.router, prefix="/challenges", tags=["Challenges"])
router.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
router.include_router(badges.router, prefix="/badges", tags=["Badges"])
router.include_router(activities.router, prefix="/activities", tags=["Activities"])
router.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
