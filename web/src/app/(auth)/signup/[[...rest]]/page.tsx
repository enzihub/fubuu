'use client';
import HeroSection from '@/app/dashboard/_components/hero';
import { Skeleton } from '@/components/ui/skeleton';
import { SignUp } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  return (
    <>
      <div className='flex min-h-screen w-full flex-col'>
        <HeroSection heading='' subHeading='' hideText>
          <div className='flex flex-1 items-center justify-center px-4 py-8'>
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'mx-auto w-full md:max-w-md mt-8',
                  card: 'bg-white/5 backdrop-blur-md shadow-none border-none',
                  headerTitle: 'text-white text-4xl font-bold',
                  headerSubtitle: 'text-gray-300 text-lg',
                  formButtonPrimary:
                    'bg-blue-600 hover:bg-blue-700 transition-colors',
                  formFieldLabel: 'text-gray-300',
                  formFieldInput:
                    'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400',
                  dividerLine: 'bg-gray-700',
                  dividerText: 'text-gray-400',
                  formField: 'rounded-lg',
                  socialButtonsBlockButton:
                    'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors',
                  socialButtonsBlockButtonText: 'text-white',
                  footerActionLink: 'text-blue-400 hover:text-blue-300',
                  footer: 'bg-transparent',
                  form: 'bg-transparent space-y-4',
                },
              }}
              fallback={
                <div className='fixed inset-0 flex items-center justify-center'>
                  <Loader2 className='h-10 w-10 animate-spin text-blue-500' />
                </div>
              }
            />
          </div>
        </HeroSection>
      </div>
    </>
  );
}
