import Stripe from 'stripe';

/**
 * One place to build the Stripe client. STRIPE_API_BASE (e.g.
 * http://127.0.0.1:8790) points it at a local stub for demos and tests.
 */
export function makeStripe(): Stripe {
  const base = process.env.STRIPE_API_BASE;
  if (!base) return new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const u = new URL(base);
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo', {
    host: u.hostname,
    port: Number(u.port || (u.protocol === 'https:' ? 443 : 80)),
    protocol: u.protocol.replace(':', '') as 'http' | 'https',
  });
}
