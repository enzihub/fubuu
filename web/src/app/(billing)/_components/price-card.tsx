// pricing-card.tsx

'use client';

import { CheckCircle2 } from 'lucide-react';

export function PricingCard({ price }: any) {
  const isFree = price.unit_amount === 0;
  const interval = price.recurring?.interval ?? price.interval;
  const isPopular = !isFree && interval === 'year';
  const priceAmount = (price.unit_amount || 0) / 100;

  return (
    <div
      className={`relative flex h-full flex-col overflow-visible rounded-xl bg-black transition-all duration-200`}
    >
      {/* {isPopular && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
          <span className='bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm whitespace-nowrap'>Most Popular</span>
        </div>
      )} */}
      <div className='flex flex-1 flex-col p-6'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h3 className='text-xl font-semibold text-white/90'>
            {isFree ? 'Free' : 'Paid'}
          </h3>
          <div className='mt-4 flex items-baseline justify-center gap-x-2'>
            <span className='text-5xl font-bold text-white/90'>
              ${priceAmount}
            </span>
            {!isFree && (
              <span className='text-lg text-white/60'>/{interval}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className='min-w-3xl mx-auto mb-8 py-6 text-center text-lg text-white/60'>
          {isFree ? (
            <div>Perfect for getting started with Fubuu</div>
          ) : (
            <div>Voice notes in, posts out, every day</div>
          )}
        </div>

        {/* Features List */}
        <div className='flex-1'>
          <ul className='mb-8 space-y-4'>
            {isFree ? (
              <li className='flex items-start gap-3 text-lg text-white/60'>
                <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-[#BF8811]' />
                Basic features
              </li>
            ) : (
              <li className='flex items-start gap-3 text-lg text-white/60'>
                <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-[#BF8811]' />
                All premium features
              </li>
            )}
          </ul>
        </div>

        {/*/!* CTA Button *!/*/}
        {/*<div className='mt-auto'>*/}
        {/*  {createCheckoutAction && (*/}
        {/*    <button*/}
        {/*      onClick={() => createCheckoutAction({ price })}*/}
        {/*      className={`*/}
        {/*        w-full px-4 py-2.5 rounded-lg font-medium transition-colors*/}
        {/*        ${isPopular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white text-gray-900 border border-gray-200 hover:border-blue-500'}*/}
        {/*      `}*/}
        {/*    >*/}
        {/*      {isFree ? 'Get started for free' : 'Upgrade now'}*/}
        {/*    </button>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
