import { SubscriptionPlanResponse } from '@/app/(billing)/_interfaces/subscription-plan.interface';
import { fetchSubscriptionPlans } from '@/app/(billing)/_services/subscription-plans';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const plans = await fetchSubscriptionPlans();
    const response: SubscriptionPlanResponse = { plans };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching subscription plans' },
      { status: 500 },
    );
  }
}
