import Stripe from 'stripe';
import { makeStripe } from '../_utils/make-stripe';
import { SubscriptionPlan } from '../_interfaces/subscription-plan.interface';

const stripe = makeStripe();

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    });

    // Get active prices (plans)
    return prices.data
      .filter((price) => (price.product as Stripe.Product).active)
      .map((price) => ({
        id: price.id,
        name: (price.product as Stripe.Product).name,
        description: (price.product as Stripe.Product).description || '',
        price: price.unit_amount || 0,
        interval: price.recurring?.interval || 'monthly',
        price_id: price.id,
      }));
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw new Error('Failed to fetch subscription plans');
  }
}
