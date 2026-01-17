import asyncio
import json
from pathlib import Path

TELEMETRY_FILE = Path(__file__).parent / "telemetry.ndjson"

async def save_event(event: dict) -> None:
    """Append an event as NDJSON to the telemetry file using a thread pool."""
    line = json.dumps(event, default=str) + "\n"
    await asyncio.to_thread(_append_line, line)

def _append_line(line: str) -> None:
    with open(TELEMETRY_FILE, "a", encoding="utf-8") as f:
        f.write(line)

async def get_recent(n: int = 20):
    if not TELEMETRY_FILE.exists():
        return []
    def _read_last():
        with open(TELEMETRY_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
            return [json.loads(l) for l in lines[-n:]]
    return await asyncio.to_thread(_read_last)
