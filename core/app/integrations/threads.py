import aiohttp

from app.config import settings
from dotenv import load_dotenv

load_dotenv()


async def post_threads(access_token: str, text: str = "Hello Threads!") -> dict:
    """Post text to Threads"""
    try:
        async with aiohttp.ClientSession() as session:
            # Create container
            container = await session.post(
                f"{settings.THREADS_API_BASE_URL}/v1.0/me/threads",
                params={
                    "access_token": access_token,
                    "text": text,
                    "media_type": "TEXT"
                }
            )
            container_id = (await container.json())["id"]

            # Publish
            result = await session.post(
                f"{settings.THREADS_API_BASE_URL}/v1.0/me/threads_publish",
                params={
                    "access_token": access_token,
                    "creation_id": container_id
                }
            )
            return await result.json()

    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to post: {str(e)}") from e
