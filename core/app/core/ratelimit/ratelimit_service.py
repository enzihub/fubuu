# rate_limit_service.py
from typing import Dict, Optional, Tuple
from app.config import settings
from app.db.redis_service import RedisService


class RateLimitService:
    def __init__(self, redis_service: RedisService):
        self.redis = redis_service
        self.namespace = "ratelimit"
        self.rate_limits = {
            f"{self.namespace}:oauth_x": settings.RATE_LIMIT_X,
            f"{self.namespace}:oauth_custom_threads": settings.RATE_LIMIT_THREADS,
            f"{self.namespace}:oauth_linkedin_oidc": settings.RATE_LIMIT_LINKEDIN
        }
        self.window_seconds = settings.RATE_LIMIT_WINDOW_SECONDS

    def _get_user_key(self, platform: str, user_id: str) -> str:
        """Generate a single key for user-platform combination"""
        return f"{self.namespace}:{platform}:{user_id}"

    async def check_rate_limit(self, user_id: str, platform: str) -> Tuple[bool, Optional[int]]:
        platform_key = f"{self.namespace}:{platform}"
        if platform_key not in self.rate_limits:
            raise ValueError(f"Unknown platform: {platform}")

        user_key = self._get_user_key(platform, user_id)
        count = int(self.redis.client.get(user_key) or 0)

        if count >= self.rate_limits[platform_key]:
            # Get TTL of the key to calculate retry-after
            ttl = self.redis.client.ttl(user_key)
            if ttl > 0:
                return False, ttl
            # If TTL is -1 (no expiry) or -2 (key doesn't exist), reset counter
            self.redis.client.delete(user_key)
            return True, None

        return True, None

    async def record_request(self, user_id: str, platform: str) -> None:
        platform_key = f"{self.namespace}:{platform}"
        if platform_key not in self.rate_limits:
            raise ValueError(f"Unknown platform: {platform}")

        user_key = self._get_user_key(platform, user_id)
        pipe = self.redis.client.pipeline()

        # Increment counter and set expiry if it doesn't exist
        pipe.incr(user_key)
        pipe.expire(user_key, self.window_seconds)
        pipe.execute()

    async def get_remaining_requests(self, user_id: str, platform: str) -> int:
        platform_key = f"{self.namespace}:{platform}"
        if platform_key not in self.rate_limits:
            raise ValueError(f"Unknown platform: {platform}")

        user_key = self._get_user_key(platform, user_id)
        count = int(self.redis.client.get(user_key) or 0)

        return max(0, self.rate_limits[platform_key] - count)

    async def reset_rate_limit(self, user_id: str, platform: str) -> None:
        """Reset rate limit counter for a specific user and platform"""
        user_key = self._get_user_key(platform, user_id)
        self.redis.client.delete(user_key)