# 📚 AgriIntel RAG & Assistant Microservice (FastAPI + Chroma)

Knowledge retrieval-augmented generation service for answering farmer queries grounded strictly in verified government subsidy schemes, mandi policies, and disease guides.

## Tech Stack
- **Framework**: FastAPI
- **Vector DB**: ChromaDB (self-hosted)
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (Local inference, 0 API cost)
- **RAG Orchestrator**: LangChain
- **LLM Generator**: OpenAI GPT-4o-mini / Anthropic Claude / Ollama (Llama 3 8B)

## Endpoints
- **GET `/health`**: Vector store and service status.
- **POST `/rag/query`**: Dense semantic search + prompt assembly + grounded response generation.
- **POST `/rag/ingest`**: Chunking and embedding of government PDF/TXT documents into Chroma.

## Local Development
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```
Swagger UI: `http://localhost:8002/docs`
