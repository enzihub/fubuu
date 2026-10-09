/**
 * Demo-mode stand-in for @clerk/nextjs/server. Enabled only when FUBUU_DEMO=1.
 */
import { NextResponse } from 'next/server';

export type WebhookEvent = any;

export const createRouteMatcher = (patterns: string[]) => (req: any) =>
  patterns.some((p) => new RegExp(`^${p}$`).test(req.nextUrl.pathname));

export const clerkMiddleware =
  (handler: (auth: any, req: any) => any) => async (req: any) =>
    (await handler(async () => ({ userId: 'user_demo' }), req)) ??
    NextResponse.next();

export const currentUser = async () => ({
  id: 'user_demo',
  fullName: 'Maya Ortiz',
  primaryEmailAddress: { emailAddress: 'maya@example.com' },
});
