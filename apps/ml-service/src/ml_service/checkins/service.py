import json
import re

from llama_index.core import Settings

from ml_service.checkins.schemas import CheckInRequest, CheckInResponse
from ml_service.core.knowledge_base import retrieve
from ml_service.core.llm import configure_llm

_PROMPT = """You assess a student's *daily wellbeing check-in* for CampusCare.
This is a wellbeing reflection, never a diagnosis or clinical assessment. Use the
background reading only for gentle, practical suggestions. Return ONLY valid JSON
with this exact shape: {{"score": integer 0-100, "category": "Excellent"|"Good"|"Needs Attention", "insights": [1 to 3 concise supportive strings]}}.
The score reflects today's self-reported wellbeing; do not overstate certainty.

Check-in:
{check_in}

Relevant background reading:
{context}
"""


def _parse_response(text: str) -> CheckInResponse:
    # Some providers wrap otherwise-valid JSON in markdown fences.
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("The model did not return a JSON result")
    return CheckInResponse.model_validate(json.loads(match.group(0)))


def analyse_check_in(request: CheckInRequest) -> CheckInResponse:
    configure_llm()
    searchable_text = " ".join([
        *(m.mood.replace("_", " ") for m in request.moods),
        request.answers.happyMoment,
        request.answers.stressfulMoment,
        request.answers.dailyReflection,
    ]).strip()
    context = "\n\n".join(node.get_content() for node in retrieve(searchable_text))
    prompt = _PROMPT.format(check_in=request.model_dump_json(), context=context or "No specific background needed.")
    return _parse_response(str(Settings.llm.complete(prompt)).strip())
