# app/routes.py
import datetime
from datetime import timezone

from fastapi import APIRouter, HTTPException, Depends
from fastapi import Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.core.ai.prompts import VIRAL_LINKEDIN_PROMPT
from app.core.config.logger import logger
from app.core.scheduled_messenger.message_service import get_users_for_scheduling, send_user_message
from app.core.user.user_service import get_user_prefs
from app.db.database import get_db
from app.integrations.responses import get_responses_to_send, get_24h_checkin_response
from app.integrations.socials import post_to_socials, create_viral_post
from app.integrations.whatsapp_integration import handle_whatsapp_webhook, send_welcome_message, send_whatsapp_message

router = APIRouter()


class WelcomeRequest(BaseModel):
    user_phone: str


@router.post("/whatsapp-webhook")
async def whatsapp_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle incoming WhatsApp messages via Twilio webhook."""
    form_data = await request.form()
    form_dict = dict(form_data)
    try:
        result = await handle_whatsapp_webhook(form_dict, db)
        return result
    except HTTPException as e:
        # Pass through HTTP exceptions with their original status codes
        logger.error(f"Webhook endpoint error: {str(e)}")
        raise e
    except Exception as e:
        # 500 for unexpected errors
        logger.error(f"Webhook endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/twilio-webhook")
async def twilio_webhook(
        request: Request,
        db: Session = Depends(get_db)
):
    """Handle incoming WhatsApp messages via Twilio webhook."""
    form_data = await request.form()
    form_dict = dict(form_data)
    try:
        # Log only essential non-sensitive data
        log_data = {
            'MessageStatus': form_dict.get('MessageStatus'),
            'SmsStatus': form_dict.get('SmsStatus'),
            'ErrorCode': form_dict.get('ErrorCode'),
            'ChannelPrefix': form_dict.get('ChannelPrefix')
        }
        logger.info(f"Twilio webhook: {log_data}")

        # Check if there's an error code
        if 'ErrorCode' in form_dict and 'undelivered' in form_dict.get('MessageStatus'):
            error_code = form_dict.get('ErrorCode')
            user_phone = form_dict.get('To', '').replace('whatsapp:', '')

            # Handle opt-in error (63016)
            if error_code == '63016':
                # Check the user_prefs from database
                user_prefs = await get_user_prefs(db, user_phone)
                last_message_timestamp_utc = user_prefs.get('last_message_timestamp_utc')

                # Default to 24h reminder if no timestamp
                if not last_message_timestamp_utc:
                    return await send_whatsapp_message(user_phone, get_24h_checkin_response(),
                                                       settings.TWILIO_24H_REMINDER_TEMPLATE_SID)

                # Calculate days elapsed
                now = datetime.datetime.now(timezone.utc)
                delta = now - last_message_timestamp_utc
                days_elapsed = delta.days

                # Select template and message based on days elapsed
                template_sid = settings.TWILIO_24H_REMINDER_TEMPLATE_SID  # Default

                # Select appropriate template and message based on days elapsed
                if days_elapsed == 1:
                    template_sid = settings.TWILIO_DAY1_TEMPLATE_SID
                elif days_elapsed == 3:
                    template_sid = settings.TWILIO_DAY3_TEMPLATE_SID
                elif days_elapsed == 7:
                    template_sid = settings.TWILIO_DAY7_TEMPLATE_SID
                elif 14 <= days_elapsed < 30:
                    template_sid = settings.TWILIO_WEEK2_TEMPLATE_SID
                elif 30 <= days_elapsed < 90:
                    template_sid = settings.TWILIO_MONTH1_TEMPLATE_SID
                elif days_elapsed >= 90:
                    template_sid = settings.TWILIO_MONTH3_TEMPLATE_SID

                logger.warning(f"WhatsApp opt-in required (error: {error_code})")
                return await send_whatsapp_message(user_phone, 'warning', template_sid)

            # Log other error codes without phone
            logger.error(f"WhatsApp error: {error_code}")
            return {"status": "error", "code": error_code}

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/whatsapp-welcome")
async def welcome_message(payload: WelcomeRequest):
    """Send a welcome message to a new WhatsApp user."""
    return await send_welcome_message(payload.user_phone)



@router.get("/")
async def root():
    return {"message": "Hello World", "environment": settings.ENVIRONMENT}


@router.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@router.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0


@router.get("/health")
async def health_check():
    return {"status": "ok"}


# @router.post("/test-social")
# async def test_social_ratelimit(
#         request: Request,
#         phone_number: str,
#         user_id: str,
#         db: Session = Depends(get_db)
# ):
#     user_prefs = {}
#     user_prefs['description'] = 'lambooo teacher'
#     result = await post_to_socials(db, user_prefs, user_id, "hello world")
#     response = await get_responses_to_send(result)
#     print(response)
#
#     # Send responses
#     for resp in response:
#         await send_whatsapp_message(phone_number, resp)
#
#     return {"status": "success"}

# class TestMessageRequest(BaseModel):
#     user_phone: str

# @router.post("/test-message")
# async def test_welcome_message(
#     request: TestMessageRequest
# ):
#     return await send_user_message(request.user_phone, "Hello world")

# @router.get("/test-users-scheduling")
# async def test_get_users(
#     db: Session = Depends(get_db)
# ):
#     target_hours_messages = {
#         1500: "Good evening! How's your day going?",
#         1800: "Evening check-in!",
#         2300: "Late night message."
#     }
#     users = await get_users_for_scheduling(db,60, target_hours_messages)
#     return users

# @router.get("/test-viral")
# async def test_viral_message():
#     response = await create_viral_post(VIRAL_LINKEDIN_PROMPT)
#     return response

# @router.get("/messages")
# async def get_messages():
#     """Endpoint to retrieve messages asynchronously."""
#     try:
#         client = Client(
#             os.getenv("TWILIO_ACCOUNT_SID"),
#             os.getenv("TWILIO_AUTH_TOKEN")
#         )
#
#         # Since Twilio client is synchronous, we'll use asyncio.to_thread
#         messages = await asyncio.to_thread(client.messages.list, limit=10)
#         return [
#             {
#                 "sid": msg.sid,
#                 "from": msg.from_,
#                 "to": msg.to,
#                 "body": msg.body,
#                 "status": msg.status,
#                 "date_sent": msg.date_sent,
#             }
#             for msg in messages
#         ]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
