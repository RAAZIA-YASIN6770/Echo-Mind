Socratic Engine (FastAPI) — skeleton

Quick start (local):

1. Create a virtual env and install requirements:

```bash
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Run the app:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Docker build:

```bash
docker build -t socratic-engine:latest .
docker run -p 8000:8000 socratic-engine:latest
```

Next steps:
- Implement LLM Adapter and provider failover
- Add telemetry persistence and authentication
- Add health checks and readiness endpoints
