from typing import Literal

from pydantic import BaseModel, Field

ConcernLevel = Literal["low", "moderate", "high"]


class DomainScoreInput(BaseModel):
    domain: str
    label: str
    # 0-100, higher = more concern. Computed deterministically by the
    # backend from the raw answers — ml-service never re-derives this from
    # free text, it only explains it.
    score: int = Field(ge=0, le=100)
    level: ConcernLevel


class AuditRequest(BaseModel):
    student_id: str
    domain_scores: list[DomainScoreInput] = Field(min_length=1)
    overall_score: int = Field(ge=0, le=100)
    overall_category: ConcernLevel


class AuditResponse(BaseModel):
    summary: str = Field(max_length=600)
    recommendations: list[str] = Field(min_length=2, max_length=5)
    focus_domains: list[str] = Field(default_factory=list, max_length=3)
