from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: Difficulty
    category: str
    points: int
    time_limit: int

class ChallengeCreate(ChallengeBase):
    pass

class Challenge(ChallengeBase):
    id: str
    created_at: datetime
    updated_at: datetime

class TestCase(BaseModel):
    id: str
    challenge_id: str
    input: str
    output: str
    is_hidden: bool

class ChallengeWithTestCases(Challenge):
    test_cases: List[TestCase]
