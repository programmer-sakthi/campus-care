"""
Lightweight, best-effort risk flagging for incoming student messages.

This is NOT a diagnostic tool. It exists purely to:
  1. decide whether the companion's reply should gently surface campus
     crisis/counsellor resources, and
  2. tag the stored message with a risk level so counsellors/admins can
     see a pattern if a student needs proactive outreach (see
     `ChatbotMessage.riskLevel` in the Prisma schema).

Keep this simple and conservative: prefer over-flagging (a false positive
just means a caring nudge gets added to a normal reply) over under-flagging.
"""

from enum import Enum


class RiskLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


_CRITICAL_PHRASES = [
    "kill myself",
    "end my life",
    "suicide",
    "want to die",
    "don't want to live",
    "no reason to live",
]

_HIGH_PHRASES = [
    "hurt myself",
    "self harm",
    "self-harm",
    "can't go on",
    "cant go on",
    "give up on everything",
]

_MEDIUM_PHRASES = [
    "hopeless",
    "worthless",
    "no one would care",
    "better off without me",
    "so exhausted with everything",
]


def classify_risk(message: str) -> RiskLevel:
    text = message.lower()

    if any(phrase in text for phrase in _CRITICAL_PHRASES):
        return RiskLevel.CRITICAL
    if any(phrase in text for phrase in _HIGH_PHRASES):
        return RiskLevel.HIGH
    if any(phrase in text for phrase in _MEDIUM_PHRASES):
        return RiskLevel.MEDIUM
    return RiskLevel.NONE


SUPPORT_NOTICE = (
    "\n\nIt sounds like things feel really heavy right now. I'm an AI "
    "companion, not a substitute for real support — please consider "
    "reaching out to a counsellor through the Book Appointment tab, or a "
    "crisis line in your area, so a real person can help you through this."
)
