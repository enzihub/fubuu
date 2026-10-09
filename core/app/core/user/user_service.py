from datetime import datetime
from typing import Dict
from dotenv import load_dotenv
from app.core.config.logger import logger
from sqlalchemy.orm import Session

from app.db.models import User, UserPreference

load_dotenv()

async def get_user_by_id(db: Session, user_id: str) -> Dict:
    """Fetch user details from the database."""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.error(f"User not found for {user_id}")
            raise ValueError(f"User not found for {user_id}")

        return {
            "full_name": user.full_name,
            "email": user.email,
            "user_id": str(user.id),
            "clerk_id": user.clerk_id
        }
    except Exception as e:
        logger.error(f"Error fetching user details for user_id {user_id}: {str(e)}")
        raise e


async def get_user_details(db: Session, email: str) -> Dict:
    """Fetch user details from the database."""
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.error(f"User not found for {email}")
            raise ValueError(f"User not found for {email}")

        return {
            "full_name": user.full_name,
            "email": user.email,
            "user_id": str(user.id)
        }
    except Exception as e:
        logger.error(f"Error fetching user details for email {email}: {str(e)}")
        raise e


async def get_user_prefs(db: Session, phone_number: str) -> Dict:
    try:
        user_pref = (
            db.query(UserPreference)
            .filter(UserPreference.phone == phone_number)
            .first()
        )

        if not user_pref:
            logger.info(f"No user preferences found for phone number: {phone_number}")
            return None

        return {
            "user_id": str(user_pref.user_id),
            "phone": user_pref.phone,
            "email": user_pref.email,
            "description": user_pref.description,
            "timezone": user_pref.timezone,
            "last_message_timestamp_utc": user_pref.last_message_timestamp_utc,
            "custom_prompt": user_pref.custom_prompt
        }
    except Exception as e:
        logger.error(f"Error checking user phone number: {str(e)}")
        raise


async def update_last_message_timestamp(db: Session, phone_number: str) -> Dict:
    try:
        # First update the timestamp
        result = (
            db.query(UserPreference)
            .filter(UserPreference.phone == phone_number)
            .update(
                {"last_message_timestamp_utc": datetime.now()},
                synchronize_session=False
            )
        )

        # If no rows were updated, return None
        if result == 0:
            logger.info(f"No user preferences found for phone number: {phone_number}")
            return None

        # Commit the update
        db.commit()

        # Then fetch the updated user separately
        updated_user = (
            db.query(UserPreference)
            .filter(UserPreference.phone == phone_number)
            .first()
        )

        return {
            "user_id": str(updated_user.user_id),
            "phone": updated_user.phone,
            "email": updated_user.email,
            "description": updated_user.description,
            "timezone": updated_user.timezone,
            "last_message_timestamp_utc": updated_user.last_message_timestamp_utc
        }
    except Exception as e:
        logger.error(f"Error updating last message timestamp: {str(e)}")
        raise