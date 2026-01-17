from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from trainer import Trainer

app = FastAPI(title="Personalization Service", version="0.1.0")
trainer = Trainer(model_path=os.getenv("MODEL_PATH", "./models/personalization.pkl"))

class Interaction(BaseModel):
    user_id: str
    item_id: str
    action: str
    metadata: dict | None = None

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 5

class RecommendResponse(BaseModel):
    user_id: str
    recommendations: list

@app.post("/interactions")
async def ingest_interaction(it: Interaction):
    # Append to training buffer / store; trainer handles persistence
    try:
        await trainer.append_interaction(it.dict())
        return {"ingested": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train():
    # Trigger async training job (blocking for now)
    try:
        trainer.train()
        return {"trained": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend", response_model=RecommendResponse)
async def recommend(req: RecommendationRequest):
    try:
        recs = trainer.predict(req.user_id, limit=req.limit)
        return {"user_id": req.user_id, "recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8100")), reload=True)
