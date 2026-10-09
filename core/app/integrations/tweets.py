import aiohttp
from dotenv import load_dotenv
from app.config import settings
from app.core.config.logger import logger

load_dotenv()


async def post_tweet(oauth_token: str, text: str = "hello world") -> dict:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{settings.X_API_BASE_URL}/2/tweets",
                    json={"text": text},
                    headers={
                        "Authorization": f"Bearer {oauth_token}",
                        "Content-Type": "application/json"
                    }
            ) as response:
                response.raise_for_status()

                logger.info(f"Posted tweet: {text}")
                return await response.json()
    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to post tweet: {str(e)}") from e

