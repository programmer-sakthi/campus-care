import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ml_service.chat.router import router as chat_router
from ml_service.config import settings
from ml_service.core.knowledge_base import get_index
from ml_service.core.llm import configure_llm

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="ml-service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)


@app.on_event("startup")
async def warm_up() -> None:
    # Configure the LLM/embedding singletons and build (or load) the RAG
    # index up front, so the first real chat request isn't slow.
    configure_llm()
    get_index()


@app.get("/")
async def root():
    return {"status": "ok"}
