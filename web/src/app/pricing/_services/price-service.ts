// services/pricingService.ts
import { SubscriptionPlanResponse } from '@/app/(billing)/_interfaces/subscription-plan.interface';
import { loadStripe } from '@stripe/stripe-js';

export async function getPricingPlans(): Promise<SubscriptionPlanResponse> {
  try {
    const response = await fetch('/api/pricing');
    console.log('Pricing plans:', response);
    return response.json();
  } catch (error) {
    console.error('Error fetching pricing plans from stripe', error);
    throw new Error('Failed to fetch pricing plans from stripe');
  }
}

export async function subscribeToPrice(priceId: string, email: string) {
  const stripePromise = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );
  const stripe = await stripePromise;
  const { sessionId } = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, email }),
  }).then((res) => res.json());

  const result = await stripe?.redirectToCheckout({ sessionId });

  if (result?.error) {
    console.error(result.error);
  }
}
