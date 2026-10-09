'use client';
import { useEffect, useState } from 'react';
import { YourPlanCard } from '@/app/(billing)/_components/your-plan-card';
import { ProfileDetailsCard } from '../../(user)/_components/profile-details-card';
import { NeedAssistance } from './need-assistance';
import { useUser } from '@clerk/nextjs';
import { AccountActionsCard } from '@/app/(user)/_components/account-actions.card';
import { Stripe } from 'stripe';
import { TweetCard } from '@/app/(newsletter)/_components/tweet-card';

interface ProfileContentProps {
  subscription: any;
  price: any;
}

export function SettingsContent({ subscription, price }: ProfileContentProps) {
  // const { user, loading } = useUser();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  // const [preferredHour, setPreferredHour] = useState(8);

  // if (!isLoading) {
  // if (isUserLoaded) {
  //   return (
  //     <div className='flex items-center justify-center'>
  //       <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
  //     </div>
  //   );
  // }

  if (!user) return null;
  //
  // let userProduct: ProductWithPrices | undefined;
  // let userPrice: Price | undefined;

  // if (subscription) {
  //   for (const product of products) {
  //     for (const price of product.prices) {
  //       if (price.id === subscription.price_id) {
  //         userProduct = product;
  //         userPrice = price;
  //       }
  //     }
  //   }
  // }

  return (
    <div className='mx-auto'>
      <div className='mx-auto max-w-4xl space-y-4 px-8 text-center'>
        {/* <span className='inline-block px-4 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-900'>Profile</span> */}
        <h1 className='text-6xl tracking-tight text-white/90'>
          Welcome, {user.fullName?.split(' ')[0] || 'User'} 👋
        </h1>
        <h1 className='text-6xl tracking-tight text-white/90'>
          Customize your preferences
        </h1>
        <p className='my-3 px-16 py-4 text-xl text-white/60'>
          Set how Fubuu writes for you and where it posts,
          then just send voice notes.
        </p>
      </div>

      <div className='grid gap-4 py-16 md:grid-cols-2'>
        <ProfileDetailsCard user={user} />
        {/*<NewsletterCard />*/}
        <TweetCard />
        <div className='md:col-span-2'>
          <YourPlanCard subscription={subscription} price={price} />
        </div>
        <div className='md:col-span-2'>
          <AccountActionsCard />
        </div>
      </div>
      <NeedAssistance />
    </div>
  );
}
