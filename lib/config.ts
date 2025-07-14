// Configuration pour Expo/React Native
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const config = {
  stripePublishableKey,
  supabaseUrl,
  supabaseAnonKey,
};