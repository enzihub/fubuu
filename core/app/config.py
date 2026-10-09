import os
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings


class BaseConfig(BaseSettings):
    ENVIRONMENT: str = "development"

    # Celery
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None

    # AI
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # Database
    FAUNA_SECRET: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    # Twitter(X)
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_TOKEN_SECRET: Optional[str] = None
    TWITTER_BEARER_TOKEN: Optional[str] = None

    # Twilio
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WELCOME_TEMPLATE_SID: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None
    TWILIO_UNREGISTERED_USER_TEMPLATE_SID: Optional[str] = None
    TWILIO_24H_REMINDER_TEMPLATE_SID: Optional[str] = None
    TWILIO_UPGRADE_TEMPLATE_SID: Optional[str] = None

    TWILIO_DAY1_TEMPLATE_SID: Optional[str] = None
    TWILIO_DAY3_TEMPLATE_SID: Optional[str] = None
    TWILIO_DAY7_TEMPLATE_SID: Optional[str] = None
    TWILIO_WEEK2_TEMPLATE_SID: Optional[str] = None
    TWILIO_MONTH1_TEMPLATE_SID: Optional[str] = None
    TWILIO_MONTH3_TEMPLATE_SID: Optional[str] = None



    # Clerk
    CLERK_SECRET_KEY: Optional[str] = None

    # Redis
    REDIS_URL: Optional[str] = None

    # Rate Limits
    RATE_LIMIT_WINDOW_SECONDS: int = 86400  # 1 day
    RATE_LIMIT_X: int = 10
    RATE_LIMIT_THREADS: int = 1
    RATE_LIMIT_LINKEDIN: int = 1

    # Scheduler
    PRODUCE_INTERVAL_SECONDS: Optional[int] = None
    CONSUME_INTERVAL_SECONDS: Optional[int] = None

    # API Key (required on every request except webhooks and /health)
    API_KEY: Optional[str] = None

    # Optional: error reporting and CORS
    SENTRY_DSN: Optional[str] = None
    CORS_ORIGINS: Optional[str] = None  # comma-separated, defaults to http://localhost:3000

    # Support contact shown in WhatsApp replies (leave empty to omit)
    SUPPORT_PHONE: Optional[str] = None
    COMMUNITY_LINK: Optional[str] = None

    # Base URLs. Override these to point the backend at local stubs (see demo/).
    X_API_BASE_URL: str = "https://api.x.com"
    LINKEDIN_API_BASE_URL: str = "https://api.linkedin.com"
    THREADS_API_BASE_URL: str = "https://graph.threads.net"
    CLERK_API_URL: Optional[str] = None
    TWILIO_API_BASE_URL: Optional[str] = None
    OPENAI_MODEL: str = "o3-mini"

    class Config:
        env_file_encoding = "utf-8"
        case_sensitive = True


class DevelopmentConfig(BaseConfig):
    class Config:
        env_file = ".env"



class ProductionConfig(BaseConfig):
    class Config:
        env_file = ".env"


class TestConfig(BaseConfig):
    class Config:
        env_file = ".env.test"



@lru_cache()
def get_settings() -> BaseConfig:
    """
    Get configuration based on environment.
    Uses environment variable ENVIRONMENT to determine which configuration to load.
    Caches the result using lru_cache.
    """
    environment = os.getenv("ENVIRONMENT", "development")
    config_by_environment = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "test": TestConfig,
    }

    config_class = config_by_environment.get(environment, DevelopmentConfig)
    return config_class()


# Create a settings instance
settings = get_settings()
