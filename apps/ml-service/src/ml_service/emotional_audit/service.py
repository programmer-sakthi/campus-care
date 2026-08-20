"""
Turns the backend's deterministic domain scores into grounded, supportive
language for the student's periodic Emotional Audit result screen.

Important: this module is only ever called for *non-crisis* submissions.
When a student flags a Section G safety question, the backend short-circuits
before this module is reached and returns a static, non-LLM response instead
(see `emotional-audit.router.ts`). Never route safety-critical responses
through free-form generation.
"""

import json
import re

from llama_index.core import Settings

from ml_service.core.knowledge_base import retrieve
from ml_service.core.llm import configure_llm
from ml_service.emotional_audit.schemas import AuditRequest, AuditResponse

_PROMPT = """You are helping summarise the result of a student's periodic *Emotional
Audit* on CampusCare — a structured wellbeing screening, never a diagnosis or
clinical assessment. You are given per-domain concern scores (0-100, higher
means more concern) already computed from the student's own answers. Do not
invent new scores or contradict them.

Write a short, warm, non-alarmist summary and 2-4 concrete, practical
recommendations grounded in the background reading below. Prioritise the
domains with the highest concern scores, but don't ignore the rest. Never
mention self-harm, suicide, or crisis lines here — that is handled
separately.

Return ONLY valid JSON with this exact shape:
{{"summary": "1-3 sentence supportive overview", "recommendations": [2 to 4 short, concrete strings], "focus_domains": [0 to 3 domain ids from the input worth the student's attention]}}

Audit result:
{audit}

Relevant background reading:
{context}
"""


def _parse_response(text: str) -> AuditResponse:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("The model did not return a JSON result")
    return AuditResponse.model_validate(json.loads(match.group(0)))


def analyse_audit(request: AuditRequest) -> AuditResponse:
    configure_llm()

    # Ground retrieval in whichever domains are actually concerning, so the
    # background reading picked isn't diluted by domains that are fine.
    concerning = sorted(request.domain_scores, key=lambda d: d.score, reverse=True)
    searchable_text = " ".join(f"{d.label} {d.level}" for d in concerning[:3])
    context = "\n\n".join(node.get_content() for node in retrieve(searchable_text))

    prompt = _PROMPT.format(
        audit=request.model_dump_json(),
        context=context or "No specific background needed.",
    )
    return _parse_response(str(Settings.llm.complete(prompt)).strip())
