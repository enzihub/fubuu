'use client';
import CustomButton from '@/components/ui/custom-button';
import AccountCard from './account-card';
import SubmitField from './submit-field';
import { useEffect, useState } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import {
  getUserTweetPref,
  upsertTweetPref,
} from '@/app/(newsletter)/_services/newsletter.service';
import { sendWelcomeMessage } from '@/app/(newsletter)/_services/integration-service';
import { getUserTimezone } from '@/shared/services/timezone';
import OAuthConnections from '@/app/(auth)/_components/OAuthConnections';
import { redirectToStripeCustomerPortal } from '@/app/(billing)/_services/manage-subscription';
import { usePlatformStore } from '@/app/stores/usePlatformConnectState';
import { usePhoneStore } from '@/app/stores/usePhoneState';
import useOnboardStore from '@/app/stores/onBoardState';
import { useAboutStore } from '@/app/stores/useAboutState';
import { getUserIdByClerkId } from '@/app/(user)/_services/user.service';
import { MainCardSketlon } from '@/components/ui/skeleton';
import { alertError, alertSuccess } from '@/shared/utils/alert';

export default function MainContent({ subscription }: any) {
  const placeholderPromptText = `I am a {description}, keeping that in mind if relevant, turn the user input into a tweet. Decide the length needed to capture the core message, but keep it under 280 characters and include a captivating hook. If needed, add line breaks while maintaining the same style/trend/theme as the original message—stay professional. 
Below are <best practices> (use what's needed, no need to include them all):
<best practices>
•Be concise: Aim for clarity and brevity—stick to 1–2 sentences when possible. Twitter is fast-paced; make every word count.
•Lead with the hook: Start with the most important or intriguing words to grab attention.
•Use active voice and strong verbs: Avoid passive language to keep tweets dynamic and engaging.
•If it makes sense, ask questions or prompt action: Encourage replies, retweets, or clicks with phrases like "What do you think?" or "Tap below."
•Keep it conversational: Write in a natural, relatable tone—avoid jargon or overly formal language.
•Highlight urgency or timeliness: Use phrases like "Now live," "Breaking," or "Last chance" to capitalize on FOMO.
•Optimize for readability: Use line breaks, bullet points (•), or em dashes (—) to structure text for quick scanning.
•Include a clear CTA if needed: Direct followers to "Retweet," "Click the link," or "Follow" for desired outcomes.
•Test humor and wit: Clever wordplay or lightheartedness can help tweets stand out (while aligning with your brand voice).
•Prioritize value: Ensure every tweet offers something useful—information, entertainment, inspiration, or a solution.
</best practices>
    `;
  const placeholderPhone = '+1 555 010 0123';
  const placeholderAbout = 'I am a 26 year old teacher....';
  const [placeholderPrompt, setPlaceholderPrompt] = useState(
    placeholderPromptText,
  );
  const { user, isLoaded } = useUser();
  const { phone, setPhone } = usePhoneStore();
  const [timezone] = useState(getUserTimezone());
  const [toggleLoading, setToggleLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingAbout, setUpdatingAbout] = useState(false);
  const [updatingPrompt, setUpdatingPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const { description, setDescription } = useAboutStore();
  const [prompt, setPrompt] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [loadingContinue, setLoadingContinue] = useState(false);
  const { isPlatformConnected } = usePlatformStore();
  const [phoneInput, setPhoneInput] = useState('');
  const { isCompleted, setIsCompleted } = useOnboardStore();
  const [done, setDone] = useState(false);
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [descErrorMessage, setDescErrorMessage] = useState('');
  const [promptErrorMessage, setPromptErrorMessage] = useState('');
  const PHONE_REGEX = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  const validatePhone = (phone: string) => {
    if (!phone) {
      return 'Phone number is required';
    }
    if (!PHONE_REGEX.test(phone)) {
      return 'Please provide a valid phone number';
    }
    return '';
  };

  const validateDescription = (text: string) => {
    if (!text) {
      return 'This field is required';
    }
    return '';
  };
  const validatePrompt = (text: string) => {
    if (!text) {
      return 'This field is required';
    }
    return '';
  };

  useEffect(() => {
    const fetchUserId = async () => {
      if (user?.id) {
        const fetchedUserId = await getUserIdByClerkId(user.id);
        if (fetchedUserId) {
          setUserId(fetchedUserId);
          console.log('Fetched userId:', fetchedUserId);
        }
      }
    };

    if (user) {
      fetchUserId();
    }
  }, [user?.id]);

  const displaySuccess = (message: string) => {
    alertSuccess(message);
  };
  const displayError = (message: string) => {
    alertError(message);
  };

  const handleUpdateDescription = async () => {
    const validationError = validateDescription(descriptionInput);
    if (validationError) {
      setDescErrorMessage(validationError);
      return;
    }
    setUpdatingAbout(true);
    setDescErrorMessage('');
    let descriptionUpdated = false;
    try {
      const prefResult = await upsertTweetPref(
        userId,
        user?.primaryEmailAddress?.emailAddress!,
        phone?.trim() ?? '',
        prompt,
        descriptionInput,
        timezone,
      );

      if (prefResult) {
        descriptionUpdated = true;
        displaySuccess('Description updated successfully! 🎉');
      } else {
        displayError('Description update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      displayError('Description update failed. Please try again.');
    } finally {
      if (descriptionUpdated) {
        setDescription(descriptionInput);
      }
      setUpdatingAbout(false);
    }
  };

  const handleUpdatePrompt = async () => {
    const validationError = validatePrompt(promptInput);
    if (validationError) {
      setPromptErrorMessage(validationError);
      return;
    }
    setUpdatingPrompt(true);
    setPromptErrorMessage('');
    let descriptionUpdated = false;
    try {
      const prefResult = await upsertTweetPref(
        userId,
        user?.primaryEmailAddress?.emailAddress!,
        phone?.trim() ?? '',
        promptInput,
        description,
        timezone,
      );

      if (prefResult) {
        descriptionUpdated = true;
        displaySuccess('Your Prompt updated successfully! 🎉');
      } else {
        displayError('Prompt update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error updating Prompt:', error);
      displayError('Prompt update failed. Please try again.');
    } finally {
      if (descriptionUpdated) {
        setPrompt(promptInput);
      }
      setUpdatingPrompt(false);
    }
  };

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.value.length != 0) {
      // Replace {description} with the actual input value
      const updatedPrompt = placeholderPromptText.replace(
        'I am a {description}',
        e.target.value,
      );
      setPlaceholderPrompt(updatedPrompt);
    } else {
      // If input is empty, just use the original template with {description} placeholder
      setPlaceholderPrompt(placeholderPromptText);
    }

    setDescriptionInput(e.target.value);
  };

  const handleChangePrompt = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPromptInput(e.target.value);
  };

  const handleFocusPrompt = () => {
    if (promptInput.length === 0) {
      setPromptInput(placeholderPrompt);
    }
  };

  const handleUpdatePhone = async () => {
    const validationError = validatePhone(phoneInput);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage('');
    setUpdating(true);
    let prefUpdated = false;

    const userId = await getUserIdByClerkId(user?.id!);

    if (!userId) {
      console.error('User not found');
      return;
    }

    try {
      const prefResult = await upsertTweetPref(
        userId!,
        user?.primaryEmailAddress?.emailAddress!,
        phoneInput,
        prompt,
        description,
        timezone,
      );

      if (prefResult) {
        prefUpdated = true;
        displaySuccess('Preferences updated successfully! 🎉');
      } else {
        displayError('Preferences update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      displayError('Preferences update failed. Please try again.');
    } finally {
      if (prefUpdated) {
        setPhone(phoneInput);
      }
    }

    try {
      if (prefUpdated) {
        await sendWelcomeMessage(phoneInput);
        displaySuccess('Welcome message sent! Check your WhatsApp.');
      }
    } catch (error) {
      console.error('Error sending welcome message:', error);
      displayError('Failed to send welcome message');
    } finally {
      setUpdating(false);
    }
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPhoneInput(e.target.value);
  };

  const fetchPref = async () => {
    if (!user?.id!) {
      console.error('User not found');
      return;
    }
    try {
      setToggleLoading(true);
      const userTweetPref = await getUserTweetPref(
        user?.primaryEmailAddress?.emailAddress!,
      );
      setPhone(userTweetPref?.phone ?? '');
      setPhoneInput(userTweetPref?.phone ?? '');
      setDescription(userTweetPref?.description ?? '');
      setDescriptionInput(userTweetPref?.description ?? '');
      setPromptInput(userTweetPref?.customPrompt ?? '');
      setPrompt(userTweetPref?.customPrompt ?? '');
    } catch (error) {
      console.error('Error fetching phone:', error);
    } finally {
      setToggleLoading(false);
    }
  };

  useEffect(() => {
    if (!phone || !description) {
      fetchPref();
    }
  }, [user?.id, setPhone, phone, description, setDescription]);

  const handleRedirectToPortal = async () => {
    setLoading(true);
    try {
      return await redirectToStripeCustomerPortal();
    } catch (error) {
      console.error('Error getting portal URL:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueClick = () => {
    setLoadingContinue(true);
    setTimeout(() => {
      setDone(true);
    }, 1000);
    setTimeout(() => {
      if (isPlatformConnected && phone) {
        setIsCompleted(true);
      }
      setLoadingContinue(false);
    }, 2000);
  };

  if (!isLoaded || !user || toggleLoading) {
    return (
      <div className='isolate mx-8 flex aspect-video w-full flex-col gap-5 rounded-2xl border-2 border-[#1C1C1C] bg-white/5 py-[32px] shadow-lg ring-1 ring-black/5 backdrop-blur-md md:mx-auto md:max-w-lg'>
        <MainCardSketlon />
      </div>
    );
  }

  return (
    <div className='isolate mx-8 flex aspect-video flex-col gap-5 rounded-2xl border-2 border-[#1C1C1C] bg-white/5 py-[32px] shadow-lg ring-1 ring-black/5 backdrop-blur-md md:mx-auto md:max-w-lg'>
      {/*<UserProfile />*/}
      <AccountCard
        title={
          isPlatformConnected && isCompleted
            ? 'Linked Platforms'
            : 'Step 1. Link Your Publishing Platforms'
        }
        subTitile={
          isPlatformConnected && isCompleted
            ? 'Connect your socials and let Fubuu turn your voice into high-performing posts'
            : 'These are the channels where your voice will be transformed into viral content and posted automatically'
        }
        isRight={isPlatformConnected}
        // hideText
      >
        <div className='flex max-w-xs justify-start'>
          <OAuthConnections />
        </div>
      </AccountCard>
      {/* whatsapp number section section */}
      <AccountCard
        title={
          phone != null &&
          phone !== placeholderPhone &&
          phone.trim() !== '' &&
          isCompleted
            ? 'WhatsApp Number'
            : 'Step 2. Enter your WhatsApp number'
        }
        subTitile='This is so that we can connect your number with your account'
        isRight={
          phone != null && phone !== placeholderPhone && phone.trim() !== ''
        }
      >
        <SubmitField
          buttonText={updating ? 'Updating...' : 'Submit'}
          disableButton={updating}
          placeholder={placeholderPhone}
          onChangeInput={handlePhoneChange}
          onclickButton={handleUpdatePhone}
          loading={toggleLoading}
          value={phoneInput}
          errorMessage={errorMessage}
        />
      </AccountCard>

      {/* About section  */}
      <AccountCard
        title={
          description != null &&
          description !== placeholderAbout &&
          description.trim() !== '' &&
          isCompleted
            ? 'Your Info'
            : 'Step 3. Tell Us About You'
        }
        subTitile="Tell us about you, and we'll craft a tweet style that’s 100% yours"
        isRight={
          description != null &&
          description !== placeholderAbout &&
          description.trim() !== ''
        }
      >
        <SubmitField
          buttonText={updatingAbout ? 'Updating...' : 'Submit'}
          disableButton={updatingAbout}
          placeholder={placeholderAbout}
          onChangeInput={handleChangeDescription}
          onclickButton={handleUpdateDescription}
          loading={toggleLoading}
          value={descriptionInput}
          errorMessage={descErrorMessage}
        />
      </AccountCard>
      {/* custom prompt */}
      <AccountCard
        title={
          prompt != null && prompt.trim() !== '' && isCompleted
            ? 'Customize Your Prompt (Optional)'
            : 'Step 4. Customize Your Prompt (Optional)'
        }
        subTitile='Fine-tune the prompt below to perfectly match your desired style and tone'
        isRight={
          prompt != null && prompt !== placeholderAbout && prompt.trim() !== ''
        }
      >
        <SubmitField
          buttonText={updatingPrompt ? 'Updating...' : 'Submit'}
          disableButton={updatingPrompt}
          placeholder={placeholderPrompt}
          onFocus={handleFocusPrompt}
          onChangeInput={handleChangePrompt}
          onclickButton={handleUpdatePrompt}
          loading={toggleLoading}
          value={promptInput}
          errorMessage={promptErrorMessage}
        />
      </AccountCard>

      {phone != '' && isCompleted ? (
        <AccountCard
          title='Subscription'
          subTitile='Update plan, view invoices and manage payments'
          isRight={subscription != null}
        >
          <button
            onClick={
              subscription
                ? async () => {
                    await handleRedirectToPortal();
                  }
                : () => {
                    window.location.href =
                      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK1!;
                  }
            }
            disabled={loading}
            type='button'
            className='w-full rounded-2xl bg-[#0059FF] px-3 py-2.5 font-satoshi text-lg font-medium tracking-[-0.02em] text-[#FCFCFA] hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl'
          >
            {loading
              ? 'Redirecting...'
              : subscription
                ? 'Manage Subscription'
                : 'Start Subscription'}
          </button>
        </AccountCard>
      ) : (
        <AccountCard
          title='Step 5. Let Your Voice Speak'
          subTitile={`Voice your thoughts via WhatsApp to ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'your Fubuu WhatsApp number'} and Fubuu will turn it into a viral tweet!`}
          isRight={done}
        ></AccountCard>
      )}
      {!isCompleted && (
        <div className='px-6'>
          <CustomButton
            buttonText={loadingContinue ? 'Loading...' : 'Continue'}
            onClick={handleContinueClick}
            width='w-full'
            disabled={loadingContinue}
            className='bg-gradient-to-t from-[#222222] via-[#282B2B] to-[#222222] px-4 py-2.5 font-satoshi text-[20px] font-medium text-white hover:bg-[#222222] disabled:bg-white/15'
            icon={
              <svg
                className='h-4 w-4 text-white/60'
                viewBox='0 0 24 24'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z'
                />
              </svg>
            }
          />
        </div>
      )}
    </div>
  );
}
