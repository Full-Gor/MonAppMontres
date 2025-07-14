// Configuration de l'application
import { STRIPE_PUBLISHABLE_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';

export const config = {
  // Stripe
  stripe: {
    publishableKey: STRIPE_PUBLISHABLE_KEY || 'pk_test_VOTRE_CLE_PUBLIQUE_STRIPE',
  },
  
  // Supabase
  supabase: {
    url: SUPABASE_URL || 'https://qnqhlvznqaffiglhfmhm.supabase.co',
    anonKey: SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucWhsdnpucWFmZmlnbGhmbWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzI0MjgsImV4cCI6MjA2NzU0ODQyOH0.p6HY4DFfurV0DM3qoi2aysxwF6U8PP3sPHQHtCLswmY',
  },
};

// Vérifier que les clés Stripe sont configurées
export const isStripeConfigured = () => {
  return config.stripe.publishableKey && 
         config.stripe.publishableKey !== 'pk_test_VOTRE_CLE_PUBLIQUE_STRIPE';
}; 