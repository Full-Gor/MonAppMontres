# Guide de Test Stripe

## 🚀 Configuration Rapide

### 1. Créer votre fichier .env
Créez un fichier `.env` à la racine du projet :
```
STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_ICI
SUPABASE_URL=https://qnqhlvznqaffiglhfmhm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucWhsdnpucWFmZmlnbGhmbWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzI0MjgsImV4cCI6MjA2NzU0ODQyOH0.p6HY4DFfurV0DM3qoi2aysxwF6U8PP3sPHQHtCLswmY
```

### 2. Obtenir votre clé Stripe
1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte gratuit
3. Allez dans **Developers > API keys**
4. Copiez la **Publishable key** (commence par `pk_test_`)
5. Collez-la dans votre `.env`

### 3. Redémarrer l'app
```bash
# Arrêtez l'app (Ctrl+C)
# Redémarrez avec cache vidé
npx expo start --clear
```

## 🧪 Tester le Paiement

### Cartes de Test Stripe
| Type | Numéro | CVC | Date |
|------|---------|-----|------|
| ✅ Succès | 4242 4242 4242 4242 | N'importe | Future |
| ❌ Refusée | 4000 0000 0000 0002 | N'importe | Future |
| 🔐 3D Secure | 4000 0025 0000 3155 | N'importe | Future |

### Flux de Test
1. **Ajoutez des produits** au panier
2. **Cliquez sur "Passer commande"**
3. **Entrez la carte de test** : 4242 4242 4242 4242
4. **Date d'expiration** : N'importe quelle date future (ex: 12/34)
5. **CVC** : N'importe quel nombre à 3 chiffres (ex: 123)
6. **Cliquez sur "Payer"**

## ⚠️ État Actuel

### ✅ Ce qui fonctionne
- Interface de paiement Stripe
- Formulaire de carte sécurisé
- Validation des données de carte
- Modal de paiement responsive

### ❌ Ce qui manque (Backend requis)
- Création réelle du PaymentIntent
- Traitement du paiement
- Webhooks de confirmation
- Mise à jour du statut de commande

### 🔧 Pour un Paiement Réel
Vous devez :
1. **Créer un backend** (voir `BACKEND_STRIPE_GUIDE.md`)
2. **Déployer votre backend**
3. **Configurer l'URL de l'API** dans `lib/api.ts`
4. **Tester avec de vraies transactions**

## 🎯 Prochaines Étapes

1. **Backend Simple** : Utilisez Supabase Edge Functions
2. **Backend Complet** : Créez un serveur Node.js/Express
3. **Production** : 
   - Remplacez `pk_test_` par `pk_live_`
   - Activez les webhooks
   - Ajoutez la gestion d'erreurs

## 📱 Debug

Si Stripe n'apparaît pas :
1. Vérifiez que `.env` existe
2. Vérifiez la clé dans `.env`
3. Redémarrez avec `npx expo start --clear`
4. Vérifiez la console pour les erreurs

Si le paiement échoue :
- C'est normal ! Le backend n'est pas encore implémenté
- Le message "Paiement simulé" devrait apparaître 