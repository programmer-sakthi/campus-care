from typing import Literal

from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    student_id: str = Field(..., description="The student's regNo — used to scope long-term memory")
    message: str
    # Recent turns from the backend's own DB, oldest first. Keeping the
    # backend as the source of truth for chat history means ml-service stays
    # stateless between requests.
    history: list[ChatTurn] = []


class ChatResponse(BaseModel):
    reply: str
    risk_level: Literal["none", "low", "medium", "high", "critical"]
    memories_used: list[str] = []
