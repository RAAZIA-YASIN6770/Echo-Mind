from fastapi import FastAPI
from pydantic import BaseModel
import os

from llm_adapter import LLMAdapter
from providers import mock_provider, flaky_provider
import asyncio
import telemetry

app = FastAPI(title="Socratic Engine", version="0.1.0")

class ChatRequest(BaseModel):
    user_id: str
    message: str

class HintResponse(BaseModel):
    hint: str
    step: int


adapter = LLMAdapter(providers=[mock_provider.call, flaky_provider.call])


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat", response_model=HintResponse)
async def chat(req: ChatRequest):
    # Use the LLMAdapter to generate a hint with provider failover
    try:
        res = await adapter.generate(req.message, timeout=8)
        hint_text = res.get('text', '')
        return {"hint": hint_text, "step": 1}
    except Exception as e:
        # In production, return structured error and log
        return {"hint": "Sorry — temporary error generating hint.", "step": 0}


@app.post("/hint", response_model=HintResponse)
async def hint(req: ChatRequest):
    # Placeholder for next-hint logic using the adapter
    try:
        res = await adapter.generate(req.message, timeout=6)
        return {"hint": res.get('text', 'Try breaking the problem into smaller parts.'), "step": 2}
    except Exception:
        return {"hint": "Try breaking the problem into smaller parts.", "step": 2}


@app.post("/telemetry")
async def telemetry(payload: dict):
    # Persist telemetry asynchronously to NDJSON for now
    try:
        await telemetry.save_event(payload)
        return {"received": True}
    except Exception:
        return {"received": False}


@app.get("/provider/status")
async def provider_status():
    statuses = []
    for p in adapter.providers:
        name = getattr(p, "__name__", "provider")
        try:
            # quick health call (non-blocking, short timeout)
            await asyncio.wait_for(p("health-check", timeout=2), timeout=2)
            statuses.append({"provider": name, "status": "ok"})
        except Exception as e:
            statuses.append({"provider": name, "status": "error", "error": str(e)})
    return {"providers": statuses, "costs": adapter.get_costs()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
