import google.generativeai as genai
import sentry_sdk
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from app.config import settings
from app.core.api.routes import router
from app.core.config.logger import logger
from app.db.redis_service import RedisService
from fastapi import FastAPI, Request


# Load environment variables
load_dotenv()

# Initialize Sentry (optional: only when SENTRY_DSN is set)
if settings.SENTRY_DSN:
    sentry_sdk.init(dsn=settings.SENTRY_DSN, traces_sample_rate=1.0)

# Initialize FastAPI app
app = FastAPI()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Create Redis service instance
redis_service = RedisService()

# Store redis_service in app state
setattr(app, 'redis_service', redis_service)

# Include the router
app.include_router(router)


# Add this middleware class
class APISecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow webhook paths and healthcheck without API key
        if request.url.path in ["/whatsapp-webhook", "/twilio-webhook", "/health"]:
            return await call_next(request)

        # Check for API key in header
        api_key = request.headers.get("X-API-Key")
        if not api_key or api_key != settings.API_KEY:
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid API key"}
            )

        return await call_next(request)


app.add_middleware(APISecurityMiddleware)

# Configure CORS with strict settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in (settings.CORS_ORIGINS or "http://localhost:3000").split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Specify allowed methods
    allow_headers=["Authorization", "Content-Type", "X-Api-Key"],  # Specify allowed headers
    expose_headers=[],
    max_age=600,  # Cache preflight requests for 10 minutes
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up...")
    # Check Redis connection using the service
    if not app.redis_service.check_connection():
        error_msg = "Failed to establish Redis connection"
        logger.error(error_msg)
        raise ConnectionError(error_msg)
    logger.info("Redis connection established successfully")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down...")
    try:
        # Close Redis connection
        app.redis_service.client.close()
        logger.info("Redis connection closed successfully")
    except Exception as e:
        logger.error(f"Redis shutdown error: {str(e)}")