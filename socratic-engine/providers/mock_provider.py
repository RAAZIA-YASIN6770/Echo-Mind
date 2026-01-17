import asyncio
from typing import Dict, Any

async def call(prompt: str, timeout: int = 10) -> Dict[str, Any]:
    # Simulate a fast, successful provider
    await asyncio.sleep(0.03)
    return {
        'provider': 'mock-provider',
        'text': f"(mock) Think about: {prompt[:200]}",
        'cost': 0.0005,
    }
