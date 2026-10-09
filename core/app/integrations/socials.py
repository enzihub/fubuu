from fastapi import HTTPException
from openai import OpenAI
from sqlalchemy.orm import Session

from app.config import settings
from app.core.ai.prompts import (
    VIRAL_LINKEDIN_CUSTOM_PROMPT,
    VIRAL_TWITTER_CUSTOM_PROMPT,
    VIRAL_TWITTER_PROMPT,
    VIRAL_LINKEDIN_PROMPT,
)
from app.core.auth.auth_service import get_user_token
from app.core.config.logger import logger
from app.core.ratelimit.ratelimit_service import RateLimitService
from app.core.user.user_service import get_user_by_id
from app.db.redis_service import RedisService
from app.integrations.linkedin import post_linkedin
from app.integrations.threads import post_threads
from app.integrations.tweets import post_tweet


async def create_viral_post(prompt: str) -> str:
    logger.info(f"Creating viral content for: {prompt}")

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL, messages=[{"role": "user", "content": prompt}]
        )

        result = response.choices[0].message.content.strip()
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def post_to_socials(db: Session, user_prefs, user_id: str, transcription: str):
    # Initialize services
    redis_service = RedisService()
    rate_limit_service = RateLimitService(redis_service)

    social_platforms = {
        "oauth_x": {
            "post_func": post_tweet,
            "prompt": VIRAL_TWITTER_PROMPT,
            "name": "Twitter",
        },
        "oauth_custom_threads": {
            "post_func": post_threads,
            "prompt": VIRAL_TWITTER_PROMPT,
            "name": "Threads",
        },
        "oauth_linkedin_oidc": {
            "post_func": post_linkedin,
            "prompt": VIRAL_LINKEDIN_PROMPT,
            "name": "LinkedIn",
        },
    }

    results = []
    for provider, platform in social_platforms.items():
        try:
            # Check rate limit using new service
            allowed, retry_after = await rate_limit_service.check_rate_limit(
                user_id, provider
            )
            if not allowed:
                results.append(
                    {
                        "platform": platform["name"],
                        "status": "rate_limited",
                        "retry_after": retry_after,
                    }
                )
                continue

            user_by_id = await get_user_by_id(db, user_id)
            token = await get_user_token(user_by_id["clerk_id"], provider)

            if not token:
                results.append(
                    {"platform": platform["name"], "status": "not_connected"}
                )
                continue

            # Create the prompt used for the generation. If user has a custom_prompt, use that instead.
            # Otherwise just use the in-built prompt with the user description.
            custom_prompt = user_prefs.get("custom_prompt", "")
            if custom_prompt:
                # Use custom prompt template if user has custom prompt
                if provider in ["oauth_x", "oauth_custom_threads"]:
                    prompt_template = VIRAL_TWITTER_CUSTOM_PROMPT
                else:
                    prompt_template = VIRAL_LINKEDIN_CUSTOM_PROMPT
            else:
                # Use default prompt template
                prompt_template = platform["prompt"]

            # Generate and post content
            prompt = prompt_template.format(
                raw_text=transcription,
                description=user_prefs["description"],
                custom_prompt=custom_prompt,
            )
            content = await create_viral_post(prompt)
            await platform["post_func"](token, content)

            # Record the request using new service
            await rate_limit_service.record_request(user_id, provider)

            results.append(
                {"platform": platform["name"], "status": "success", "content": content}
            )

        except Exception as e:
            error_status = (
                "token_invalid" if "OAuth token" in str(e) else "posting_failed"
            )
            results.append(
                {"platform": platform["name"], "status": error_status, "error": str(e)}
            )

    if not results:
        raise HTTPException(
            status_code=400, detail="No social media accounts configured"
        )

    return results
