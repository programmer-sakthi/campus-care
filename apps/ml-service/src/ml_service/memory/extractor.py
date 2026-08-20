"""
After each chat turn, ask the LLM whether anything in it is worth
remembering long-term (name, recurring stressors, ongoing situations,
preferences) — as opposed to small talk, which shouldn't bloat memory.
"""

import json
import logging

from llama_index.core import Settings
from llama_index.core.llms import ChatMessage, MessageRole

logger = logging.getLogger("ml_service.memory.extractor")

_EXTRACTION_PROMPT = """You help a mental-health companion app remember durable, useful
facts about a student across conversations.

Given the latest exchange, extract 0-3 short standalone facts worth remembering
long-term. Good candidates: the student's name, recurring stressors or issues
(academic pressure, sleep, relationships, anxiety, etc.), ongoing situations,
stated preferences about how they like to be supported.

Do NOT extract: greetings, small talk, one-off venting with no recurring theme,
anything already obviously generic.

Respond with ONLY a JSON array of short strings (no markdown, no commentary).
Each string should read like a standalone note, e.g. "Prefers being called Alex"
or "Has been dealing with exam-related anxiety this semester". Return [] if
nothing is worth remembering.

Student: {user_message}
Companion: {assistant_message}

JSON array:"""


def extract_facts(user_message: str, assistant_message: str) -> list[str]:
    prompt = _EXTRACTION_PROMPT.format(
        user_message=user_message, assistant_message=assistant_message
    )

    try:
        response = Settings.llm.chat(
            [ChatMessage(role=MessageRole.USER, content=prompt)]
        )
        raw = str(response.message.content).strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        facts = json.loads(raw)
        if not isinstance(facts, list):
            return []
        return [f.strip() for f in facts if isinstance(f, str) and f.strip()]
    except Exception:
        # Extraction is a best-effort side channel — never let it break the
        # actual chat response.
        logger.exception("Memory extraction failed; skipping this turn")
        return []
