# Fubuu web

Next.js 14 app for [Fubuu](../README.md): Clerk sign-in, the onboarding dashboard (connect X / LinkedIn / Threads, WhatsApp number, bio, custom prompt), settings, pricing and Stripe billing. Data lives in Postgres through Drizzle ORM and the Neon serverless driver.

```bash
npm install
cp .env.example .env.local     # fill in
npm run dev
```

Local Postgres: `docker compose -f src/db/docker-compose.yml up -d`, then set `DATABASE_URL=postgresql://postgres:postgres@db.localtest.me:4444/main` and `LOCAL_DB_HTTP_ENDPOINT=http://127.0.0.1:4444/sql`, and run `npm run db:migrate:dev`.

Stripe: `stripe fixtures src/app/\(billing\)/_utils/stripe-fixtures.json` creates the products and prices; `npm run stripe:listen` forwards webhooks.

`FUBUU_DEMO=1` swaps Clerk for an invented local user (`src/demo/`). See `../demo/run.sh`.
