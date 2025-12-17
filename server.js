const express = require('express');
const bodyParser = require('body-parser');
const brevo = require('@getbrevo/brevo');
require('dotenv').config();
const crypto = require('crypto'); // built-in
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS pour permettre les requêtes depuis différents ports
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Servir les fichiers statiques

// Initialiser le client Brevo
let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

// Stockage temporaire des tokens de confirmation (en production, utilisez une base de données)
const emailTokens = {};
// Stockage temporaire des tokens de réinitialisation de mot de passe
const resetPasswordTokens = {};
const usersFilePath = path.join(__dirname, 'users.json');

// Fonction pour générer un token de confirmation
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function getApiBaseUrl(req) {
    const envUrl = (process.env.API_BASE_URL || process.env.API_URL || '').trim();
    if (envUrl) return envUrl.replace(/\/$/, '');

    const origin = (req.headers.origin || '').trim();
    if (origin) return origin.replace(/\/$/, '');

    const hostname = req.hostname || 'localhost';
    return `http://${hostname}:3000`;
}

function getClientBaseUrl(req) {
    const envClient = (process.env.CLIENT_BASE_URL || process.env.CLIENT_URL || '').trim();
    if (envClient) return envClient.replace(/\/$/, '');

    const origin = (req.headers.origin || '').trim();
    if (origin) return origin.replace(/\/$/, '');

    const hostname = req.hostname || 'localhost';
    const portGuess = hostname === 'localhost' || hostname === '127.0.0.1' ? '5500' : '3000';
    return `http://${hostname}:${portGuess}`;
}

function readUsersFileSafe() {
    if (!fs.existsSync(usersFilePath)) {
        return {};
    }

    const raw = fs.readFileSync(usersFilePath, 'utf8');
    if (!raw.trim()) {
        return {};
    }

    try {
        return JSON.parse(raw);
    } catch (err) {
        throw new Error('Fichier users.json invalide (JSON non parsable)');
    }
}

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur API Brevo fonctionnel',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Route de test pour l'API
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API endpoint accessible',
        ip: req.ip,
        hostname: req.hostname
    });
});

// Route pour envoyer l'email de confirmation
app.post('/api/send-confirmation-email', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email et nom requis' });
        }

        // Générer un token de confirmation
        const token = generateToken();
        emailTokens[token] = {
            email,
            name,
            password: req.body.password, // Stocker le mot de passe temporairement pour la confirmation
            createdAt: Date.now()
        };

        // Créer le lien de confirmation basé sur la configuration dynamique
        const clientBaseUrl = getClientBaseUrl(req);
        const confirmationLink = `${clientBaseUrl}/confirm-email.html?token=${token}`;

        // Préparer l'email
        const sendSmtpEmail = {
            subject: "Confirmez votre adresse email - Paris Sport ESME",
            htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bienvenue sur Paris Sport ESME !</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour ${name},</p>
                        <p>Merci de vous être inscrit sur Paris Sport ESME. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
                        <div style="text-align: center;">
                            <a href="${confirmationLink}" class="button">Confirmer mon email</a>
                        </div>
                        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
                        <p style="word-break: break-all; color: #666;">${confirmationLink}</p>
                        <p>Ce lien expirera dans 24 heures.</p>
                        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Paris Sport ESME. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
            sender: { name: "Paris Sport ESME", email: process.env.BREVO_SENDER_EMAIL || "noreply@example.com" },
            to: [{ email, name }]
        };

        // Envoyer l'email
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.json({ 
            success: true, 
            message: 'Email de confirmation envoyé avec succès',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'envoi de l\'email de confirmation',
            details: error.message 
        });
    }
});

// Route pour confirmer l'email
app.post('/api/confirm-email', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token requis' });
        }

        const tokenData = emailTokens[token];

        if (!tokenData) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        // Vérifier si le token a expiré (24 heures)
        const tokenAge = Date.now() - tokenData.createdAt;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (tokenAge > twentyFourHours) {
            delete emailTokens[token];
            return res.status(400).json({ error: 'Token expiré' });
        }

        // Lire les utilisateurs existants
        let users = {};
        try {
            users = readUsersFileSafe();
        } catch (fileError) {
            return res.status(500).json({ 
                error: 'Base utilisateurs illisible',
                details: fileError.message 
            });
        }

        // Ajouter l'utilisateur avec le statut confirmé
        users[tokenData.email] = {
            name: tokenData.name,
            email: tokenData.email,
            password: tokenData.password,
            emailConfirmed: true,
            confirmedAt: new Date().toISOString()
        };

        // Sauvegarder les utilisateurs
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        // Supprimer le token utilisé
        delete emailTokens[token];

        res.json({ 
            success: true, 
            message: 'Email confirmé avec succès',
            user: {
                email: tokenData.email,
                name: tokenData.name
            }
        });
    } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la confirmation de l\'email',
            details: error.message 
        });
    }
});

// Route de login pour synchroniser le front avec la base fichier
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        let users = {};
        try {
            users = readUsersFileSafe();
        } catch (fileError) {
            return res.status(500).json({
                error: 'Base utilisateurs illisible',
                details: fileError.message
            });
        }

        const user = users[email];
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        if (!user.emailConfirmed) {
            return res.status(403).json({ error: 'Email non confirmé' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        return res.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                emailConfirmed: true,
                confirmedAt: user.confirmedAt
            }
        });
    } catch (error) {
        console.error('Erreur lors du login API:', error);
        res.status(500).json({
            error: 'Erreur serveur lors du login',
            details: error.message
        });
    }
});

// Route pour vérifier le statut d'un token
app.get('/api/verify-token/:token', (req, res) => {
    try {
        const { token } = req.params;
        const tokenData = emailTokens[token];

        if (!tokenData) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        // Vérifier si le token a expiré
        const tokenAge = Date.now() - tokenData.createdAt;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (tokenAge > twentyFourHours) {
            delete emailTokens[token];
            return res.status(400).json({ error: 'Token expiré' });
        }

        res.json({ 
            valid: true,
            email: tokenData.email,
            name: tokenData.name
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la vérification du token',
            details: error.message 
        });
    }
});

// Route pour demander la réinitialisation du mot de passe
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requis' });
        }

        // Lire les utilisateurs existants
        let users = {};
        try {
            users = readUsersFileSafe();
        } catch (fileError) {
            return res.status(500).json({ 
                error: 'Base utilisateurs illisible',
                details: fileError.message 
            });
        }

        const user = users[email];
        
        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        // On envoie toujours un message de succès même si l'email n'existe pas
        if (!user) {
            // Attendre un peu pour éviter les attaques de timing
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.json({ 
                success: true, 
                message: 'Si cet email existe dans notre système, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.'
            });
        }

        // Vérifier que l'email est confirmé
        if (!user.emailConfirmed) {
            return res.status(403).json({ 
                error: 'Votre email n\'est pas encore confirmé. Veuillez d\'abord confirmer votre email.' 
            });
        }

        // Générer un token de réinitialisation
        const token = generateToken();
        resetPasswordTokens[token] = {
            email: user.email,
            createdAt: Date.now()
        };

        // Créer le lien de réinitialisation
        const clientBaseUrl = getClientBaseUrl(req);
        const resetLink = `${clientBaseUrl}/reset-password.html?token=${token}`;

        // Préparer l'email
        const sendSmtpEmail = {
            subject: "Réinitialisation de votre mot de passe - Paris Sport ESME",
            htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .warning { background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Réinitialisation de mot de passe</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour ${user.name},</p>
                        <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte Paris Sport ESME.</p>
                        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
                        </div>
                        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
                        <p style="word-break: break-all; color: #666;">${resetLink}</p>
                        <div class="warning">
                            <p><strong>⚠️ Important :</strong></p>
                            <p>Ce lien expirera dans 1 heure.</p>
                            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2024 Paris Sport ESME. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
            sender: { name: "Paris Sport ESME", email: process.env.BREVO_SENDER_EMAIL || "noreply@example.com" },
            to: [{ email: user.email, name: user.name }]
        };

        // Envoyer l'email
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.json({ 
            success: true, 
            message: 'Si cet email existe dans notre système, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'envoi de l\'email de réinitialisation',
            details: error.message 
        });
    }
});

// Route pour réinitialiser le mot de passe
app.post('/api/reset-password', (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                error: 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un symbole.' 
            });
        }

        const tokenData = resetPasswordTokens[token];

        if (!tokenData) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        // Vérifier si le token a expiré (1 heure)
        const tokenAge = Date.now() - tokenData.createdAt;
        const oneHour = 60 * 60 * 1000;

        if (tokenAge > oneHour) {
            delete resetPasswordTokens[token];
            return res.status(400).json({ error: 'Token expiré. Veuillez faire une nouvelle demande de réinitialisation.' });
        }

        // Lire les utilisateurs existants
        let users = {};
        try {
            users = readUsersFileSafe();
        } catch (fileError) {
            return res.status(500).json({ 
                error: 'Base utilisateurs illisible',
                details: fileError.message 
            });
        }

        const user = users[tokenData.email];
        if (!user) {
            delete resetPasswordTokens[token];
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        // Mettre à jour le mot de passe
        users[tokenData.email].password = newPassword;
        users[tokenData.email].passwordResetAt = new Date().toISOString();

        // Sauvegarder les utilisateurs
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        // Supprimer le token utilisé
        delete resetPasswordTokens[token];

        res.json({ 
            success: true, 
            message: 'Mot de passe réinitialisé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la réinitialisation du mot de passe',
            details: error.message 
        });
    }
});

// Route pour vérifier le statut d'un token de réinitialisation
app.get('/api/verify-reset-token/:token', (req, res) => {
    try {
        const { token } = req.params;
        const tokenData = resetPasswordTokens[token];

        if (!tokenData) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        // Vérifier si le token a expiré (1 heure)
        const tokenAge = Date.now() - tokenData.createdAt;
        const oneHour = 60 * 60 * 1000;

        if (tokenAge > oneHour) {
            delete resetPasswordTokens[token];
            return res.status(400).json({ error: 'Token expiré' });
        }

        res.json({ 
            valid: true,
            email: tokenData.email
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token de réinitialisation:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la vérification du token',
            details: error.message 
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Le serveur écoute sur toutes les interfaces (0.0.0.0)`);
    console.log(`Assurez-vous d'avoir configuré votre clé API Brevo dans le fichier .env`);
    console.log(`Le serveur est accessible sur:`);
    console.log(`  - http://localhost:${PORT}`);
    console.log(`  - http://127.0.0.1:${PORT}`);
    console.log(`  - ${process.env.API_BASE_URL || 'http://<votre-ip>:3000'} (API_BASE_URL configurable)`);
    console.log(`========================================`);
});

