import { config } from './config';

export function initializeStripe() {
  return {
    publishableKey: config.stripePublishableKey || '',
    merchantIdentifier: 'merchant.com.monapp',
    urlScheme: 'monapp'
  };
}

export function checkStripeConfig() {
  const stripeKey = config.stripePublishableKey;
  if (!stripeKey || stripeKey.includes('VOTRE_CLE')) {
    return false;
  }
  return true;
}
