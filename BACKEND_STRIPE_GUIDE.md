# Guide Backend Stripe avec Supabase

## Option 1 : Supabase Edge Functions (Recommandé)

### 1. Installer Supabase CLI
```bash
npm install -g supabase
```

### 2. Initialiser Supabase
```bash
supabase init
supabase functions new create-payment-intent
```

### 3. Code de la fonction Edge
Créez `supabase/functions/create-payment-intent/index.ts` :

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'eur', metadata } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    })

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### 4. Déployer la fonction
```bash
supabase functions deploy create-payment-intent
supabase secrets set STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
```

## Option 2 : Backend Node.js Express

### 1. Créer un serveur Express
```bash
mkdir backend-montres
cd backend-montres
npm init -y
npm install express stripe cors dotenv
```

### 2. Code du serveur
Créez `server.js` :

```javascript
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Mettre à jour la commande dans Supabase
      console.log('Paiement réussi:', event.data.object);
      break;
    case 'payment_intent.payment_failed':
      // Gérer l'échec
      console.log('Paiement échoué:', event.data.object);
      break;
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
```

### 3. Fichier .env
```
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK
PORT=3000
```

## Intégration dans l'app React Native

### 1. Créer un service API
Créez `lib/api.ts` :

```typescript
import { config } from './config';

const API_URL = 'https://votre-backend.com'; // ou localhost:3000 en dev

export const createPaymentIntent = async (amount: number, metadata?: any) => {
  const response = await fetch(`${API_URL}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'eur',
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du paiement');
  }

  return response.json();
};
```

### 2. Mettre à jour le composant PaymentForm
```typescript
const handlePayment = async () => {
  if (!cardDetails?.complete) {
    Alert.alert('Erreur', 'Veuillez entrer des informations de carte valides');
    return;
  }

  setLoading(true);

  try {
    // Créer le PaymentIntent côté serveur
    const { clientSecret } = await createPaymentIntent(amount);

    // Confirmer le paiement
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      Alert.alert('Erreur', error.message);
    } else if (paymentIntent) {
      onSuccess(paymentIntent.id);
    }
  } catch (error) {
    Alert.alert('Erreur', 'Le paiement a échoué');
  } finally {
    setLoading(false);
  }
};
```

## Sécurité

⚠️ **IMPORTANT** :
- Ne jamais exposer la clé secrète Stripe dans l'app mobile
- Toujours créer les PaymentIntents côté serveur
- Utiliser les webhooks pour confirmer les paiements
- Valider tous les montants côté serveur
- Implémenter l'authentification pour les endpoints sensibles 