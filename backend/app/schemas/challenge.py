from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class TestCaseBase(BaseModel):
    input: str
    output: str
    is_hidden: bool = False

class TestCaseCreate(TestCaseBase):
    pass

class TestCase(TestCaseBase):
    id: str
    challenge_id: str

class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: Difficulty
    category: str
    points: int
    time_limit: int  # in seconds

class ChallengeCreate(ChallengeBase):
    test_cases: List[TestCaseCreate]

class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    category: Optional[str] = None
    points: Optional[int] = None
    time_limit: Optional[int] = None

class Challenge(ChallengeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    test_cases: List[TestCase] = []

class ChallengeResponse(ChallengeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    test_cases: List[TestCase] = []
    solved_by: int = 0
    completed: bool = False

class ChallengeWithTestCases(Challenge):
    test_cases: List[TestCase]

    class Config:
        from_attributes = True
