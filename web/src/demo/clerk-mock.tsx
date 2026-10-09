'use client';
/**
 * Demo-mode stand-in for @clerk/nextjs (client side).
 * Enabled only when FUBUU_DEMO=1 (see next.config.mjs). It signs everyone in as
 * one invented demo user so the app can run locally with no Clerk account.
 */
import React from 'react';

const demoUser: any = {
  id: 'user_demo',
  fullName: 'Maya Ortiz',
  firstName: 'Maya',
  imageUrl: '',
  primaryEmailAddress: { emailAddress: 'maya@example.com' },
  emailAddresses: [{ emailAddress: 'maya@example.com' }],
  createdAt: new Date('2025-03-01T09:00:00Z'),
  lastSignInAt: new Date('2025-03-20T08:12:00Z'),
  externalAccounts: [
    { verification: { strategy: 'oauth_x', status: 'verified' }, destroy: async () => {} },
    { verification: { strategy: 'oauth_linkedin_oidc', status: 'verified' }, destroy: async () => {} },
  ],
  createExternalAccount: async () => ({ verification: { status: 'verified' } }),
};

export const ClerkProvider = ({ children }: any) => <>{children}</>;
export const useUser = () => ({ isLoaded: true, isSignedIn: true, user: demoUser });
export const useAuth = () => ({
  isLoaded: true,
  userId: demoUser.id,
  sessionId: 'sess_demo',
  getToken: async () => 'demo-token',
});
export const useClerk = () => ({ signOut: async () => {} });
export const SignedIn = ({ children }: any) => <>{children}</>;
export const SignedOut = (_: any) => null;
export const UserButton = () => null;
export const UserProfile = () => null;
const Pass = ({ children }: any) => <>{children}</>;
export const SignInButton = Pass;
export const SignUpButton = Pass;
export const SignOutButton = Pass;
export const SignIn = () => (
  <p className='text-white/70'>Demo mode: you are signed in as an invented user.</p>
);
export const SignUp = SignIn;
