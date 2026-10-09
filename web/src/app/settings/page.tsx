import { SettingsContent } from '@/app/settings/_components/settings-content';
import { getSubscription } from '@/app/(billing)/_services/subscription.service';
import { getPriceFromStripeById } from '@/app/(billing)/_services/price';

export default async function SettingsPage() {
  const [subscription] = await Promise.all([getSubscription()]);

  let price = null;

  if (subscription) {
    price = await getPriceFromStripeById(subscription.priceId!);
  }
  return <SettingsContent subscription={subscription} price={price!} />;
}
