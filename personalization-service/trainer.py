import os
import json
from pathlib import Path
import threading

class Trainer:
    """Simple trainer stub that records interactions and produces naive recommendations.

    - Stores interactions as NDJSON in `data/`.
    - `train()` builds a trivial popularity-based model saved as JSON.
    - `predict(user_id)` returns top-N popular items excluding recent user interactions.
    """
    def __init__(self, model_path: str = "./models/personalization.json"):
        self.base = Path(__file__).parent
        self.data_file = self.base / "data" / "interactions.ndjson"
        self.model_path = Path(model_path)
        (self.base / "data").mkdir(exist_ok=True)
        self._lock = threading.Lock()

    async def append_interaction(self, interaction: dict) -> None:
        line = json.dumps(interaction, default=str) + "\n"
        with self._lock:
            with open(self.data_file, "a", encoding="utf-8") as f:
                f.write(line)

    def train(self) -> None:
        # read all interactions and compute item popularity
        counts = {}
        if not self.data_file.exists():
            counts = {}
        else:
            with open(self.data_file, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        ev = json.loads(line)
                        item = ev.get("item_id")
                        if item:
                            counts[item] = counts.get(item, 0) + 1
                    except Exception:
                        continue
        model = {"popularity": sorted(counts.items(), key=lambda x: -x[1])}
        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.model_path, "w", encoding="utf-8") as mf:
            json.dump(model, mf)

    def predict(self, user_id: str, limit: int = 5):
        # naive recommendation: top popular items
        if not self.model_path.exists():
            return []
        with open(self.model_path, "r", encoding="utf-8") as mf:
            model = json.load(mf)
        popular = [item for item, _ in model.get("popularity", [])]
        return popular[:limit]
