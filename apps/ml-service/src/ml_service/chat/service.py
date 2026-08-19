import logging

from llama_index.core import Settings
from llama_index.core.llms import ChatMessage, MessageRole

from ml_service.chat.schemas import ChatRequest, ChatResponse
from ml_service.core.knowledge_base import get_retriever
from ml_service.core.llm import configure_llm
from ml_service.memory import extractor, store
from ml_service.safety.crisis import SUPPORT_NOTICE, RiskLevel, classify_risk

logger = logging.getLogger("ml_service.chat.service")

_SYSTEM_PROMPT = """You are Emora, a warm, non-judgmental AI mental health companion for
college students, built into the CampusCare platform.

- Keep replies concise and conversational (a few sentences), not a lecture.
- Validate feelings before offering perspective or suggestions.
- You are not a therapist and cannot diagnose. For anything serious or
  ongoing, gently encourage booking a session with a campus counsellor.
- Use the "What I remember about this student" section naturally, without
  announcing that you're reading from memory (never say "according to my
  notes").
- Use the "Relevant background reading" section only if it's actually
  relevant to what the student just said; otherwise ignore it.
"""


def _build_messages(request: ChatRequest, memories: list[str], kb_context: list[str], risk: RiskLevel) -> list[ChatMessage]:
    system_parts = [_SYSTEM_PROMPT]

    if memories:
        system_parts.append(
            "What I remember about this student:\n" + "\n".join(f"- {m}" for m in memories)
        )

    if kb_context:
        system_parts.append(
            "Relevant background reading (for grounding, don't quote directly):\n"
            + "\n\n".join(kb_context)
        )

    if risk in (RiskLevel.HIGH, RiskLevel.CRITICAL):
        system_parts.append(
            "IMPORTANT: this message shows signs of significant distress. Respond "
            "with extra care, and naturally encourage the student to talk to a "
            "campus counsellor or a crisis line — don't just move on to advice."
        )

    messages = [ChatMessage(role=MessageRole.SYSTEM, content="\n\n".join(system_parts))]

    for turn in request.history[-10:]:
        role = MessageRole.USER if turn.role == "user" else MessageRole.ASSISTANT
        messages.append(ChatMessage(role=role, content=turn.content))

    messages.append(ChatMessage(role=MessageRole.USER, content=request.message))
    return messages


def generate_reply(request: ChatRequest) -> ChatResponse:
    configure_llm()

    risk = classify_risk(request.message)

    memories = store.search_memory(request.student_id, request.message)
    kb_nodes = get_retriever().retrieve(request.message)
    kb_context = [n.get_content() for n in kb_nodes]

    messages = _build_messages(request, memories, kb_context, risk)
    response = Settings.llm.chat(messages)
    reply = str(response.message.content).strip()

    if risk in (RiskLevel.HIGH, RiskLevel.CRITICAL) and SUPPORT_NOTICE not in reply:
        reply += SUPPORT_NOTICE

    # Best-effort: pull out anything worth remembering long-term from this
    # turn and store it for next time. Never let this fail the request.
    try:
        for fact in extractor.extract_facts(request.message, reply):
            store.add_memory(request.student_id, fact)
    except Exception:
        logger.exception("Failed to persist extracted memories")

    return ChatResponse(
        reply=reply,
        risk_level=risk.value,
        memories_used=memories,
    )
