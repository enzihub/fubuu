import asyncio
import os

from dotenv import load_dotenv
from fastapi import HTTPException
from openai import OpenAI, APIError

from app.config import settings
from app.core.config.logger import logger

load_dotenv()

async def transcribe_audio(file_path: str, client=None) -> str:
    """
    Transcribe audio file using OpenAI's Whisper model.

    Args:
        file_path: Path to the audio file
        client: Optional OpenAI client instance for testing

    Returns:
        str: Transcribed text
    """
    if not os.path.exists(file_path):
        logger.error(f"Audio file not found: {file_path}")
        raise HTTPException(status_code=404, detail="Audio file not found")

    try:
        if not client:
            client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
            )

        with open(file_path, 'rb') as audio_file:
            try:
                transcript = await asyncio.to_thread(
                    lambda: client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                )
                return transcript.text
            except APIError as e:
                logger.error(f"OpenAI API error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process audio file")