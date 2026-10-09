"""Local stand-ins for every outside service Fubuu talks to.

Run it, point the env vars in demo/demo.env at it, and the real backend and
web app work end to end on your machine with invented data:

    python demo/fake_services.py            # listens on 127.0.0.1:18793

It fakes:
  * OpenAI      POST /v1/chat/completions, POST /v1/audio/transcriptions
  * X (Twitter) POST /2/tweets
  * LinkedIn    GET /v2/userinfo, POST /v2/ugcPosts
  * Threads     POST /v1.0/me/threads, POST /v1.0/me/threads_publish
  * Clerk       GET /v1/users/{id}/oauth_access_tokens/{provider}
  * Twilio      POST /2010-04-01/Accounts/{sid}/Messages.json
  * Stripe      GET /v1/prices, GET /v1/prices/{id}, POST checkout/portal sessions

Nothing here talks to the internet. Every post is written to an in-memory
"timeline" you can read at GET /_timeline (and GET /_outbox for WhatsApp
replies). The tweets it writes are invented demo content.
"""
from __future__ import annotations

import json
import os
import re
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.getenv("FAKE_PORT", "18793"))

TIMELINE: list[dict] = []   # posts that "went out" to X / LinkedIn / Threads
OUTBOX: list[dict] = []     # WhatsApp messages Fubuu sent back to the user


def viral_rewrite(raw: str, platform: str) -> str:
    """A deterministic stand-in for the LLM: turns a rambling note into a post."""
    text = re.sub(r"\s+", " ", raw).strip()
    filler = r"^(so|um+|uh+|okay|ok|like|basically|i (?:just )?realised(?: today)? that|i think)[, ]+"
    while re.match(filler, text, flags=re.I):
        text = re.sub(filler, "", text, count=1, flags=re.I)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    hook = sentences[0] if sentences else text
    hook = hook[0].upper() + hook[1:] if hook else hook
    rest = sentences[1:3]
    if platform == "linkedin":
        body = "\n\n".join(rest) if rest else ""
        return f"{hook}\n\n{body}\n\nWhat would you add?".strip()
    lines = [hook] + [f"→ {s}" for s in rest]
    post = "\n\n".join(lines)
    return post[:277] + "..." if len(post) > 280 else post


class Handler(BaseHTTPRequestHandler):
    server_version = "fubuu-fake/1.0"

    def log_message(self, fmt, *args):  # keep the console readable
        print("fake:", self.command, self.path.split("?")[0])

    # ---- helpers
    def _body(self) -> bytes:
        n = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(n) if n else b""

    def _json(self, obj, status=200):
        data = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    # ---- routes
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/_timeline":
            return self._json(TIMELINE)
        if path == "/_outbox":
            return self._json(OUTBOX)
        if path == "/v2/userinfo":
            return self._json({"sub": "demo-linkedin-id", "name": "Maya Ortiz"})
        m = re.match(r"^/v1/users/([^/]+)/oauth_access_tokens/([^/]+)$", path)
        if m:
            if m.group(2) == "oauth_custom_threads":
                return self._json([])  # Threads not connected in the demo
            return self._json([{"object": "oauth_access_token", "external_account_id": "eac_demo",
                                "provider_user_id": "demo", "token": f"demo-{m.group(2)}-token",
                                "provider": m.group(2), "public_metadata": {}, "label": None,
                                "scopes": ["tweet.write"], "expires_at": int(time.time()) + 3600,
                                "id_token": None, "token_secret": None}])
        if path == "/v1/prices":
            return self._json({"object": "list", "has_more": False, "url": "/v1/prices", "data": PRICES})
        m = re.match(r"^/v1/prices/([^/]+)$", path)
        if m:
            return self._json(next((p for p in PRICES if p["id"] == m.group(1)), PRICES[0]))
        return self._json({"error": "not found", "path": path}, 404)

    def do_POST(self):
        path = urlparse(self.path).path
        raw = self._body()
        ctype = self.headers.get("Content-Type", "")

        if path == "/v1/chat/completions":
            req = json.loads(raw or b"{}")
            prompt = req.get("messages", [{}])[-1].get("content", "")
            notes = re.findall(r"<user input>\n(.*?)\n</user input>", prompt, re.S)
            platform = "linkedin" if "LinkedIn" in prompt else "x"
            out = viral_rewrite(notes[-1] if notes else prompt, platform)
            return self._json({"id": "chatcmpl-demo", "object": "chat.completion", "created": int(time.time()),
                               "model": req.get("model", "demo"),
                               "choices": [{"index": 0, "finish_reason": "stop",
                                            "message": {"role": "assistant", "content": out}}],
                               "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}})
        if path == "/v1/audio/transcriptions":
            return self._json({"text": "So I realised today that the best ideas come on walks, not in meetings."})

        if path == "/2/tweets":
            text = json.loads(raw or b"{}").get("text", "")
            tid = str(1900000000000000000 + len(TIMELINE))
            TIMELINE.append({"platform": "X", "id": tid, "text": text, "at": time.time()})
            return self._json({"data": {"id": tid, "text": text}}, 201)
        if path == "/v2/ugcPosts":
            body = json.loads(raw or b"{}")
            text = body["specificContent"]["com.linkedin.ugc.ShareContent"]["shareCommentary"]["text"]
            TIMELINE.append({"platform": "LinkedIn", "id": f"urn:li:share:{len(TIMELINE)}", "text": text,
                             "at": time.time()})
            return self._json({"id": f"urn:li:share:{len(TIMELINE)}"}, 201)
        if path == "/v1.0/me/threads":
            return self._json({"id": "threads-container-1"})
        if path == "/v1.0/me/threads_publish":
            return self._json({"id": "threads-post-1"})

        m = re.match(r"^/2010-04-01/Accounts/([^/]+)/Messages\.json$", path)
        if m:
            form = {k: v[0] for k, v in parse_qs(raw.decode()).items()}
            OUTBOX.append({"to": form.get("To"), "body": form.get("Body"),
                           "template": form.get("ContentSid"), "at": time.time()})
            sid = f"SM{len(OUTBOX):032d}"
            return self._json({"sid": sid, "account_sid": m.group(1), "status": "queued",
                               "to": form.get("To"), "from": form.get("From"), "body": form.get("Body"),
                               "num_segments": "1", "direction": "outbound-api", "api_version": "2010-04-01",
                               "date_created": None, "date_updated": None, "date_sent": None,
                               "uri": f"/2010-04-01/Accounts/{m.group(1)}/Messages/{sid}.json"}, 201)

        if path == "/v1/checkout/sessions":
            return self._json({"id": "cs_test_demo", "object": "checkout.session", "url": "/dashboard"})
        if path == "/v1/billing_portal/sessions":
            return self._json({"id": "bps_demo", "object": "billing_portal.session", "url": "/settings"})
        return self._json({"error": "not found", "path": path}, 404)


def _price(pid, amount, interval, name, desc):
    return {"id": pid, "object": "price", "active": True, "currency": "usd", "unit_amount": amount,
            "type": "recurring", "recurring": {"interval": interval, "interval_count": 1},
            "product": {"id": "prod_demo_" + interval, "object": "product", "active": True,
                        "name": name, "description": desc}}


PRICES = [
    _price("price_demo_month", 2900, "month", "Personal Plan", "For creators who think out loud."),
    _price("price_demo_year", 22800, "year", "Personal Plan", "For creators who think out loud."),
]

if __name__ == "__main__":
    print(f"Fubuu fake services on http://127.0.0.1:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
