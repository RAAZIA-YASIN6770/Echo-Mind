import asyncio
import random
from typing import Dict, Any

async def call(prompt: str, timeout: int = 10) -> Dict[str, Any]:
    # Simulate an unreliable provider which fails sometimes
    await asyncio.sleep(0.05)
    if random.random() < 0.4:
        raise RuntimeError('flaky provider simulated failure')
    return {
        'provider': 'flaky-provider',
        'text': f"(flaky) Consider splitting: {prompt[:200]}",
        'cost': 0.0012,
    }
