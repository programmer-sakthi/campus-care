import asyncio
import logging
from contextlib import suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ml_service.chat.router import router as chat_router
from ml_service.config import settings
from ml_service.core.knowledge_base import get_data_directory_state, get_index, sync_knowledge_base
from ml_service.core.llm import configure_llm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml_service")

app = FastAPI(title="ml-service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


async def _watch_knowledge_base() -> None:
    """Sync changed PDFs off the event loop for the lifetime of the service."""
    interval = settings.kb_sync_interval_seconds
    if interval <= 0:
        logger.info("Automatic knowledge-base syncing is disabled")
        return

    # ``None`` forces one asynchronous reconciliation at startup. It catches
    # PDFs added or replaced while the service was stopped.
    previous_state: dict[str, tuple[int, int]] | None = None
    while True:
        current_state = get_data_directory_state()
        if current_state != previous_state:
            try:
                changed = await asyncio.to_thread(sync_knowledge_base)
            except Exception:
                # Keep the old marker: a transient partial upload or embedding
                # failure is retried on the next pass.
                logger.exception("Background knowledge-base sync failed")
            else:
                previous_state = get_data_directory_state()
                logger.info(
                    "Background knowledge-base sync complete (%d files updated)", changed
                )

        await asyncio.sleep(interval)


@app.on_event("startup")
async def warm_up() -> None:
    # Configure the LLM/embedding singletons and build (or load) the RAG
    # index up front, so the first real chat request isn't slow.
    configure_llm()
    get_index()
    app.state.knowledge_base_watcher = asyncio.create_task(_watch_knowledge_base())


@app.on_event("shutdown")
async def stop_knowledge_base_watcher() -> None:
    watcher = getattr(app.state, "knowledge_base_watcher", None)
    if watcher is None:
        return
    watcher.cancel()
    with suppress(asyncio.CancelledError):
        await watcher


@app.get("/")
async def root():
    return {"status": "ok"}
