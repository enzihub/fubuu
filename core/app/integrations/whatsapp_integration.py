import asyncio
import json
import os
from typing import Dict, Optional

import aiofiles
import aiohttp
from dotenv import load_dotenv
from fastapi import HTTPException
from pydub import AudioSegment
from sqlalchemy.orm import Session
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from app.config import settings
from app.core.config.logger import logger
from app.core.subscription.check_subscription import verify_premium_status
from app.core.user.user_service import get_user_details, get_user_prefs, update_last_message_timestamp
from app.integrations.responses import get_input_received_response, get_responses_to_send, get_new_user_response, \
    get_no_account_response
from app.integrations.socials import post_to_socials
from app.integrations.transcription import transcribe_audio

# Load environment variables
load_dotenv()


async def download_audio(media_url: str, media_type: str) -> str:
    """Download the audio file from Twilio MediaUrl asynchronously."""

    logger.info(f"Downloading audio file")

    auth = aiohttp.BasicAuth(
        settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN
    )
    file_extension = media_type.split("/")[-1]
    file_path = f"voice_message.{file_extension}"

    async with aiohttp.ClientSession(auth=auth) as session:
        async with session.get(media_url) as response:
            if response.status == 200:
                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(await response.read())
                return file_path
            raise HTTPException(status_code=500, detail="Failed to download audio file")


async def convert_to_wav(input_file_path: str) -> str:
    """Convert audio file to WAV format."""

    logger.info(f"Converting audio file to WAV format")

    output_file_path = "voice_message.wav"
    # AudioSegment operations are CPU-bound, so we use asyncio.to_thread
    await asyncio.to_thread(lambda: AudioSegment.from_file(input_file_path).export(output_file_path, format="wav"))
    return output_file_path


async def cleanup_files(*file_paths: str):
    """Clean up temporary files."""

    logger.info(f"Cleaning up temporary files")

    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                await asyncio.to_thread(os.remove, file_path)
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {e}")
            raise HTTPException(status_code=500, detail="Error cleaning up temporary files")


async def handle_whatsapp_webhook(form_data: dict, db: Session) -> str:
    temp_files = []

    try:
        # Validate basic request data
        if not form_data:
            raise HTTPException(status_code=400, detail="Missing form data")

        sender_number = form_data.get('From', '').replace('whatsapp:', '')
        if not sender_number:
            raise HTTPException(status_code=400, detail="Missing sender number")

        # Validate user and premium status
        sender_prefs = await get_user_prefs(db, sender_number)
        if not sender_prefs:
            await send_whatsapp_message(sender_number, get_no_account_response(),
                                        settings.TWILIO_UNREGISTERED_USER_TEMPLATE_SID)
            raise HTTPException(status_code=404, detail="User preferences not found")

        is_premium = await verify_premium_status(db, sender_prefs["email"])
        if not is_premium:
            await send_whatsapp_message(sender_number, get_no_account_response(),
                                        settings.TWILIO_UPGRADE_TEMPLATE_SID)
            raise HTTPException(status_code=403, detail="User is not a premium user")

        # Send ack
        await send_whatsapp_message(sender_number, get_input_received_response())

        # Update user prefs with last message timestamp
        await update_last_message_timestamp(db, sender_number)

        user_details = await get_user_details(db, sender_prefs["email"])
        if not user_details:
            raise HTTPException(status_code=404, detail="User details not found")

        # Process message content
        if int(form_data.get("NumMedia", 0)) > 0:
            # Handle voice message
            media_url = form_data.get("MediaUrl0")
            media_type = form_data.get("MediaContentType0")

            if not (media_url and media_type and "audio" in media_type):
                raise HTTPException(status_code=400, detail="Invalid media content")

            audio_file = await download_audio(media_url, media_type)
            wav_file = await convert_to_wav(audio_file)
            temp_files = [audio_file, wav_file]
            transcription = await transcribe_audio(wav_file)
        else:
            # Handle text message
            transcription = form_data.get("Body", "").strip()
            if not transcription:
                raise HTTPException(status_code=400, detail="Missing message content")

        # Post content and send responses
        posting_result = await post_to_socials(db, sender_prefs, user_details['user_id'], transcription)
        responses = await get_responses_to_send(posting_result, sender_prefs["timezone"])

        for resp in responses:
            await send_whatsapp_message(sender_number, resp)

        return "Success" if responses else "Failed"

    except HTTPException:
        # Pass through HTTP exceptions without wrapping
        raise
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_files:
            await asyncio.create_task(cleanup_files(*temp_files))


# Send welcome message via twilio

async def send_welcome_message(user_phone: str) -> Dict[str, Optional[str]]:
    """Send a welcome message template via WhatsApp.

    Args:
        user_phone: Phone number in E.164 format (e.g. +15555550123)

    Returns:
        Dict with message_sid if successful, error message if failed
    """
    try:
        # TODO: Add support for gif later.
        message, gif_url = get_new_user_response()
        return await send_whatsapp_message(user_phone, message, settings.TWILIO_WELCOME_TEMPLATE_SID)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
# async def send_welcome_message(user_phone: str) -> Dict[str, Optional[str]]:
#     """Send a welcome message template via WhatsApp.
#
#     Args:
#         user_phone: Phone number in E.164 format (e.g. +15555550123)
#
#     Returns:
#         Dict with message_sid if successful, error message if failed
#     """
#     try:
#         client = Client(
#             settings.TWILIO_ACCOUNT_SID,
#             settings.TWILIO_AUTH_TOKEN
#         )
#
#         template_sid = settings.TWILIO_WELCOME_TEMPLATE_SID
#         twilio_whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER
#
#         message = client.messages.create(
#             content_sid=template_sid,
#             from_=f"whatsapp:{twilio_whatsapp_number}",
#             to=f'whatsapp:{user_phone}'
#         )
#         return {"message_sid": message.sid}
#
#     except TwilioRestException as e:
#         raise HTTPException(status_code=500, detail=f"Twilio error: {e.msg}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")


async def send_whatsapp_message(
    user_phone: str,
    message: str | dict,
    template_sid: Optional[str] = None
) -> Dict[str, Optional[str]]:
    try:
        if not user_phone:
            return {"error": "Missing user phone number"}

        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
        if settings.TWILIO_API_BASE_URL:
            # Point Twilio at a local stub (see demo/fake_services.py)
            client.api.base_url = settings.TWILIO_API_BASE_URL

        twilio_whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER

        if template_sid and isinstance(message, dict):
            # Handle template message
            message = client.messages.create(
                content_sid=template_sid,
                from_=f"whatsapp:{twilio_whatsapp_number}",
                to=f'whatsapp:{user_phone}',
            )
        else:
            # Handle regular message
            message = client.messages.create(
                body=str(message),
                from_=f"whatsapp:{twilio_whatsapp_number}",
                to=f'whatsapp:{user_phone}'
            )

        return {"message_sid": message.sid}

    except TwilioRestException as e:
        raise HTTPException(status_code=500, detail=f"Twilio error: {e.msg}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
