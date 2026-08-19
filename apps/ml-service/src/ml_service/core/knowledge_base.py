"""
The "general knowledge" RAG index — built once from the mental-health PDFs
in `data/`, persisted to disk, and reloaded on every subsequent startup.

This is intentionally separate from long-term per-student memory (see
`ml_service/memory/store.py`). This index answers "what does the literature
say", the memory store answers "what do we know about this specific student".
"""

import logging

import fitz  # PyMuPDF
from llama_index.core import (
    Document,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from llama_index.core.indices.base import BaseIndex
from llama_index.core.query_engine import BaseQueryEngine
from llama_index.core.retrievers import BaseRetriever

from ml_service.config import settings
from ml_service.core.llm import configure_llm

logger = logging.getLogger("ml_service.knowledge_base")

_index: BaseIndex | None = None


def _load_documents() -> list[Document]:
    documents: list[Document] = []

    for pdf_path in sorted(settings.kb_data_dir.glob("*.pdf")):
        pdf = fitz.open(pdf_path)
        for page_number, page in enumerate(pdf):
            text = page.get_text()
            if not text.strip():
                continue
            documents.append(
                Document(
                    text=text,
                    metadata={
                        "file_name": pdf_path.name,
                        "page_number": page_number + 1,
                    },
                )
            )
        pdf.close()

    logger.info("Loaded %d pages from %s", len(documents), settings.kb_data_dir)
    return documents


def get_index() -> BaseIndex:
    """Returns the persisted knowledge-base index, building it on first run."""
    global _index
    if _index is not None:
        return _index

    configure_llm()

    if settings.kb_storage_dir.exists() and any(settings.kb_storage_dir.iterdir()):
        logger.info("Loading knowledge base index from %s", settings.kb_storage_dir)
        storage_context = StorageContext.from_defaults(
            persist_dir=str(settings.kb_storage_dir)
        )
        _index = load_index_from_storage(storage_context)
    else:
        logger.info("Building knowledge base index (first run)")
        documents = _load_documents()
        _index = VectorStoreIndex.from_documents(documents, show_progress=True)
        settings.kb_storage_dir.mkdir(parents=True, exist_ok=True)
        _index.storage_context.persist(str(settings.kb_storage_dir))

    return _index


def get_retriever() -> BaseRetriever:
    return get_index().as_retriever(similarity_top_k=settings.kb_top_k)


def get_query_engine() -> BaseQueryEngine:
    return get_index().as_query_engine(similarity_top_k=settings.kb_top_k)
