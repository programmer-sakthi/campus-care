from ml_service.core.knowledge_base import sync_knowledge_base


if __name__ == "__main__":
    added_or_updated = sync_knowledge_base()
    print(f"Knowledge-base sync complete. Added or updated files: {added_or_updated}")
