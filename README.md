# 🕐 MonAppMontres - Application de Montres de Luxe

Une application mobile React Native complète pour la vente de montres de luxe avec authentification, paiements sécurisés, et dashboard administrateur.

## 📱 Fonctionnalités Principales

### 👤 Authentification & Gestion des Utilisateurs
- ✅ **Inscription/Connexion** avec Supabase Auth
- ✅ **Séparation des rôles** Admin/Utilisateur
- ✅ **Gestion des profils** avec photo, téléphone, adresse
- ✅ **Système de sessions** persistantes avec cookies
- ✅ **Protection des routes** selon les rôles

### 🛍️ Catalogue & Shopping
- ✅ **6 Catégories** : Classique, Sport, Luxe, Vintage, Femme, Édition Limitée
- ✅ **Cartes produits animées** avec flip 3D et vidéos
- ✅ **Système de favoris** synchronisé avec base de données
- ✅ **Panier persistant** avec gestion des quantités
- ✅ **Recherche et filtres** par catégorie

### 💳 Paiements Sécurisés
- ✅ **Intégration Stripe** complète
- ✅ **Paiements sécurisés** avec 3D Secure
- ✅ **Suivi des transactions** et historique
- ✅ **Gestion des erreurs** et confirmations

### 📊 Dashboard Administrateur
- ✅ **Statistiques en temps réel** (ventes, utilisateurs, produits)
- ✅ **Graphiques animés** avec Victory Native
- ✅ **CRUD complet** pour produits et utilisateurs
- ✅ **Gestion des commandes** et statuts
- ✅ **Système de messagerie** bidirectionnel

### 💬 Communication
- ✅ **Messages utilisateur-admin** en temps réel
- ✅ **Interface de chat** intuitive
- ✅ **Notifications** de nouveaux messages
- ✅ **Historique des conversations**

### 📦 Suivi des Commandes
- ✅ **Historique des commandes** par utilisateur
- ✅ **Statuts de livraison** (en cours, expédié, livré)
- ✅ **Numéros de suivi** avec liens transporteurs
- ✅ **Notifications email** (à configurer)

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : React Native (Expo 53)
- **Navigation** : Expo Router
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Paiements** : Stripe
- **État global** : React Context API
- **Stockage local** : AsyncStorage
- **Graphiques** : Victory Native

### Structure du Projet
```
MonAppMontres/
├── app/                    # Pages et navigation
│   ├── (tabs)/            # Onglets principaux
│   │   ├── index.tsx      # Accueil
│   │   ├── products.tsx   # Catalogue
│   │   ├── favorites.tsx  # Favoris
│   │   ├── cart.tsx       # Panier
│   │   ├── profile.tsx    # Profil utilisateur
│   │   ├── auth.tsx       # Authentification
│   │   └── admin.tsx      # Dashboard admin
│   ├── category/          # Pages par catégorie
│   └── _layout.tsx        # Layout principal
├── components/            # Composants réutilisables
│   ├── FlipCard.tsx      # Carte produit animée
│   ├── PaymentForm.tsx   # Formulaire de paiement
│   └── ui/               # Composants UI
├── contexts/             # Contextes React
│   └── AppContext.tsx    # État global
├── lib/                  # Utilitaires
│   ├── supabase.js      # Configuration Supabase
│   ├── stripe.ts        # Configuration Stripe
│   └── config.ts        # Variables d'environnement
├── scripts/             # Scripts SQL
│   └── complete_database_setup.sql
└── supabase/           # Fonctions Edge
    └── functions/
```

## 🚀 Installation et Configuration

### 1. Prérequis
```bash
# Node.js 18+
node --version

# Expo CLI
npm install -g @expo/cli

# Supabase CLI (optionnel)
npm install -g supabase
```

### 2. Installation des dépendances
```bash
# Cloner le projet
git clone <votre-repo>
cd MonAppMontres

# Installer les dépendances
npm install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` à la racine :
```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI

# Supabase Configuration
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon

# App Configuration
APP_NAME=MonAppMontres
APP_VERSION=1.0.0
```

### 4. Configuration Supabase
1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script `scripts/complete_database_setup.sql` dans l'éditeur SQL
3. Configurez l'authentification (Email/Password)
4. Activez RLS (Row Level Security)

### 5. Configuration Stripe
1. Créez un compte sur [Stripe](https://stripe.com)
2. Récupérez vos clés API (Dashboard > Developers > API keys)
3. Configurez les webhooks pour les paiements
4. Déployez les fonctions Edge Supabase pour les PaymentIntents

### 6. Lancement de l'application
```bash
# Démarrer le serveur de développement
npm start

# Ou spécifiquement pour une plateforme
npm run android
npm run ios
npm run web
```

## 📋 Configuration de la Base de Données

### Tables Principales
- **users** : Utilisateurs avec rôles admin/user
- **products** : Catalogue de montres avec catégories
- **orders** : Commandes avec statuts et paiements
- **favorites** : Favoris utilisateurs
- **messages** : Communication admin-user
- **cart_items** : Panier persistant (optionnel)

### Sécurité (RLS)
- Politiques de sécurité au niveau des lignes
- Accès restreint selon les rôles
- Chiffrement des données sensibles

## 🔧 Fonctionnalités Avancées

### Système de Favoris
- Synchronisation entre local et cloud
- Indicateurs visuels sur les cartes
- Gestion offline avec sync ultérieure

### Paiements Stripe
- Formulaires sécurisés avec 3D Secure
- Gestion des erreurs et retry automatique
- Historique des transactions

### Dashboard Admin
- Statistiques en temps réel
- Graphiques interactifs et animés
- Export des données (à implémenter)

### Messagerie
- Interface de chat moderne
- Notifications push (à configurer)
- Historique des conversations

## 🎨 Design et UX

### Thème Visuel
- **Couleur principale** : Or (#d4af37)
- **Design moderne** avec animations fluides
- **Interface responsive** multi-plateforme
- **Composants réutilisables** avec théming

### Animations
- Cartes flip 3D pour les produits
- Transitions fluides entre les pages
- Micro-interactions pour les boutons
- Graphiques animés dans le dashboard

## 🧪 Tests et Débogage

### Comptes de Test
- **Admin** : admin123@gmail.com
- **Utilisateur** : Créez via l'inscription

### Cartes de Test Stripe
- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- **3D Secure** : 4000 0025 0000 3155

### Débogage
```bash
# Logs détaillés
npx expo start --clear

# Débogage React Native
npx react-native log-android
npx react-native log-ios
```

## 📱 Déploiement

### Build Production
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Web
npm run web
```

### Variables d'Environnement Production
- Remplacez les clés de test par les clés de production
- Configurez les webhooks Stripe
- Activez les notifications push

## 🔐 Sécurité

### Bonnes Pratiques Implémentées
- ✅ Authentification sécurisée avec Supabase
- ✅ Chiffrement des données sensibles
- ✅ Validation côté serveur
- ✅ Protection CSRF et XSS
- ✅ Gestion sécurisée des sessions
- ✅ Clés API non exposées côté client

### Points d'Attention
- Ne jamais exposer les clés secrètes Stripe
- Valider toutes les données côté serveur
- Utiliser HTTPS en production
- Configurer les CORS correctement

## 📊 Monitoring et Analytics

### Métriques Disponibles
- Nombre d'utilisateurs actifs
- Ventes par période
- Produits les plus populaires
- Taux de conversion panier
- Messages support

### Outils Recommandés
- **Supabase Analytics** pour la base de données
- **Stripe Dashboard** pour les paiements
- **Expo Analytics** pour l'usage mobile
- **Sentry** pour le monitoring d'erreurs

## 🤝 Contribution

### Guide de Contribution
1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

### Standards de Code
- ESLint pour la qualité du code
- Prettier pour le formatage
- TypeScript pour la sécurité des types
- Commentaires en français

## 📞 Support

### Contact
- **Email** : support@monappmontres.com
- **Documentation** : [Wiki du projet]
- **Issues** : [GitHub Issues]

### FAQ
**Q : Comment réinitialiser le mot de passe admin ?**
R : Utilisez la fonction de récupération de mot de passe ou modifiez directement en base.

**Q : Les paiements ne fonctionnent pas ?**
R : Vérifiez vos clés Stripe et la configuration des webhooks.

**Q : Comment ajouter une nouvelle catégorie ?**
R : Ajoutez la catégorie dans la base de données et mettez à jour les composants.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Supabase** pour la base de données et l'authentification
- **Stripe** pour les paiements sécurisés
- **Expo** pour le framework de développement
- **Pexels** pour les images et vidéos de démonstration

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Statut** : ✅ Production Ready
