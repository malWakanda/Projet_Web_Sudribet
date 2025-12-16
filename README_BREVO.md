# Configuration de l'API Brevo pour la confirmation d'emails

## Installation

1. Installez les dépendances :
```bash
npm install
```

## Configuration

1. Créez un compte sur [Brevo](https://www.brevo.com/) (anciennement Sendinblue)

2. Obtenez votre clé API :
   - Connectez-vous à votre compte Brevo
   - Allez dans **Settings** > **API Keys**
   - Créez une nouvelle clé API ou utilisez une clé existante

3. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
```
BREVO_API_KEY=votre_cle_api_brevo_ici
BREVO_SENDER_EMAIL=noreply@votredomaine.com
PORT=3000
```

**Important :**
- Remplacez `votre_cle_api_brevo_ici` par votre vraie clé API Brevo
- Remplacez `noreply@votredomaine.com` par une adresse email vérifiée dans votre compte Brevo
- L'email de l'expéditeur doit être vérifié dans votre compte Brevo pour pouvoir envoyer des emails

## Démarrage du serveur

Démarrez le serveur backend :
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## Fonctionnement

1. **Inscription** : Lorsqu'un utilisateur crée un compte, un email de confirmation est automatiquement envoyé via Brevo
2. **Confirmation** : L'utilisateur clique sur le lien dans l'email et est redirigé vers la page de confirmation
3. **Activation** : Une fois l'email confirmé, le compte est activé et l'utilisateur peut se connecter

## Structure des fichiers

- `server.js` : Serveur Express qui gère l'envoi d'emails et la confirmation
- `confirm-email.html` : Page de confirmation d'email
- `script.js` : Code frontend modifié pour intégrer l'envoi d'emails
- `users.json` : Fichier JSON qui stocke les utilisateurs (créé automatiquement)

## Notes de sécurité

- Les tokens de confirmation expirent après 24 heures
- Les mots de passe sont stockés en clair dans `users.json` (pour la production, utilisez un hashage comme bcrypt)
- En production, utilisez une base de données au lieu de fichiers JSON
- Configurez CORS si vous déployez le frontend et le backend sur des domaines différents

