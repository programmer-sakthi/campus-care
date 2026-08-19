"""
The "general knowledge" RAG index — built once from the mental-health PDFs
in `data/`, persisted to disk, and reloaded on every subsequent startup.

This is intentionally separate from long-term per-student memory (see
`ml_service/memory/store.py`). This index answers "what does the literature
say", the memory store answers "what do we know about this specific student".
"""

import hashlib
import json
import logging
import shutil
import threading
from pathlib import Path

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
_MANIFEST_FILE = "file_manifest.json"
_index_lock = threading.RLock()


def _compute_file_hash(pdf_path: Path) -> str:
    digest = hashlib.sha256()
    with pdf_path.open("rb") as file:
        for chunk in iter(lambda: file.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _load_manifest() -> dict[str, str]:
    manifest_path = settings.kb_storage_dir / _MANIFEST_FILE
    if not manifest_path.exists():
        return {}

    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        logger.warning("Knowledge-base manifest is corrupted; creating a new one.")
        return {}


def _save_manifest(manifest: dict[str, str]) -> None:
    settings.kb_storage_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = settings.kb_storage_dir / _MANIFEST_FILE
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def _load_documents() -> list[Document]:
    documents: list[Document] = []

    for pdf_path in sorted(settings.kb_data_dir.glob("*.pdf")):
        file_hash = _compute_file_hash(pdf_path)
        page_text_parts: list[str] = []

        with fitz.open(pdf_path) as pdf:
            for page_number, page in enumerate(pdf):
                text = page.get_text().strip()
                if not text:
                    continue
                page_text_parts.append(f"[Page {page_number + 1}]\n{text}")

        if not page_text_parts:
            continue

        documents.append(
            Document(
                id_=f"{pdf_path.name}:{file_hash}",
                text="\n\n".join(page_text_parts),
                metadata={
                    "file_name": pdf_path.name,
                    "source_path": str(pdf_path),
                    "file_hash": file_hash,
                },
            )
        )

    logger.info("Loaded %d PDFs from %s", len(documents), settings.kb_data_dir)
    return documents


def get_data_directory_state() -> dict[str, tuple[int, int]]:
    """Return inexpensive change markers for the PDFs currently in ``data/``.

    Hashing and embedding are deliberately left to ``sync_knowledge_base``;
    the background worker can call this often without reading every PDF.
    """
    if not settings.kb_data_dir.exists():
        return {}

    state: dict[str, tuple[int, int]] = {}
    for pdf_path in settings.kb_data_dir.glob("*.pdf"):
        try:
            file_state = pdf_path.stat()
        except FileNotFoundError:
            # A file can vanish between directory enumeration and stat while
            # an uploader is replacing it. The next polling pass will retry.
            continue
        if pdf_path.is_file():
            state[pdf_path.name] = (file_state.st_mtime_ns, file_state.st_size)
    return state


def rebuild_knowledge_base() -> int:
    """Drop the persisted vector store and rebuild it from all PDFs in the data folder."""
    global _index

    with _index_lock:
        if settings.kb_storage_dir.exists():
            logger.info("Removing existing persisted knowledge-base index")
            shutil.rmtree(settings.kb_storage_dir)

        _index = None
        _index = get_index()

        manifest: dict[str, str] = {}
        for pdf_path in sorted(settings.kb_data_dir.glob("*.pdf")):
            manifest[pdf_path.name] = _compute_file_hash(pdf_path)

        _save_manifest(manifest)
        logger.info("Rebuilt knowledge base from %d PDFs", len(manifest))
        return len(manifest)


def sync_knowledge_base() -> int:
    """Insert only newly added or modified PDFs into the existing vector index."""
    global _index

    # LlamaIndex's default JSON stores are mutable. Keep retrieval out of the
    # small insert/delete window so readers never see a half-updated store.
    with _index_lock:
        settings.kb_storage_dir.mkdir(parents=True, exist_ok=True)
        if _index is None:
            _index = get_index()

        manifest = _load_manifest()
        new_or_changed = 0

        for pdf_path in sorted(settings.kb_data_dir.glob("*.pdf")):
            file_hash = _compute_file_hash(pdf_path)
            previous_hash = manifest.get(pdf_path.name)

            if previous_hash == file_hash:
                continue

            logger.info("Detected change in %s; syncing to knowledge base", pdf_path.name)

            if previous_hash:
                try:
                    _index.delete_ref_doc(f"{pdf_path.name}:{previous_hash}")
                except Exception:
                    logger.warning("Could not delete previous doc for %s; continuing", pdf_path.name)

            page_text_parts: list[str] = []
            with fitz.open(pdf_path) as pdf:
                for page_number, page in enumerate(pdf):
                    text = page.get_text().strip()
                    if text:
                        page_text_parts.append(f"[Page {page_number + 1}]\n{text}")

            # Remember empty/scanned PDFs too, otherwise every polling pass
            # would try to ingest them again.
            manifest[pdf_path.name] = file_hash
            if not page_text_parts:
                logger.warning("No extractable text found in %s", pdf_path.name)
                continue

            document = Document(
                id_=f"{pdf_path.name}:{file_hash}",
                text="\n\n".join(page_text_parts),
                metadata={
                    "file_name": pdf_path.name,
                    "source_path": str(pdf_path),
                    "file_hash": file_hash,
                },
            )
            _index.insert(document)
            new_or_changed += 1

        # Inserts only live in memory until persisted. This was the reason a
        # manually synced document disappeared after a service restart.
        if new_or_changed:
            _index.storage_context.persist(str(settings.kb_storage_dir))
        _save_manifest(manifest)
        return new_or_changed


def get_index() -> BaseIndex:
    """Returns the persisted knowledge-base index, building it on first run."""
    global _index
    with _index_lock:
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
            _save_manifest(
                {
                    pdf_path.name: _compute_file_hash(pdf_path)
                    for pdf_path in settings.kb_data_dir.glob("*.pdf")
                }
            )

        return _index


def get_retriever() -> BaseRetriever:
    return get_index().as_retriever(similarity_top_k=settings.kb_top_k)


def retrieve(query: str):
    """Retrieve nodes while preventing concurrent background index mutation."""
    with _index_lock:
        return get_index().as_retriever(
            similarity_top_k=settings.kb_top_k
        ).retrieve(query)


def get_query_engine() -> BaseQueryEngine:
    return get_index().as_query_engine(similarity_top_k=settings.kb_top_k)
