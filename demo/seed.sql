-- Invented demo data. Every person, email and phone number here is fictional
-- (555 numbers and example.com addresses).
INSERT INTO users (id, clerk_id, full_name, email, created_at, updated_at) VALUES
  ('5b0c1f9e-6a1d-4c51-9a55-1d7a8c2f0001', 'user_demo', 'Maya Ortiz', 'maya@example.com', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO subscriptions (id, user_id, email, status, price_id, quantity, cancel_at_period_end,
  current_period_start, current_period_end, trial_start, trial_end, created_at, updated_at) VALUES
  ('sub_demo_0001', '5b0c1f9e-6a1d-4c51-9a55-1d7a8c2f0001', 'maya@example.com', 'trialing',
   'price_demo_month', 1, false, now(), now() + interval '7 days', now(), now() + interval '7 days', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO user_prefs (user_id, email, description, timezone, phone, custom_prompt, created_at, updated_at) VALUES
  ('5b0c1f9e-6a1d-4c51-9a55-1d7a8c2f0001', 'maya@example.com',
   'indie founder building a calm budgeting app, writes about shipping small',
   'America/New_York', '+15555550142', '', now(), now())
ON CONFLICT DO NOTHING;
