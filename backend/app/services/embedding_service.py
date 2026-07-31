"""
embedding_service.py — Gemini text-embedding-004 wrapper for semantic search.

Uses the SAME google-genai client already installed for ai_service.py — no new packages.
All calls degrade gracefully: if GEMINI_API_KEY is unset or the API call fails,
embed_text() returns an empty list [], and callers should fall back to keyword search.

The embedding model is free under the same Gemini free tier as generation,
counting against the same shared daily quota — which is exactly why we apply
the @require_ai_quota check on the /ai/search route.
"""
import os
import math
from concurrent.futures import ThreadPoolExecutor
from google import genai
from app.config import Config

# Reuse the same executor pool as ai_service to bound total thread count
_embed_executor = ThreadPoolExecutor(max_workers=3)


class EmbeddingService:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            api_key = os.environ.get("GEMINI_API_KEY", "")
            if api_key:
                self._client = genai.Client(api_key=api_key)
        return self._client

    def embed_text(self, text: str) -> list:
        """
        Returns a list[float] embedding vector for the given text,
        or [] if the API key is missing or the call fails.
        Runs synchronously (caller submits via background executor if needed).
        """
        if not self.client:
            return []
        if not text or not text.strip():
            return []
        try:
            # Truncate to ~8000 chars to stay within token limits safely
            truncated = text[:8000]
            result = self.client.models.embed_content(
                model=Config.GEMINI_EMBEDDING_MODEL,
                contents=truncated
            )
            # The SDK returns an EmbedContentResponse; values live in .embeddings[0].values
            return list(result.embeddings[0].values)
        except Exception as e:
            print(f"[EmbeddingService] embed_text failed: {e}")
            return []

    def embed_text_async(self, text: str):
        """Submit embed_text to background pool and return a Future."""
        return _embed_executor.submit(self.embed_text, text)

    @staticmethod
    def cosine_similarity(a: list, b: list) -> float:
        """Pure-Python cosine similarity — no numpy needed."""
        if not a or not b or len(a) != len(b):
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x * x for x in a))
        mag_b = math.sqrt(sum(y * y for y in b))
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return dot / (mag_a * mag_b)


embedding_service = EmbeddingService()
