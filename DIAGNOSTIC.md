# Diagnostic de connexion API

## Problème : Erreur de connexion au serveur

### Vérifications à faire :

1. **Le serveur est-il démarré ?**
   ```bash
   # Dans WSL
   cd /mnt/c/Users/PC/Projet_Web_Sudribet
   npm start
   ```

2. **Le serveur répond-il depuis WSL ?**
   ```bash
   # Dans un autre terminal WSL
   curl http://localhost:3000
   curl http://172.21.181.228:3000
   ```

3. **L'IP de WSL a-t-elle changé ?**
   ```bash
   hostname -I
   ```
   Si l'IP est différente, mettez à jour les fichiers :
   - `script.js` (ligne 107)
   - `confirm-email.html` (ligne 95)
   - `server.js` (ligne 60)

4. **Le firewall bloque-t-il ?**
   - Vérifiez les paramètres du firewall Windows
   - Ajoutez une exception pour le port 3000

5. **Testez avec la page de diagnostic :**
   - Ouvrez `test-connection.html` dans votre navigateur
   - Cette page testera automatiquement les connexions

## Solutions alternatives :

### Option 1 : Utiliser localhost (si WSL2 port forwarding fonctionne)
Remplacez `172.21.181.228` par `localhost` dans :
- `script.js`
- `confirm-email.html`

### Option 2 : Démarrer le serveur depuis Windows
Au lieu de WSL, installez Node.js sur Windows et démarrez le serveur depuis PowerShell :
```powershell
npm start
```

### Option 3 : Utiliser une variable d'environnement
Créez un fichier `config.js` qui détecte automatiquement l'IP.

