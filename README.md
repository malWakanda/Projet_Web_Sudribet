# 🏆 Paris Sport ESME

Une plateforme de paris sportifs moderne et interactive pour les étudiants de l'ESME, permettant de parier sur les matchs universitaires de différents sports.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Fonctionnalités détaillées](#fonctionnalités-détaillées)
- [Contribution](#contribution)

## 🎯 Aperçu

Paris Sport ESME est une application web complète qui permet aux étudiants de :
- Consulter les matchs à venir de différents sports (Football, Basketball, Rugby, Volley, Handball)
- Placer des paris sur les résultats des matchs
- Suivre leurs statistiques et historique de paris
- Consulter les classements des équipes
- Gérer leur profil utilisateur avec un système de coins virtuels

## ✨ Fonctionnalités

### Authentification et Sécurité
- ✅ Inscription avec confirmation par email (via Brevo)
- ✅ Connexion sécurisée
- ✅ Réinitialisation de mot de passe par email
- ✅ Validation des mots de passe (10+ caractères, majuscules, minuscules, chiffres, symboles)
- ✅ Tokens de confirmation avec expiration (24h pour inscription, 1h pour reset)

### Interface Utilisateur
- 🎨 Design moderne et responsive
- 🌓 Mode sombre/clair
- 🔍 Barre de recherche pour filtrer les matchs
- 📱 Navigation fluide avec animations
- 🎯 Interface intuitive avec effets de gradient

### Système de Paris
- 💰 Système de coins virtuels (100 coins de départ)
- 🎲 Paris sur victoire, nul ou défaite
- 📊 Cotes dynamiques pour chaque match
- 📈 Historique des paris dans le profil
- 🏅 Calcul automatique des gains

### Gestion des Matchs
- ⚽ Support multi-sports (Football, Basketball, Rugby, Volley, Handball)
- 📅 Affichage des dates et horaires des matchs
- 🔴 Badge "LIVE" pour les matchs en cours
- 🏆 Logos des équipes

### Panel Administrateur
- 🔐 Accès sécurisé par mot de passe
- ✅ Validation des résultats des matchs
- 💸 Distribution automatique des gains
- 📊 Gestion des paris en cours

## 🛠 Technologies utilisées

### Frontend
- **HTML5** - Structure des pages
- **CSS3** - Styles et animations
  - Variables CSS pour le theming
  - Flexbox et Grid pour le layout
  - Animations et transitions
- **JavaScript (Vanilla)** - Logique côté client
  - LocalStorage pour la persistance des données
  - Fetch API pour les requêtes HTTP
  - Manipulation du DOM

### Backend
- **Node.js** - Environnement d'exécution
- **Express.js** - Framework web
- **Brevo API** - Service d'envoi d'emails transactionnels
- **dotenv** - Gestion des variables d'environnement
- **body-parser** - Parsing des requêtes HTTP

### Stockage
- **JSON File System** - Stockage des utilisateurs (`users.json`)
- **LocalStorage** - Stockage côté client (paris, préférences)

## 📦 Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** (généralement installé avec Node.js)
- **Compte Brevo** (pour l'envoi d'emails)
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd Projet_Web_Sudribet
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer le fichier `.env`**
```bash
# Créer un fichier .env à la racine du projet
touch .env
```

4. **Configurer les variables d'environnement** (voir section Configuration)

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Brevo
BREVO_API_KEY=votre_clé_api_brevo
BREVO_SENDER_EMAIL=noreply@votredomaine.com

# Configuration du serveur
PORT=3000
API_BASE_URL=http://localhost:3000
CLIENT_BASE_URL=http://localhost:5500

# Optionnel : pour le déploiement
# API_BASE_URL=https://votre-domaine.com
# CLIENT_BASE_URL=https://votre-domaine.com
```

### Obtenir une clé API Brevo

1. Créez un compte sur [Brevo](https://www.brevo.com/)
2. Allez dans **Settings** → **SMTP & API**
3. Créez une nouvelle clé API
4. Copiez la clé dans votre fichier `.env`

## 🎮 Utilisation

### Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Accéder à l'application

1. **Avec Live Server (recommandé pour le développement)**
   - Installez l'extension "Live Server" dans VS Code
   - Clic droit sur `index.html` → "Open with Live Server"
   - L'application s'ouvre sur `http://localhost:5500`

2. **Directement via le serveur Express**
   - Ouvrez `http://localhost:3000/index.html`

### Créer un compte

1. Cliquez sur l'icône de profil ("+") en haut à droite
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire
4. Vérifiez votre email pour le lien de confirmation
5. Cliquez sur le lien pour activer votre compte

### Placer un pari

1. Connectez-vous à votre compte
2. Parcourez les matchs disponibles
3. Cliquez sur une option de pari (Victoire, Nul, Défaite)
4. Cliquez sur "Valider le pari"
5. Votre solde de coins est mis à jour

### Accéder au panel admin

1. Allez sur `admin.html`
2. Entrez le mot de passe administrateur
3. Validez les résultats des matchs
4. Les gains sont automatiquement distribués

## 📁 Structure du projet

```
Projet_Web_Sudribet/
├── index.html              # Page principale avec les matchs
├── profil.html            # Page de profil utilisateur
├── tournois.html          # Page des tournois
├── classements.html       # Page des classements
├── matchs.html            # Page liste des matchs
├── admin.html             # Panel administrateur
├── confirm-email.html     # Page de confirmation d'email
├── reset-password.html    # Page de réinitialisation de mot de passe
│
├── style.css              # Styles principaux
├── GradientText.css       # Styles pour les textes en gradient
├── PillNav.css            # Styles pour la navigation
│
├── script.js              # Logique principale (paris, auth)
├── profil.js              # Logique de la page profil
├── admin.js               # Logique du panel admin
├── darkmode.js            # Gestion du mode sombre
├── GradientText.js        # Animation des textes gradient
├── PillNav.js             # Navigation interactive
├── search.js              # Fonctionnalité de recherche
│
├── server.js              # Serveur Express
├── package.json           # Dépendances npm
├── .env                   # Variables d'environnement (à créer)
├── .gitignore            # Fichiers à ignorer par Git
│
├── users.json             # Base de données utilisateurs (généré automatiquement)
│
└── logos/                 # Logos des équipes
    ├── foot.png
    ├── basket.png
    ├── rugby.png
    ├── volley.png
    └── hand.png
```

## 🔌 API Endpoints

### Authentification

#### `POST /api/send-confirmation-email`
Envoie un email de confirmation lors de l'inscription.

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!"
}
```

#### `POST /api/confirm-email`
Confirme l'email et active le compte.

**Body:**
```json
{
  "token": "confirmation_token"
}
```

#### `POST /api/login`
Authentifie un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Réinitialisation de mot de passe

#### `POST /api/forgot-password`
Envoie un email de réinitialisation.

**Body:**
```json
{
  "email": "user@example.com"
}
```

#### `POST /api/reset-password`
Réinitialise le mot de passe.

**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123!"
}
```

### Vérification

#### `GET /api/verify-token/:token`
Vérifie la validité d'un token de confirmation.

#### `GET /api/verify-reset-token/:token`
Vérifie la validité d'un token de réinitialisation.

#### `GET /api/test`
Endpoint de test pour vérifier que l'API fonctionne.

## 🎯 Fonctionnalités détaillées

### Système de Coins

- **Solde initial:** 100 coins
- **Coût par pari:** 10 coins
- **Gains:** Mise × Cote (ex: 10 coins × 1.8 = 18 coins)
- **Stockage:** LocalStorage du navigateur

### Gestion des Paris

Les paris sont stockés dans le LocalStorage avec la structure suivante:

```javascript
{
  matchId: "match_1",
  teams: "Foot ESME 1 vs Foot IESEG",
  betType: "Victoire",
  odds: 1.8,
  amount: 10,
  potentialWin: 18,
  date: "2024-12-19T15:20:00.000Z",
  status: "pending" // pending, won, lost
}
```

### Mode Sombre

- Bascule automatique entre mode clair et sombre
- Préférence sauvegardée dans LocalStorage
- Transition fluide entre les modes
- Icônes adaptatives (☀️/🌙)

### Recherche

- Recherche en temps réel
- Filtrage par nom d'équipe ou événement
- Affichage d'un message si aucun résultat

## 🤝 Contribution

Ce projet est un projet étudiant pour l'ESME. Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Notes importantes

### Sécurité

⚠️ **Ce projet est à des fins éducatives uniquement**

- Les mots de passe sont stockés en clair (ne jamais faire en production!)
- Utilisez bcrypt ou argon2 pour hasher les mots de passe en production
- Implémentez HTTPS en production
- Ajoutez une vraie base de données (MongoDB, PostgreSQL, etc.)
- Implémentez des tokens JWT pour l'authentification

### Limitations actuelles

- Stockage en fichier JSON (non scalable)
- Pas de hashage des mots de passe
- Pas de rate limiting sur les API
- Pas de validation CSRF
- LocalStorage pour les paris (peut être effacé)

### Améliorations futures

- [ ] Base de données SQL/NoSQL
- [ ] Authentification JWT
- [ ] WebSockets pour les mises à jour en temps réel
- [ ] Système de notifications push
- [ ] Statistiques avancées
- [ ] Classement des meilleurs parieurs
- [ ] API REST complète
- [ ] Tests unitaires et d'intégration
- [ ] Docker pour le déploiement

## 📄 License

ISC

## 👥 Auteurs

Projet réalisé par les étudiants de l'ESME - Ingénieur 2

---

**Bon paris ! 🎲🏆**
