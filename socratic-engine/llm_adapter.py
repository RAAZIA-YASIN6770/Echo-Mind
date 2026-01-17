import asyncio
from typing import Callable, List, Dict, Any

class ProviderError(Exception):
    pass

class LLMAdapter:
    """Simple async LLM Adapter with provider failover and cost accounting.

    Providers must be async callables with signature: async def call(prompt: str, timeout: int) -> Dict[str, Any]
    The returned dict must include keys: 'provider' (str), 'text' (str), and optional 'cost' (float).
    """

    def __init__(self, providers: List[Callable] | None = None):
        self.providers = providers or []
        self.costs: Dict[str, float] = {}

    async def generate(self, prompt: str, timeout: int = 10) -> Dict[str, Any]:
        last_exc: Exception | None = None
        for provider in self.providers:
            try:
                # call provider with timeout
                coro = provider(prompt, timeout=timeout)
                res = await asyncio.wait_for(coro, timeout=timeout)
                provider_name = res.get('provider', 'unknown')
                cost = float(res.get('cost', 0.0))
                self.costs[provider_name] = self.costs.get(provider_name, 0.0) + cost
                return res
            except Exception as e:
                last_exc = e
                # try next provider
                continue
        raise ProviderError(f"All providers failed. Last error: {last_exc}")

    def get_costs(self) -> Dict[str, float]:
        return dict(self.costs)
