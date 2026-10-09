// newsletter-card.tsx

'use client';

import { Clock } from 'lucide-react';
import { getUserTimezone } from '@/shared/services/timezone';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  getUserTweetPref,
  upsertTweetPref,
} from '@/app/(newsletter)/_services/newsletter.service';
import { sendWelcomeMessage } from '../_services/integration-service';

export function TweetCard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [timezone] = useState(getUserTimezone());
  const [nextEmailTime, setNextEmailTime] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  // const [isSubscribed, setIsSubscribed] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [preferredHour, setPreferredHour] = useState(7);
  const [phone, setPhone] = useState('');
  const [prefs, setPrefs] = useState<any>({});

  const AUTHORIZED_EMAILS =
    process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS?.split(',') || [];

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  async function fetchPrefs() {
    try {
      setToggleLoading(true);

      // const [prefUTCTime, userTweetPref] = await Promise.all([
      //   getPrefHourOfUser(user?.id!),
      //   // getUserNewsletterPref(user?.id!),
      //   getUserTweetPref(user?.id!),
      // ]);

      const userTweetPref = await getUserTweetPref(
        user?.primaryEmailAddress?.emailAddress!,
      );

      // const hourValue = getLocalHourFromUTCMinutes(hour!, timezone);
      // const hourValue = getLocalHourFromUTCTime(prefUTCTime!, timezone);

      // setPreferredHour(hourValue!);
      // setIsSubscribed(newsPref.isSubscribed ?? false);
      setPhone(userTweetPref?.phone ?? '');
      setPrefs(userTweetPref);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setToggleLoading(false);
    }
  }

  useEffect(() => {
    fetchPrefs();
  }, []);

  const handleUpdatePreferences = async () => {
    setUpdating(true);
    try {
      const prefResult = await upsertTweetPref(
        user?.id!,
        user?.primaryEmailAddress?.emailAddress!,
        phone,
        prefs?.customPrompt ?? '',
        prefs?.description,
        timezone,
      );

      if (prefResult) {
        // Call the backend to send the welcome message using twilio
        await sendWelcomeMessage(phone);

        alert(
          `Perfect! 🎉 Your preferences have been updated! Check your WhatsApp for updates!`,
        );
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
      value: hour,
      label: `${hour12}:00 ${ampm}`,
    };
  });

  return (
    <div className='rounded-xl p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Clock className='h-5 w-5 text-[#BF8811]' />
          <h2 className='text-lg font-medium text-white/90'>Tweets 🐥</h2>
        </div>
        {/*<button*/}
        {/*  onClick={handleToggleSubscription}*/}
        {/*  disabled={toggleLoading}*/}
        {/*  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition duration-200 ${isSubscribed ? 'bg-white/15 text-[#17999B]' : 'bg-[#BF8811] font-bold text-gray-900'}`}*/}
        {/*>*/}
        {/*  {toggleLoading ? '...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}*/}
        {/*</button>*/}
      </div>

      <div className='space-y-4'>
        <div>
          <div className='flex flex-wrap items-center gap-3 text-white/60'>
            <span className='text-base'>My phone number</span>
            {toggleLoading ? (
              <Skeleton className='h-9 w-24' />
            ) : (
              <input
                type='tel'
                value={phone}
                onChange={handlePhoneChange}
                placeholder='+1 (555) 555-5555'
                className='rounded-lg border-none bg-gray-950 px-3 py-1.5 text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-[#BF8811] focus:ring-opacity-10'
              />
            )}
          </div>
          {/*<p className="mb-2 mt-2 text-sm text-white/60">({timezone})</p>*/}
        </div>
        {/*{nextEmailTime && (*/}
        {/*  <div className="rounded-lg p-3 text-sm font-semibold text-[#BF8811]">*/}
        {/*    Perfect! 🎉 Your next curated recommendations will arrive on{' '}*/}
        {/*    {nextEmailTime}*/}
        {/*  </div>*/}
        {/*)}*/}

        <button
          onClick={handleUpdatePreferences}
          disabled={updating}
          className='w-full rounded-lg bg-white/15 px-4 py-3 text-sm font-medium text-white/90 transition duration-200 hover:bg-white/10'
        >
          {updating ? 'Saving...' : 'Save My Preference'}
        </button>

        {/*{AUTHORIZED_EMAILS.includes(*/}
        {/*  user?.primaryEmailAddress?.emailAddress!,*/}
        {/*) && (*/}
        {/*  <button*/}
        {/*    onClick={handleSend}*/}
        {/*    className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#BF8811] transition duration-200 hover:bg-blue-50'*/}
        {/*  >*/}
        {/*    Send me InboxClarity Now! ✨*/}
        {/*  </button>*/}
        {/*)}*/}
      </div>

      {/*{isSubscribed && (*/}
      {/*  <div className='space-y-4'>*/}
      {/*    <div>*/}
      {/*      <div className='flex flex-wrap items-center gap-3 text-white/60'>*/}
      {/*        <span className='text-base'>My phone number</span>*/}
      {/*        {toggleLoading ? (*/}
      {/*          <Skeleton className='h-9 w-24' />*/}
      {/*        ) : (*/}
      {/*          <input*/}
      {/*            type="tel"*/}
      {/*            value={phone}*/}
      {/*            onChange={handlePhoneChange}*/}
      {/*            placeholder="+1 (555) 555-5555"*/}
      {/*            className="rounded-lg border-none bg-gray-950 px-3 py-1.5 text-sm font-medium text-white/90 focus:outline-none focus:ring-2 focus:ring-[#BF8811] focus:ring-opacity-10"*/}
      {/*          />*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*      /!*<p className="mb-2 mt-2 text-sm text-white/60">({timezone})</p>*!/*/}
      {/*    </div>*/}
      {/*    /!*{nextEmailTime && (*!/*/}
      {/*    /!*  <div className="rounded-lg p-3 text-sm font-semibold text-[#BF8811]">*!/*/}
      {/*    /!*    Perfect! 🎉 Your next curated recommendations will arrive on{' '}*!/*/}
      {/*    /!*    {nextEmailTime}*!/*/}
      {/*    /!*  </div>*!/*/}
      {/*    /!*)}*!/*/}

      {/*    <button*/}
      {/*      onClick={handleUpdatePreferences}*/}
      {/*      disabled={updating}*/}
      {/*      className='w-full rounded-lg bg-white/15 px-4 py-3 text-sm font-medium text-white/90 transition duration-200 hover:bg-white/10'*/}
      {/*    >*/}
      {/*      {updating ? 'Saving...' : 'Save My Preference'}*/}
      {/*    </button>*/}

      {/*    /!*{AUTHORIZED_EMAILS.includes(*!/*/}
      {/*    /!*  user?.primaryEmailAddress?.emailAddress!,*!/*/}
      {/*    /!*) && (*!/*/}
      {/*    /!*  <button*!/*/}
      {/*    /!*    onClick={handleSend}*!/*/}
      {/*    /!*    className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#BF8811] transition duration-200 hover:bg-blue-50'*!/*/}
      {/*    /!*  >*!/*/}
      {/*    /!*    Send me InboxClarity Now! ✨*!/*/}
      {/*    /!*  </button>*!/*/}
      {/*    /!*)}*!/*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*{!isSubscribed && (*/}
      {/*  <p className='text-sm text-white/60'>*/}
      {/*    Subscribe to receive curated recommendations in your inbox at your*/}
      {/*    preferred time.*/}
      {/*  </p>*/}
      {/*)}*/}
    </div>
  );
}
