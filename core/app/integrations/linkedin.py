from dotenv import load_dotenv

load_dotenv()

import aiohttp

from app.config import settings
from typing import Dict


async def post_linkedin(access_token: str, text: str = "Hello LinkedIn!") -> Dict:
    """Post text to LinkedIn

    Args:
        access_token (str): LinkedIn OAuth2.0 access token
        text (str): Content to post, defaults to "Hello LinkedIn!"

    Returns:
        dict: Response from LinkedIn API

    Raises:
        RuntimeError: If posting fails
    """
    try:
        # First get the user ID
        async with aiohttp.ClientSession() as session:
            # Get user info to obtain author ID
            async with session.get(
                    f"{settings.LINKEDIN_API_BASE_URL}/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
            ) as resp:
                user_info = await resp.json()
                author_id = user_info.get("sub")  # LinkedIn user ID

            # Prepare post payload
            payload = {
                "author": f"urn:li:person:{author_id}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": text
                        },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }

            # Make the post
            async with session.post(
                    f"{settings.LINKEDIN_API_BASE_URL}/v2/ugcPosts",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {access_token}"
                    },
                    json=payload
            ) as response:
                return await response.json()

    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to post to LinkedIn: {str(e)}") from e