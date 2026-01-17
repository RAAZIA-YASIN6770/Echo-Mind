Personalization Service — skeleton

Quick start (local):

1. Create and activate virtualenv:

```bash
python -m venv .venv
source .venv/bin/activate   # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Run the service:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8100
```

Endpoints:
- `POST /interactions` — ingest interaction JSON
- `POST /train` — build simple popularity model
- `POST /recommend` — get recommendations for a user

Next steps:
- Replace trainer stub with proper feature extraction and model training pipeline
- Add auth, metrics, and persistence to Postgres/feature store
- Add integration with `socratic-engine` for personalized hints
