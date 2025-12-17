# Script de test pour vérifier la configuration Brevo
Write-Host "=== Test de configuration Brevo ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "1. Vérification de Node.js..." -ForegroundColor Yellow
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if ($nodePath) {
    $nodeVersion = node --version
    Write-Host "   [OK] Node.js installe: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "   -> Telechargez Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier npm
Write-Host "2. Vérification de npm..." -ForegroundColor Yellow
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if ($npmPath) {
    $npmVersion = npm --version
    Write-Host "   [OK] npm installe: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] npm n'est pas disponible" -ForegroundColor Red
    exit 1
}

# Vérifier le fichier .env
Write-Host "3. Vérification du fichier .env..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   [OK] Fichier .env trouve" -ForegroundColor Green
    $envContent = Get-Content .env -Raw
    if ($envContent -match "BREVO_API_KEY=xkeysib-") {
        Write-Host "   [OK] Cle API Brevo configuree" -ForegroundColor Green
    } else {
        Write-Host "   [ATTENTION] Cle API Brevo non trouvee ou invalide" -ForegroundColor Yellow
    }
    if ($envContent -match "BREVO_SENDER_EMAIL=") {
        $email = ($envContent -split "BREVO_SENDER_EMAIL=")[1] -split "`n" | Select-Object -First 1
        if ($email -and $email -ne "noreply@example.com") {
            Write-Host "   [OK] Email expediteur configure: $email" -ForegroundColor Green
        } else {
            Write-Host "   [ATTENTION] Email expediteur non configure (utilisez une adresse verifiee dans Brevo)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   [ERREUR] Fichier .env non trouve" -ForegroundColor Red
    Write-Host "   -> Creez un fichier .env avec votre cle API Brevo" -ForegroundColor Yellow
    exit 1
}

# Vérifier les dépendances
Write-Host "4. Vérification des dépendances..." -ForegroundColor Yellow
if (Test-Path "node_modules\@getbrevo\brevo") {
    Write-Host "   [OK] Package @getbrevo/brevo installe" -ForegroundColor Green
} else {
    Write-Host "   [ATTENTION] Dependances non installees" -ForegroundColor Yellow
    Write-Host "   -> Executez: npm install" -ForegroundColor Yellow
}

if (Test-Path "node_modules\dotenv") {
    Write-Host "   [OK] Package dotenv installe" -ForegroundColor Green
} else {
    Write-Host "   [ATTENTION] Package dotenv non installe" -ForegroundColor Yellow
}

# Verifier le serveur
Write-Host "5. Verification du fichier server.js..." -ForegroundColor Yellow
if (Test-Path server.js) {
    Write-Host "   [OK] Fichier server.js trouve" -ForegroundColor Green
} else {
    Write-Host "   [ERREUR] Fichier server.js non trouve" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Resume ===" -ForegroundColor Cyan
Write-Host "Pour demarrer le serveur, executez:" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor Green
Write-Host ""
Write-Host "Le serveur sera accessible sur http://localhost:3000" -ForegroundColor White
Write-Host ""

