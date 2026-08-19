from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PACKAGE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    """Central config for the ml-service. Values are read from environment
    variables / a .env file at the ml-service package root."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- LLM (Groq, OpenAI-compatible endpoint) ---
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    groq_api_base: str = "https://api.groq.com/openai/v1"
    llm_context_window: int = 131072

    # --- Embeddings ---
    embed_model_name: str = "BAAI/bge-small-en-v1.5"

    # --- Knowledge base (RAG over the mental-health PDFs) ---
    kb_data_dir: Path = PACKAGE_DIR / "data"
    kb_storage_dir: Path = PACKAGE_DIR / "storage" / "knowledge_base"
    kb_top_k: int = 3
    # The data directory is polled so adding/replacing a PDF never delays a
    # chat request. Set to 0 to disable automatic background syncing.
    kb_sync_interval_seconds: float = 25.0

    # --- Long-term memory (per-student vector store) ---
    memory_storage_dir: Path = PACKAGE_DIR / "storage" / "memory"
    memory_collection_name: str = "student_memory"
    memory_top_k: int = 5

    # --- Server ---
    allowed_origins: list[str] = [
        "http://localhost:3000",  # student app
        "http://localhost:8000",  # backend (server-to-server calls don't need CORS, but harmless)
    ]


settings = Settings()
