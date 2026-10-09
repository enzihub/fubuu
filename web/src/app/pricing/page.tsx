'use client'; // Marks this as a client-side component in Next.js

// Import necessary dependencies and components
import { useEffect, useState } from 'react';
import HeroSection from '../dashboard/_components/hero';
import PriceCard from './_components/pricing-card';
import TabSwitcher from './_components/tab-switcher';
import { getPricingPlans, subscribeToPrice } from './_services/price-service';
import { SubscriptionPlan } from '../(billing)/_interfaces/subscription-plan.interface';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

/**
 * PricingPage Component
 * Displays pricing plans with monthly/yearly toggle functionality
 * Fetches plan data from API and renders individual price cards
 */
export default function PricingPage() {
  // State management
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly'); // Controls billing interval selection
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]); // Stores pricing plans from API
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Fetch pricing plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPricingPlans();
        setPlans(response.plans);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  /**
   * Handler for enterprise plan demo button
   * Currently just logs to console, can be expanded for actual demo booking logic
   */
  const handleEnterprisePlanButtonClick = () => {
    const phoneNumber = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '').replace(/\D/g, '');
    if (!phoneNumber) return;
    const message =
      "Hi! I'm interested in learning more about the enterprise plan.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * Filters plans based on selected billing interval
   * Converts 'monthly'/'yearly' selection to 'month'/'year' to match API data
   */
  const filteredPlans = plans.filter(
    (plan) => plan.interval === (interval === 'monthly' ? 'month' : 'year'),
  );

  /**
   * Handles tab change between monthly and yearly billing
   * @param tab - Selected tab value ('monthly' or 'yearly')
   */
  const handleTabChange = (tab: string) => {
    setInterval(tab === 'monthly' ? 'monthly' : 'yearly');
  };

  /**
   * Formats price number to currency string
   * Converts cents to dollars and adds $ symbol
   * @param price - Price in cents
   * @returns Formatted price string (e.g., "$29.99")
   */
  const formatPrice = (price: number) => {
    return `$${price / 100}`;
  };

  /**
   * Handles click on plan selection button
   * Currently logs plan details, can be expanded for checkout/subscription flow
   * @param plan - Selected subscription plan object
   */
  const handlePlanButtonClick = async (plan: SubscriptionPlan) => {
    // Initiate a checkout session for selected plan
    await subscribeToPrice(
      plan.price_id,
      user?.primaryEmailAddress?.emailAddress!,
    );
  };

  return (
    <div className='w-full'>
      {/* Hero section with main heading and plan selection prompt */}
      <HeroSection
        heading='Welcome to Fubuu'
        subHeading='Do you plan on using Fubuu by yourself, or with your team?'
      >
        {isLoading ? (
          <div className='flex min-h-[50vh] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          </div>
        ) : (
          <div className='ms:mx-12 mx-8'>
            {/* Monthly/Yearly billing interval selector */}
            <TabSwitcher onTabChange={handleTabChange} />

            {/* Pricing cards container with responsive layout */}
            <div className='mt-8 flex flex-wrap justify-center gap-5 px-4'>
              {/* Render dynamic pricing plans from API */}
              {filteredPlans.map((plan) => (
                <PriceCard
                  key={plan.id}
                  title={plan.name}
                  subtitle={plan.description}
                  price={formatPrice(plan.price)}
                  plan={`/${plan.interval}`}
                  buttonText={
                    plan.name.toLowerCase().includes('enterprise')
                      ? 'Book Demo'
                      : 'Try Fubuu For Free'
                  }
                  onButtonClick={() => handlePlanButtonClick(plan)}
                  conditionsArray={[
                    // Base features available in all plans
                    'Convert voice notes into tweets',
                    'AI-enhanced tweet structuring',
                    'Personalized content tone matching',
                    'No writing required—just speak naturally',
                    'Also supports LinkedIn and Threads',
                    // Additional features for enterprise plans
                    ...(plan.name.toLowerCase().includes('enterprise')
                      ? [
                          'Bulk team deployment',
                          'Custom integrations for team workflows',
                          'Priority support & onboarding',
                          'Enterprise-grade security',
                        ]
                      : []),
                  ]}
                />
              ))}

              {/* Static Enterprise Plan card with custom pricing */}
              <PriceCard
                title='Enterprise Plan'
                subtitle='Made for large organizations.'
                price='Custom'
                buttonText='Book Demo'
                onButtonClick={handleEnterprisePlanButtonClick}
                conditionsArray={[
                  'Everything in Personal Plan',
                  'Bulk team deployment',
                  'Custom integrations for team workflows',
                  'Priority support & onboarding',
                  'Enterprise-grade security',
                ]}
              />
            </div>
            <div className='traching-[-0.02em] mt-8 flex items-center justify-center text-center text-white/60'>
              <p>
                All plans include a 7-day free trial. No credit card required.
              </p>
            </div>
          </div>
        )}
      </HeroSection>
    </div>
  );
}
