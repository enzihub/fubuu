# Fubuu core

FastAPI backend for [Fubuu](../README.md). It receives WhatsApp messages from Twilio, transcribes voice notes with Whisper, writes a post per platform with OpenAI, posts it to X, LinkedIn and Threads with the user's Clerk OAuth tokens, and replies on WhatsApp.

```
main.py                         FastAPI app, API-key middleware, CORS
app/core/api/routes.py          /whatsapp-webhook, /twilio-webhook, /whatsapp-welcome, /health
app/integrations/               whatsapp, transcription, socials (X / LinkedIn / Threads), replies
app/core/ai/prompts.py          the post-writing prompts
app/core/ratelimit/             per-platform daily limits in Redis
app/core/scheduled_messenger/   Celery jobs that send daily writing prompts
app/db/                         SQLAlchemy models (schema owned by web/src/db)
```

Run locally:

```bash
uv venv --python 3.12 && uv pip install -r requirements.txt
cp .env.example .env   # fill in
uv run uvicorn main:app --reload --port 8000
uv run pytest
```

Or run everything with stubs: `bash ../demo/run.sh`.
