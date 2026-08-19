"""
Configures the global LlamaIndex `Settings` (LLM + embedding model) exactly
once, on first import. Every other module just imports `Settings` from
llama_index.core and it will already be wired up correctly, e.g.:

    from llama_index.core import Settings
    Settings.llm.chat(...)
"""

from llama_index.core import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai_like import OpenAILike

from ml_service.config import settings

_configured = False


def configure_llm() -> None:
    global _configured
    if _configured:
        return

    Settings.llm = OpenAILike(
        model=settings.groq_model,
        api_key=settings.groq_api_key,
        api_base=settings.groq_api_base,
        is_chat_model=True,
        context_window=settings.llm_context_window,
    )

    Settings.embed_model = HuggingFaceEmbedding(
        model_name=settings.embed_model_name
    )

    _configured = True
