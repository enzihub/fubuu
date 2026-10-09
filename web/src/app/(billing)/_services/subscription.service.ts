import { and, eq, or } from 'drizzle-orm';
import Stripe from 'stripe';
import { makeStripe } from '../_utils/make-stripe';
import {
  InsertSubscription,
  SelectSubscription,
  subscriptions,
  UpsertSubscriptionInput,
  users,
} from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db/db';

export async function checkIfSubscriptionExistsForClerkId(clerkId: string) {
  try {
    // Get user from clerk user id
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (user.length === 0) {
      return false;
    }

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user[0].id),
          or(
            eq(subscriptions.status, 'trialing'),
            eq(subscriptions.status, 'active'),
          ),
        ),
      )
      .limit(1);

    return subscription.length > 0;
  } catch (error) {
    console.error('Error checking if subscription exists:', error);
    return false;
  }
}

export async function getSubscription(): Promise<SelectSubscription | null> {
  const user = await currentUser();

  if (!user) return null;

  try {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.email, user.primaryEmailAddress?.emailAddress!),
          or(
            eq(subscriptions.status, 'trialing'),
            eq(subscriptions.status, 'active'),
          ),
        ),
      )
      .limit(1);

    return subscription[0] || null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function upsertUserSubscription({
  email,
  subscriptionId,
  customerId,
  isCreateAction,
}: UpsertSubscriptionInput) {
  try {
    let userId: string | null = null;

    if (email) {
      const userData = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (userData[0]) {
        userId = userData[0].id;
      }
    }

    const stripeAdmin = makeStripe();
    const subscription = await stripeAdmin.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ['default_payment_method'],
      },
    );

    if (subscription?.items?.data.length > 0) {
      const subscriptionData = {
        id: subscription.id,
        userId: userId,
        email: email ?? null,
        metadata: JSON.stringify(subscription.metadata),
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelAt: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000)
          : null,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        subscriptionCreatedAt: new Date(subscription.created * 1000),
        subscriptionEndedAt: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : null,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        updatedAt: new Date(),
      } satisfies Partial<InsertSubscription>;

      // Check if subscription exists
      const existingSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, subscription.id))
        .limit(1);

      if (existingSubscription.length === 0) {
        // Insert new subscription
        await db.insert(subscriptions).values({
          ...subscriptionData,
          createdAt: new Date(),
        });
      } else {
        // Update existing subscription
        await db
          .update(subscriptions)
          .set(subscriptionData)
          .where(eq(subscriptions.id, subscription.id));
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to upsert subscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function deleteSubscriptionById(subscriptionId: string) {
  try {
    await db.delete(subscriptions).where(eq(subscriptions.id, subscriptionId));

    return true;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw new Error(
      `Failed to delete subscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
