# response_generator.py
import os
import random
from datetime import datetime
from enum import Enum
from typing import List, Dict, Optional, Tuple, Union

from app.config import settings


class MessageType(Enum):
    NO_ACCOUNT = "no_account"
    NEW_USER = "new_user"
    POST_SUCCESS = "post_success"
    PARTIAL_SUCCESS = "partial_success"
    SYSTEM_ERROR = "system_error"
    INPUT_RECEIVED = "input_received"
    ALL_FAILED = "all_failed"
    PROMPT = "prompt"
    CHECKIN_24H = "checkin_24h"
    UPGRADE = "upgrade"

class ResponseGenerator:
    def __init__(self):
        self.SUPPORT_PHONE = settings.SUPPORT_PHONE or ""
        self.COMMUNITY_LINK = settings.COMMUNITY_LINK or ""
        self.WELCOME_GIF = os.getenv("WELCOME_GIF_URL", "")

        self.PLATFORM_EMOJIS = {
            "Twitter": "🕊️",
            "LinkedIn": "💼",
            "Facebook": "👥",
            "Instagram": "📸",
            "Threads": "🧵"
        }

        # Define local timezone target hours for the user to get reminder messages to post.
        self.TARGET_HOURS = {
            800: None,
            1200: None,
            1700: None
        }

        self.PROMPT_MESSAGES = [
            "Hey, it's time to tweet! What's something you realized today?",
            "What's a piece of advice that actually works? Drop a voice note!",
            "If you had to give a TED Talk with no prep, what would it be about?",
            "What's one thing people overcomplicate way too much?",
            "What's something obvious in hindsight but took you years to learn?",
            "If you could leave one tweet as your legacy, what would it say?",
            "What's something people get wrong about your job or industry?",
            "What's an underrated skill that more people should develop?",
            "What's something that instantly makes you respect someone?",
            "What's a simple habit that changed your life? Drop a voice note!",
            "If today had a theme, what would it be?",
            "What's a mistake you made recently that taught you something valuable?",
            "What's one thought you keep coming back to lately?",
            "What's a mindset shift that improved your life?",
            "Hey, time to drop some wisdom. What's something you know now that you wish you knew earlier?",
            "What's one thing you think about way too much?",
            "What's something that always sparks your creativity?",
            "What's a common myth in your industry that needs to die?",
            "What's one thing about life that nobody warns you about?",
            "What's a problem you'd love to solve if you had unlimited resources?",
            "What's something people believe, but you think is completely wrong?",
            "What's an unpopular opinion that you're willing to defend?",
            "What's a piece of advice that completely changed how you see things?",
            "If you had to describe your life in one tweet, what would it say?",
            "What's a challenge you overcame recently?",
            "What's a decision you're proud of making?",
            "What's a concept or framework you use all the time?",
            "What's a topic you could talk about for hours?",
            "If you could instantly learn one skill, what would it be?",
            "What's a question that's been stuck in your head lately?",
            "What's the best book, podcast, or article you've come across recently?",
            "What's a life lesson you learned outside of school?",
            "What's something you used to struggle with that now feels easy?",
            "What's something small that made a huge difference in your life?",
            "What's a phrase or quote you live by?",
            "What's something that never fails to make you smile?",
            "What's something underrated about the way you work?",
            "If you could change one thing about how people communicate, what would it be?",
            "What's a piece of advice you wish more people would follow?",
            "What's a productivity hack that actually works for you?",
            "If you could go back five years, what would you do differently?",
            "What's something you thought was a failure but turned out to be a win?",
            "What's a random fact that more people should know?",
            "What's a weird habit that helps you stay focused?",
            "What's something that took you a long time to understand?",
            "What's a problem in the world that frustrates you the most?",
            "If you could only tweet once a month, what would your next tweet be?",
            "What's something people don't appreciate enough?",
            "What's a simple truth that people overcomplicate?",
            "Hey, drop a voice note—what's the last thing you Googled?"
        ]

    def get_prompts_for_schedule(self) -> Dict[int, str]:
        """Generate unique random prompts for all target hours using date as seed"""
        # Create seed from current date (YYYYMMDD format)
        today = datetime.now()
        date_seed = int(today.strftime('%Y%m%d'))

        # Set seed for consistent randomization within the day
        random.seed(date_seed)

        # Get unique prompts for each time slot
        prompts = dict(zip(
            self.TARGET_HOURS,
            random.sample(self.PROMPT_MESSAGES, len(self.TARGET_HOURS))
        ))

        # Reset the random seed to avoid affecting other random operations
        random.seed()

        return prompts

    def generate_response(
            self,
            msg_type: MessageType,
            posting_results: Optional[List[Dict]] = None,
            current_time: Optional[str] = None,
            date: Optional[str] = None
    ) -> Union[str, Tuple[dict, str], List[str] | dict]:

        if msg_type == MessageType.NO_ACCOUNT:
            message = {
                "content": "No Account Placeholder",
                "variables": {
                    "1": self.SUPPORT_PHONE,
                    "2": self.COMMUNITY_LINK
                }
            }
            return message

        if msg_type == MessageType.NEW_USER:
            message = {
                "content": "Welcome Placeholder",
                "variables": {
                    "1": self.SUPPORT_PHONE,
                    "2": self.COMMUNITY_LINK
                }
            }
            return (message, self.WELCOME_GIF)

        if msg_type == MessageType.CHECKIN_24H:
            message = {
                "content": "24H Check-in Placeholder"
            }
            return message

        if msg_type == MessageType.UPGRADE:
            message = {
                "content": "Upgrade Placeholder"
            }
            return message

        elif msg_type == MessageType.SYSTEM_ERROR or msg_type == MessageType.ALL_FAILED:
            contact = f" If it persists, WhatsApp us at {self.SUPPORT_PHONE}." if self.SUPPORT_PHONE else ""
            return f"Oops, system hiccup! Try again in a few minutes.{contact}"

        elif msg_type == MessageType.INPUT_RECEIVED:
            return "Your wisdom is being processed 🔨"

        elif msg_type in [MessageType.POST_SUCCESS, MessageType.PARTIAL_SUCCESS]:
            if not posting_results:
                return "No social media accounts connected yet! Connect your accounts to get started ✨"

            responses = []
            successful_posts = False

            for result in posting_results:
                platform = result["platform"]
                emoji = self.PLATFORM_EMOJIS.get(platform, "✨")

                if result["status"] == "success":
                    successful_posts = True
                    response = f"{platform} Posted {emoji}\n{current_time} on {date}"
                    if content := result.get("content"):
                        response += f'\n"{content}"'
                    responses.append(response)
                else:
                    # Handle different types of failures
                    # Only send messages for rate limits
                    if result["status"] == "rate_limited":
                        hours = round(result["retry_after"] / 3600, 1)
                        responses.append(
                            f"Oops! It looks like you've hit your daily limit for {platform}! "
                            f"Try again in {hours}h."
                        )
                    # elif result["status"] == "critical_failure":
                    #     responses.append(
                    #         f"Oops! We couldn't post to {platform} right now. Please try again shortly."
                    #     )
                    # elif result["status"] == "auth_error":
                    #     responses.append(
                    #         f"Your {platform} account needs to be reconnected. "
                    #         f"Please reconnect it from your dashboard."
                    #     )

            # If no successful posts and no specific error messages, return general failure
            if not responses:
                return self.generate_response(msg_type=MessageType.ALL_FAILED)

            return responses

        raise ValueError(f"Unknown message type: {msg_type}")