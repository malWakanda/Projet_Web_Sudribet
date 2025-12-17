# Guide de test - API Brevo

## Prérequis

1. **Node.js doit être installé**
   - Téléchargez depuis: https://nodejs.org/
   - Installez la version LTS
   - Redémarrez votre terminal après l'installation

## Étapes de test

### 1. Vérifier la configuration

Exécutez le script de test:
```powershell
.\test-setup.ps1
```

Ou vérifiez manuellement:
- Le fichier `.env` existe et contient votre clé API Brevo
- L'email expéditeur est configuré (doit être vérifié dans Brevo)

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'email expéditeur

Ouvrez le fichier `.env` et remplacez:
```
BREVO_SENDER_EMAIL=noreply@example.com
```

Par votre adresse email vérifiée dans Brevo (Settings > Senders & IP)

### 4. Démarrer le serveur

```bash
npm start
```

Vous devriez voir:
```
Serveur démarré sur le port 3000
Assurez-vous d'avoir configuré votre clé API Brevo dans le fichier .env
```

### 5. Tester l'inscription

1. Ouvrez votre navigateur: `http://localhost:3000`
2. Cliquez sur le bouton de profil (icône +)
3. Cliquez sur "Créer un compte"
4. Remplissez le formulaire:
   - Nom complet
   - Email (utilisez votre vraie adresse email pour recevoir le message)
   - Mot de passe (min 10 caractères, majuscule, minuscule, chiffre, symbole)
5. Cliquez sur "Créer mon compte"

### 6. Vérifier l'email

- Vérifiez votre boîte de réception
- Vous devriez recevoir un email de confirmation de Brevo
- Cliquez sur le lien de confirmation dans l'email

### 7. Confirmer le compte

- Vous serez redirigé vers la page de confirmation
- Le compte sera activé automatiquement
- Vous pouvez maintenant vous connecter

### 8. Tester la connexion

1. Retournez sur la page d'accueil
2. Cliquez sur "Se connecter"
3. Utilisez l'email et le mot de passe que vous avez créés
4. La connexion devrait fonctionner

## Dépannage

### Erreur: "Cannot find module '@getbrevo/brevo'"
→ Exécutez: `npm install`

### Erreur: "BREVO_API_KEY is not defined"
→ Vérifiez que le fichier `.env` existe et contient `BREVO_API_KEY=...`

### Erreur: "Email non envoyé"
→ Vérifiez que:
- L'email expéditeur est vérifié dans Brevo
- La clé API est correcte
- Vous n'avez pas dépassé votre limite d'envoi Brevo

### Le serveur ne démarre pas
→ Vérifiez que le port 3000 n'est pas déjà utilisé:
```bash
netstat -ano | findstr :3000
```

### L'email n'arrive pas
→ Vérifiez:
- Le dossier spam/courrier indésirable
- Que l'email expéditeur est vérifié dans Brevo
- Les logs du serveur pour voir les erreurs

## Logs du serveur

Le serveur affichera les erreurs dans la console. Surveillez les messages d'erreur pour diagnostiquer les problèmes.

