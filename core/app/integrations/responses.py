# responses.py

from datetime import datetime
from typing import List, Dict, Tuple

import pytz

from app.integrations.response_generator import ResponseGenerator, MessageType


async def get_responses_to_send(posting_results: List[Dict], timezone: str = None) -> List[str]:
    """
    Generate appropriate responses for each platform result separately
    Returns a list of messages that need to be sent to the user

    Args:
        posting_results: List of dictionaries containing posting results
        timezone: User's timezone (e.g., 'America/New_York', 'Europe/London')
    """
    # Use provided timezone if available, otherwise use UTC as default
    if timezone and timezone in pytz.all_timezones:
        # Convert current time to user's timezone
        current_time_utc = datetime.now(pytz.UTC)
        user_timezone = pytz.timezone(timezone)
        local_time = current_time_utc.astimezone(user_timezone)
    else:
        # Default to system timezone if no valid timezone provided
        local_time = datetime.now()

    # Format the time and date according to user's locale
    current_time = local_time.strftime("%I:%M%p").lower().lstrip('0')
    date = local_time.strftime("%d/%m/%Y")

    generator = ResponseGenerator()

    response = generator.generate_response(
        msg_type=MessageType.POST_SUCCESS,
        posting_results=posting_results,
        current_time=current_time,
        date=date
    )

    # If response is a list, return it as is
    # If it's a single string, wrap it in a list
    return response if isinstance(response, list) else [response]


def get_input_received_response() -> str:
    """Generate response for when input is received"""
    return ResponseGenerator().generate_response(msg_type=MessageType.INPUT_RECEIVED)


def get_system_error_response() -> str:
    """Generate system error response"""
    return ResponseGenerator().generate_response(msg_type=MessageType.SYSTEM_ERROR)


def get_no_account_response() -> str:
    """Generate no account response"""
    return ResponseGenerator().generate_response(msg_type=MessageType.NO_ACCOUNT)


def get_new_user_response() -> Tuple[dict, str]:
    """Generate new user welcome response"""
    return ResponseGenerator().generate_response(msg_type=MessageType.NEW_USER)

def get_24h_checkin_response() -> str:
    """Generate 24h check-in response"""
    return ResponseGenerator().generate_response(msg_type=MessageType.CHECKIN_24H)

def get_upgrade_response() -> str:
    """Generate upgrade response"""
    return ResponseGenerator().generate_response(msg_type=MessageType.UPGRADE)
