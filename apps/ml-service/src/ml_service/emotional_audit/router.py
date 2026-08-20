from fastapi import APIRouter, HTTPException

from ml_service.emotional_audit.schemas import AuditRequest, AuditResponse
from ml_service.emotional_audit.service import analyse_audit

router = APIRouter(prefix="/emotional-audit", tags=["emotional-audit"])


@router.post("/analyse", response_model=AuditResponse)
async def analyse(request: AuditRequest) -> AuditResponse:
    try:
        return analyse_audit(request)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"emotional audit analysis failed: {exc}") from exc
