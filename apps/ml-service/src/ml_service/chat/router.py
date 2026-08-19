from fastapi import APIRouter, HTTPException

from ml_service.chat.schemas import ChatRequest, ChatResponse
from ml_service.chat.service import generate_reply
from ml_service.memory import store

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest) -> ChatResponse:
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")

    try:
        return generate_reply(request)
    except Exception as exc:  # keep the backend from getting an opaque 500
        raise HTTPException(status_code=502, detail=f"ml-service error: {exc}") from exc


@router.get("/memory/{student_id}")
async def get_memories(student_id: str) -> dict:
    """Inspection endpoint — everything currently remembered about a
    student. Useful for debugging/admin tooling, not called by the chat UI."""
    return {"student_id": student_id, "memories": store.all_memories(student_id)}
