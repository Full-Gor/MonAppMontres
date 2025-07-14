# Guide de Configuration du Système de Paiement

## 1. Créer votre fichier .env

Créez un fichier `.env` à la racine du projet avec ce contenu :

```
# Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXX

# Supabase (optionnel si déjà dans le code)
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon
```

## 2. Obtenir vos clés Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Allez dans [Dashboard > Developers > API keys](https://dashboard.stripe.com/test/apikeys)
3. Copiez votre **Publishable key** (commence par `pk_test_`)
4. Copiez votre **Secret key** (commence par `sk_test_`)

⚠️ **IMPORTANT** : 
- La clé publique (`pk_`) peut être dans votre app mobile
- La clé secrète (`sk_`) ne doit JAMAIS être dans l'app mobile !
- La clé secrète doit être uniquement sur votre serveur backend

## 3. Pour React Native/Expo

### Option 1 : Utiliser react-native-dotenv (Recommandé)

```bash
npm install react-native-dotenv
```

Puis configurez babel.config.js :
```javascript
module.exports = {
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
```

### Option 2 : Utiliser expo-constants

```bash
expo install expo-constants
```

Dans app.json :
```json
{
  "expo": {
    "extra": {
      "stripePublishableKey": "pk_test_VOTRE_CLE"
    }
  }
}
```

## 4. Architecture Sécurisée

Pour un paiement sécurisé, vous avez besoin de :

### Frontend (App Mobile)
- Utilise uniquement la clé publique Stripe
- Collecte les informations de carte
- Envoie une requête au backend

### Backend (Serveur)
- Utilise la clé secrète Stripe
- Crée les PaymentIntents
- Confirme les paiements
- Gère les webhooks

### Exemple de flux :
1. L'utilisateur entre ses infos de carte dans l'app
2. L'app envoie une requête à votre API backend
3. Le backend crée un PaymentIntent avec la clé secrète
4. Le backend renvoie le client_secret à l'app
5. L'app confirme le paiement avec le client_secret
6. Stripe envoie un webhook à votre backend pour confirmer

## 5. Ne JAMAIS faire ça :

❌ Mettre la clé secrète dans l'app mobile
❌ Créer des PaymentIntents côté client
❌ Stocker les informations de carte
❌ Faire confiance aux données du client sans vérification serveur

## 6. Prochaines étapes

1. Créez un backend sécurisé (Node.js, Python, etc.)
2. Implémentez les endpoints de paiement
3. Configurez les webhooks Stripe
4. Intégrez Stripe dans votre app React Native 