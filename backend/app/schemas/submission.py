from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class Status(str, Enum):
    ACCEPTED = "ACCEPTED"
    WRONG_ANSWER = "WRONG_ANSWER"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    COMPILATION_ERROR = "COMPILATION_ERROR"

class SubmissionBase(BaseModel):
    challenge_id: str
    code: str
    language: str

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: str
    user_id: str
    status: Status
    runtime: Optional[int] = None  # in milliseconds
    memory: Optional[int] = None  # in KB
    created_at: datetime

class SubmissionResponse(Submission):
    challenge_title: str
    user_name: str

    class Config:
        from_attributes = True
