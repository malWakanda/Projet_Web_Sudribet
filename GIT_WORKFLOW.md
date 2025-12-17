# Guide Git - Pousser vos modifications sans affecter les autres

## Situation actuelle
Vous êtes sur la branche `sachou`. C'est parfait pour isoler vos modifications !

## Étapes pour pousser vos modifications

### 1. Vérifier que vous êtes sur votre branche
```bash
git branch
```
Vous devriez voir `* sachou` (l'étoile indique la branche active)

### 2. Ajouter seulement les fichiers importants (pas node_modules)
```bash
# Ajouter les fichiers de configuration et code
git add .gitignore
git add package.json
git add package-lock.json

# Ajouter les fichiers de code
git add server.js
git add script.js
git add confirm-email.html
git add index.html
git add profil.html
git add profil.js

# Ajouter la documentation
git add README_BREVO.md
git add GUIDE_TEST.md
git add DIAGNOSTIC.md
git add env.example

# Ajouter les fichiers de test (optionnel)
git add test-connection.html
git add test-setup.ps1
```

**IMPORTANT :** Ne pas ajouter :
- `.env` (contient votre clé API secrète - déjà dans .gitignore)
- `node_modules/` (dépendances - déjà dans .gitignore)
- `users.json` (données utilisateurs - déjà dans .gitignore)

### 3. Vérifier ce qui sera commité
```bash
git status
```

### 4. Faire un commit avec un message descriptif
```bash
git commit -m "Ajout de l'intégration API Brevo pour confirmation d'emails

- Ajout du serveur Express avec API Brevo
- Modification du frontend pour envoi d'emails de confirmation
- Ajout de la page de confirmation d'email
- Configuration CORS et support WSL
- Documentation et guides de test"
```

### 5. Pousser sur votre branche
```bash
git push origin sachou
```

## Si vous voulez créer une nouvelle branche

Si vous préférez créer une branche spécifique pour cette fonctionnalité :

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/brevo-email-confirmation

# Puis suivre les étapes 2-5 ci-dessus
```

## Fusionner plus tard (quand vous êtes prêt)

Quand vous voulez fusionner avec la branche principale (main/master) :

```bash
# Basculer sur la branche principale
git checkout main  # ou master selon votre repo

# Mettre à jour
git pull origin main

# Fusionner votre branche
git merge sachou

# Pousser
git push origin main
```

## Commandes rapides (tout en une fois)

```bash
# Ajouter les fichiers importants
git add .gitignore package.json package-lock.json server.js script.js confirm-email.html index.html profil.html profil.js README_BREVO.md GUIDE_TEST.md DIAGNOSTIC.md env.example test-connection.html test-setup.ps1

# Commit
git commit -m "Ajout de l'intégration API Brevo pour confirmation d'emails"

# Push
git push origin sachou
```


