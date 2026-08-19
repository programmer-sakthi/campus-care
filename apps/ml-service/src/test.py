from llama_index.core import Settings, VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai_like import OpenAILike
import os
from dotenv import load_dotenv

load_dotenv()
Settings.llm = OpenAILike(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    api_base="https://api.groq.com/openai/v1",
    is_chat_model=True,
    context_window=131072,
)

# set the embed model
Settings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
import fitz
from llama_index.core import Document

pdf_path = "./ml_service/data/Understanding-Mental-Health.pdf"

pdf = fitz.open(pdf_path)

documents = []

for page_number, page in enumerate(pdf):
    text = page.get_text()

    if text.strip():
        documents.append(
            Document(
                text=text,
                metadata={
                    "file_name": "Understanding-Mental-Health.pdf",
                    "page_number": page_number + 1,
                },
            )
        )

print("Documents:", len(documents))
print(documents[0].text[:2000])
index = VectorStoreIndex.from_documents(
    documents, show_progress= True
)
index.storage_context.persist("./ml_service/storage")
# --- Query ---
query_engine = index.as_query_engine()
response = query_engine.query(
    "I am feeling stressed"
)

print("Response:")
print(response)

print("\nSources:")
for source in response.source_nodes:
    print("\n---")
    print(source.text)