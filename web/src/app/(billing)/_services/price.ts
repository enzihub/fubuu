import Stripe from 'stripe';
import { stripeAdmin } from '@/app/(billing)/_utils/stripe-admin';

export async function getPriceFromStripeById(
  priceId: string,
): Promise<Stripe.Response<Stripe.Price>> {
  try {
    const stripePrice = await stripeAdmin.prices.retrieve(priceId);

    return stripePrice;
  } catch (error) {
    throw new Error(`Failed to get price from stripe: ${error}`);
  }
}

