# message_service.py

import json
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config.logger import logger
from app.db.redis_service import RedisService
from app.integrations.whatsapp_integration import send_whatsapp_message


class MessageService:
    def __init__(self, redis_service: RedisService):
        self.redis = redis_service
        self.namespace = "message"
        self.set_key = "pending_messages"

    def _get_message_key(self, user_id: str, timestamp: float) -> str:
        return f"{self.namespace}:{user_id}:{timestamp}"

    def enqueue_message(self, user_id: str, send_time: datetime, message_data: Dict) -> bool:
        try:
            timestamp = send_time.timestamp()
            message_key = self._get_message_key(user_id, timestamp)

            # Prepare message data
            message_data = {
                "id": message_key,
                "user_id": user_id,
                "phone": message_data["phone"],
                "email": message_data["email"],
                "content": json.dumps(message_data["content"]),
                "status": "pending",
                "scheduled_time": message_data["scheduled_time"],
                "error": "",
                "created_at": datetime.now().timestamp(),
            }

            # Store hash and add to pending set atomically
            pipe = self.redis.client.pipeline()
            pipe.hset(message_key, mapping=message_data)
            pipe.zadd(self.set_key, {message_key: timestamp})
            pipe.execute()
            return True

        except Exception as e:
            logger.error(f"Error enqueuing message: {e}")
            return False

    def get_pending_messages(self) -> List[Dict]:
        try:
            current_time = datetime.now().timestamp()
            newsletter_keys = self.redis.get_from_sorted_set(
                self.set_key,
                float('-inf'),  # Get all newsletters up to current time
                current_time
            )
            return [data for key in newsletter_keys if (data := self.redis.get_hash(key))]
        except Exception as e:
            logger.error(f"Error fetching pending messages: {e}")
            return []

    def get_user_messages(self, user_id: str) -> List[Dict]:
        """Get messages for a user using key pattern"""
        try:
            pattern = f"{self.namespace}:{user_id}:*"
            keys = self.redis.client.keys(pattern)
            return [data for key in keys if (data := self.redis.get_hash(key))]
        except Exception as e:
            logger.error(f"Error fetching user newsletters: {e}")
            return []

    def mark_message_sent(self, newsletter_key: str) -> bool:
        """Mark a message as sent and remove from pending"""
        try:
            pipe = self.redis.client.pipeline()
            pipe.hset(newsletter_key, "status", "sent")
            pipe.zrem(self.set_key, newsletter_key)
            pipe.execute()
            return True
        except Exception as e:
            logger.error(f"Error marking message as sent: {e}")
            return False


# Helper functions remain unchanged
async def send_user_message(user_channel: str, content: str) -> bool:
    logger.info(f"Sending message to {user_channel}...")
    logger.info(f"Message content: {content}")
    await send_whatsapp_message(user_channel, content)
    return True


async def get_users_for_scheduling(
        db: Session,
        lookahead_minutes: int,
        target_hours_messages: Dict[int, str]
) -> List[Dict]:
    """
    Calls the stored procedure with dynamic target hours and maps messages
    """
    try:
        target_hours = list(target_hours_messages.keys())

        query = text("""
            SELECT * FROM get_scheduled_users(:lookahead_minutes, :target_hours)
        """)

        result = db.execute(query, {
            "lookahead_minutes": lookahead_minutes,
            "target_hours": target_hours
        }).fetchall()

        return [
            {
                "user_id": str(row.user_id),
                "email": row.email,
                "phone": row.phone,
                "timezone": row.timezone,
                "scheduled_for": row.scheduled_for.isoformat(),
                "local_time": row.local_time,
                "target_hour": row.target_hour,
                "message_to_send": target_hours_messages.get(row.target_hour, "Default message")
            }
            for row in result
        ]

    except Exception as e:
        print(f"Error fetching users for scheduling: {str(e)}")
        return []



# async def get_users_for_scheduling(lookahead_minutes: int) -> List[Dict]:
#     return [{"user_id": "123", "email": "someone@example.com"}]


async def generate_message_content(email: str) -> Optional[Dict]:
    try:
        logger.info(f"Generating message content for {email}...")
        return {"content": "This is the content of the message"}
    except Exception as e:
        logger.error(f"Error generating message content: {str(e)}")
        raise e