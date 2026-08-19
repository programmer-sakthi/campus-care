from fastapi import APIRouter, HTTPException

from ml_service.checkins.schemas import CheckInRequest, CheckInResponse
from ml_service.checkins.service import analyse_check_in

router = APIRouter(prefix="/check-ins", tags=["check-ins"])


@router.post("/analyse", response_model=CheckInResponse)
async def analyse(request: CheckInRequest) -> CheckInResponse:
    try:
        return analyse_check_in(request)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"check-in analysis failed: {exc}") from exc
