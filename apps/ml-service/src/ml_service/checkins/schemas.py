from typing import Literal

from pydantic import BaseModel, Field


class MoodInput(BaseModel):
    time: Literal["morning", "evening", "night"]
    mood: Literal["very_happy", "happy", "neutral", "sad", "very_sad"]


class CheckInAnswers(BaseModel):
    sleepHours: float | None = Field(default=None, ge=0, le=24)
    happyMoment: str = Field(default="", max_length=2000)
    stressfulMoment: str = Field(default="", max_length=2000)
    waterIntake: Literal["yes", "no"] | None = None
    dailyReflection: str = Field(default="", max_length=4000)


class CheckInRequest(BaseModel):
    student_id: str
    moods: list[MoodInput] = Field(min_length=1, max_length=3)
    answers: CheckInAnswers


class CheckInResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    category: Literal["Excellent", "Good", "Needs Attention"]
    insights: list[str] = Field(min_length=1, max_length=3)
