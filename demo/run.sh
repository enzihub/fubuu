#!/usr/bin/env bash
# Run the whole of Fubuu locally with invented data and no outside accounts.
#   bash demo/run.sh          start everything (Ctrl+C stops the app processes)
#   bash demo/run.sh down     stop and remove the demo containers
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "${1:-}" = "down" ]; then docker compose -f demo/docker-compose.yml down -v; exit 0; fi

echo "1/5  Postgres, Neon HTTP proxy and Redis (127.0.0.1 only)"
docker compose -f demo/docker-compose.yml up -d --wait

echo "2/5  Schema + invented demo user"
for f in web/src/db/migrations/0*.sql; do
  sed 's/--> statement-breakpoint//' "$f" \
    | docker compose -f demo/docker-compose.yml exec -T postgres psql -q -U postgres -d fubuu >/dev/null 2>&1 || true
done
docker compose -f demo/docker-compose.yml exec -T postgres psql -q -U postgres -d fubuu < demo/seed.sql

echo "3/5  Python backend (uv)"
if [ ! -d core/.venv ]; then
  (cd core && uv venv -q --python 3.12 .venv && uv pip install -q --python .venv/bin/python -r requirements.txt)
fi

set -a; . demo/demo.env; set +a

echo "4/5  Stubs on :18793 (X, LinkedIn, Threads, Twilio, OpenAI, Clerk, Stripe) + backend on :18794"
core/.venv/bin/python demo/fake_services.py & PIDS=$!
(cd core && exec .venv/bin/uvicorn main:app --host 127.0.0.1 --port 18794) & PIDS="$PIDS $!"

echo "5/5  Web app on :3000 (demo mode, Clerk replaced by an invented user)"
cat > web/.env.local <<EOF
FUBUU_DEMO=1
DATABASE_URL=$DATABASE_URL_WEB
LOCAL_DB_HTTP_ENDPOINT=$LOCAL_DB_HTTP_ENDPOINT
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_API_BASE=$STRIPE_API_BASE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER="$NEXT_PUBLIC_WHATSAPP_NUMBER"
FUBUU_CORE_API_URL=$FUBUU_CORE_API_URL
FUBUU_CORE_API_KEY=$FUBUU_CORE_API_KEY
EOF
[ -d web/node_modules ] || (cd web && npm install --no-audit --no-fund)
(cd web && FUBUU_DEMO=1 exec npx next dev -H 127.0.0.1 -p 3000) & PIDS="$PIDS $!"

trap 'kill $PIDS 2>/dev/null || true' EXIT INT TERM
echo
echo "  Phone + timeline console:  http://127.0.0.1:18793/console"
echo "  Web dashboard:             http://127.0.0.1:3000/dashboard"
wait
