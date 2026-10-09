'use client';
import React from 'react';
import { AuthButton } from '@/app/(auth)/_components/AuthButton';
import GlowingCircles from '@/components/ui/glowing-circles';
export const SignCard = ({
  isSignup,
  heading,
  subHeading,
}: {
  isSignup?: boolean;
  heading: string;
  subHeading: string;
}) => {
  return (
    <div className='relative min-h-screen w-full bg-[url(/images/bg-img.webp)] bg-cover bg-center bg-no-repeat px-8 shadow-inner md:px-0'>
      <GlowingCircles />
      <div className='relative z-10 mx-auto mt-12 flex max-w-xl items-center justify-center px-3 pt-8 text-center md:px-8'>
        <div className='space-y-8'>
          <h1 className='glow-text font-gambarino text-5xl text-white md:text-6xl'>
            {heading}
          </h1>
          <p className='font-inter text-xl font-medium tracking-[-0.03em] text-white/70 md:text-2xl'>
            {subHeading}
          </p>
        </div>
      </div>
      <div className='relative z-10 mt-6 flex items-center justify-center'>
        <div className='mt-8 w-full max-w-lg justify-items-center px-4'>
          <AuthButton isSignup={isSignup} />
        </div>
      </div>
    </div>
  );
};
