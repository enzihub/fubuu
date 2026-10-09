import Link from 'next/link';
import { CreditCard, Star } from 'lucide-react';
import { PricingCard } from '@/app/(billing)/_components/price-card';
// import { ProductWithPrices, Price } from '@/app/(billing)/_interfaces/types';
import { Card } from '@/components/ui/card';
import { Subscription } from '@/app/(billing)/_interfaces/subscription.interface';
import { Price } from '@/app/(billing)/_interfaces/price.interface';

interface SubscriptionCardProps {
  subscription: Subscription;
  price: Price;
}

export function YourPlanCard({ subscription, price }: SubscriptionCardProps) {
  console.log(price);

  return (
    <Card
      icon={<CreditCard className='h-5 w-5 text-[#BF8811]' />}
      title='Your Plan 🌟'
      footer={
        subscription ? (
          <Link
            href='/api/manage-subscription'
            className='inline-flex rounded-lg bg-white/15 px-6 py-2.5 text-sm font-bold text-white/90 transition duration-200 hover:bg-white/10'
          >
            Manage subscription
          </Link>
        ) : (
          <Link
            href='/pricing'
            className='inline-flex rounded-lg bg-white/15 px-6 py-2.5 text-sm font-bold text-white/90 transition duration-200 hover:bg-white/10'
          >
            Start a subscription ✨
          </Link>
        )
      }
    >
      {subscription ? (
        <div className='space-y-6 text-white'>
          <PricingCard price={price} />
          {/*<div>{JSON.stringify(subscription)}</div>*/}
        </div>
      ) : (
        <div className='py-8 text-center'>
          <Star className='mx-auto mb-4 h-12 w-12 text-white/90' />
          <p className='mb-2 text-balance text-white/90'>
            No active subscription
          </p>
          <p className='text-sm text-white/60'>
            Choose a plan to unlock all features
          </p>
        </div>
      )}
    </Card>
  );
}
