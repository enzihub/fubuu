# job_tasks.py

import json
import asyncio
from datetime import datetime
import pytz

from app.core.config.celery_config import celery_app
from app.core.config.logger import logger
from app.core.scheduled_messenger.message_service import (
    MessageService,
    send_user_message,
    get_users_for_scheduling,
)
from app.db import database
from app.db.redis_service import RedisService
from app.integrations.response_generator import ResponseGenerator

# Initialize services
redis_service = RedisService()
message_service = MessageService(redis_service)


@celery_app.task(name="tasks.produce_messages")
def produce_messages():
    """Use dedicated event loop for each task"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(produce_messages_async())
    finally:
        loop.close()



@celery_app.task(name="tasks.consume_messages")
def consume_messages():
    """Consumer: Processes and sends queued messages"""
    try:
        asyncio.run(consume_messages_async())
    except Exception as e:
        logger.error(f"Consumer error: {str(e)}")

async def consume_messages_async():
    """Async logic for processing and sending messages"""
    try:
        # Get pending messages using the service
        messages = message_service.get_pending_messages()

        for message in messages:
            logger.info(f"Processing message {message['id']}")
            try:
                # Send the message
                content = json.loads(message["content"])
                success = await send_user_message(
                    message["phone"],
                    content["content"]  # Using the specific message content
                )

                if success:
                    # Mark as sent using the service
                    message_service.mark_message_sent(message["id"])
                    logger.info(f"Message sent successfully to {message['phone']}")
                else:
                    logger.error(f"Failed to send message to {message['email']}")

            except Exception as e:
                logger.error(f"Error processing message {message['id']}: {str(e)}")

    except Exception as e:
        logger.error(f"Async consumer error: {str(e)}")


async def produce_messages_async():
    """Async logic for scheduling newsletters"""
    db = database.SessionLocal()
    try:
        response_gen = ResponseGenerator()
        target_hours_messages = response_gen.get_prompts_for_schedule()

        users = await get_users_for_scheduling(db, 60, target_hours_messages)
        for user in users:
            try:
                target_time = datetime.fromisoformat(user["scheduled_for"])
                # Check existing newsletters
                existing_newsletters = message_service.get_user_messages(user["user_id"])
                if any(
                        abs(float(n["scheduled_time"]) - target_time.timestamp()) < 3600
                        for n in existing_newsletters
                ):
                    logger.info(f"Message already scheduled for {user['user_id']} at {target_time}")
                    continue
                # Generate message content
                message_data = {
                    "scheduled_time": target_time.timestamp(),
                    "phone": user["phone"],
                    "email": user["email"],
                    "content": {
                        "content": user["message_to_send"]
                    }
                }

                # Enqueue message using the ACTUAL target time
                success = message_service.enqueue_message(
                    user["user_id"],
                    target_time,
                    message_data
                )

                if success:
                    logger.info(f"Scheduled message for {user['user_id']} at {target_time}")
                else:
                    logger.error(f"Failed to schedule for {user['user_id']}")

            except Exception as e:
                logger.error(f"Error processing {user['user_id']}: {str(e)}")

    except Exception as e:
        logger.error(f"Producer error: {str(e)}")
    finally:
        db.close()