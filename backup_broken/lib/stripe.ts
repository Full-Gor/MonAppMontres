import { config } from './config';

// Initialisation de Stripe avec la clé publique
export const initializeStripe = () => {
  return {
    publishableKey: config.stripe.publishableKey,
    merchantIdentifier: 'merchant.com.arnaud93500.MonAppMontres', // Pour Apple Pay
    urlScheme: 'monappmontres', // Pour les redirections
  };
};

// Vérifier si Stripe est configuré
export const checkStripeConfig = () => {
  if (!config.stripe.publishableKey || config.stripe.publishableKey === 'pk_test_VOTRE_CLE_PUBLIQUE_STRIPE') {
    console.warn('⚠️ Stripe n\'est pas configuré. Créez un fichier .env avec votre clé publique Stripe.');
    return false;
  }
  return true;
}; 