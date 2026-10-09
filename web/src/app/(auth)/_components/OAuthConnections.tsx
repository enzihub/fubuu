'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';
import CustomButton from '@/components/ui/custom-button';
import { usePlatformStore } from '@/app/stores/usePlatformConnectState';
import { Skeleton } from '@/components/ui/skeleton';

const OAuthConnection = () => {
  const { user, isLoaded } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const { isPlatformConnected, setIsPlatformConnected } = usePlatformStore();
  const [pendingVerification, setPendingVerification] = React.useState<
    string | null
  >(null);

  // Check if the user has connected the platform
  useEffect(() => {
    if (!isLoaded) return;
    const connected =
      user?.externalAccounts?.some(
        (account: any) => account.verification.status === 'verified',
      ) || false;

    if (isPlatformConnected !== connected) {
      setIsPlatformConnected(connected);
    }
  }, [
    isLoaded,
    user?.externalAccounts,
    isPlatformConnected,
    setIsPlatformConnected,
  ]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('oauth_provider_status');

    if (status === 'success' && pendingVerification) {
      setPendingVerification(null);
    }
  }, [pendingVerification]);

  const handleConnect = async (strategy: OAuthStrategy) => {
    setIsConnecting(true);
    try {
      const response: any = await user?.createExternalAccount({
        strategy,
        redirectUrl: window.location.href,
      });

      if (
        response?.verification?.status === 'unverified' &&
        response.verification.externalVerificationRedirectURL
      ) {
        setPendingVerification(strategy);
        window.location.href =
          response.verification.externalVerificationRedirectURL;
        return;
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const externalAccount = user?.externalAccounts.find(
        (account: any) => account.verification.strategy === provider,
      );
      if (externalAccount) {
        await externalAccount.destroy();
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <div className='flex w-full flex-col gap-2'>
          <Skeleton className='h-[48px] w-full rounded-2xl' />
          <Skeleton className='h-[48px] w-full rounded-2xl' />
          <Skeleton className='h-[48px] w-full rounded-2xl' />
        </div>
      </>
    );
  }

  const providers = [
    { name: 'X (Twitter)', id: 'oauth_x' },
    { name: 'LinkedIn', id: 'oauth_linkedin_oidc' },
    { name: 'Threads', id: 'oauth_custom_threads' },
  ];
  return (
    <div className='flex w-full flex-col'>
      {providers.map((provider) => {
        const isConnected = user?.externalAccounts?.some(
          (account: any) =>
            account.verification.strategy === provider.id &&
            account.verification.status === 'verified',
        );

        const isPending = pendingVerification === provider.id;

        return (
          <CustomButton
            key={provider.id}
            buttonText={`${provider.name} ${isConnected ? 'Connected' : isPending ? 'Pending...' : ''}`}
            width='w-full'
            className={`mt-2 bg-gradient-to-t ${
              isConnected
                ? 'from-[#222222] via-[#282B2B] to-[#222222]'
                : 'from-[#333333] via-[#3a3a3a] to-[#333333]'
            } px-2 py-3 text-[16px] ${isConnected ? 'text-white' : 'text-gray-400'}`}
            onClick={() =>
              isConnected
                ? handleDisconnect(provider.id)
                : handleConnect(provider.id as OAuthStrategy)
            }
          />
        );
      })}
    </div>
  );
};

export default OAuthConnection;
