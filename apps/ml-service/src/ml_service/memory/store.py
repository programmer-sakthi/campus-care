"""
Long-term memory: a single Chroma collection shared by every student, where
each memory item is tagged with `student_id` metadata. Retrieval always
filters on `student_id`, so one student's memories never leak into another
student's context.

This is deliberately a thin wrapper around Chroma + LlamaIndex rather than a
second full VectorStoreIndex per student — one collection scales better and
is simpler to back up / inspect.
"""

import logging
import uuid
from datetime import datetime, timezone

import chromadb
from llama_index.core import VectorStoreIndex
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores import (
    ExactMatchFilter,
    MetadataFilters,
)
from llama_index.vector_stores.chroma import ChromaVectorStore

from ml_service.config import settings
from ml_service.core.llm import configure_llm

logger = logging.getLogger("ml_service.memory.store")

_index: VectorStoreIndex | None = None
_collection: chromadb.Collection | None = None


def _get_collection() -> chromadb.Collection:
    global _collection
    if _collection is not None:
        return _collection

    settings.memory_storage_dir.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(settings.memory_storage_dir))
    _collection = client.get_or_create_collection(settings.memory_collection_name)
    return _collection


def _get_index() -> VectorStoreIndex:
    global _index
    if _index is not None:
        return _index

    configure_llm()

    vector_store = ChromaVectorStore(chroma_collection=_get_collection())
    _index = VectorStoreIndex.from_vector_store(vector_store)
    return _index


def add_memory(student_id: str, text: str, memory_type: str = "fact") -> None:
    """Persist one durable fact/note about a student (e.g. their name, a
    recurring stressor, a preference they mentioned)."""
    if not text.strip():
        return

    node = TextNode(
        id_=str(uuid.uuid4()),
        text=text.strip(),
        metadata={
            "student_id": student_id,
            "type": memory_type,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    )
    _get_index().insert_nodes([node])
    logger.info("Stored memory for %s: %s", student_id, text[:80])


def search_memory(student_id: str, query: str, top_k: int | None = None) -> list[str]:
    """Return the most relevant remembered facts about this student for the
    given query. Always scoped to `student_id` via a metadata filter."""
    filters = MetadataFilters(
        filters=[ExactMatchFilter(key="student_id", value=student_id)]
    )
    retriever = _get_index().as_retriever(
        similarity_top_k=top_k or settings.memory_top_k,
        filters=filters,
    )
    nodes = retriever.retrieve(query)
    return [n.get_content() for n in nodes]


def all_memories(student_id: str) -> list[str]:
    """Debug/inspection helper — every memory stored for a student, oldest
    first. Not used on the main chat path (that always goes through the
    relevance-ranked `search_memory` above); a direct Chroma `.get()` avoids
    needing a query string to fetch "everything"."""
    result = _get_collection().get(where={"student_id": student_id})
    pairs = list(zip(result["documents"], result["metadatas"]))
    pairs.sort(key=lambda p: p[1].get("created_at", ""))
    return [text for text, _ in pairs]
