import MainContent from './_components/main-card';
import HeroSection from './_components/hero';
import { getSubscription } from '@/app/(billing)/_services/subscription.service';
import { ToastContainer } from 'react-toastify';

export default async function AccountPage() {
  const [subscription] = await Promise.all([getSubscription()]);

  return (
    <div className='w-full'>
      <ToastContainer/>
      <HeroSection
        heading="You're set!"
        subHeading={`Send a WhatsApp voice note now to ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'your Fubuu WhatsApp number'} and watch Fubuu turn it into valuable, viral content—effortlessly!`}
      >
        <MainContent subscription={subscription} />
      </HeroSection>
    </div>
  );
}
