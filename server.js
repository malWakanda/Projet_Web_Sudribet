const express = require('express');
const bodyParser = require('body-parser');
const brevo = require('@getbrevo/brevo');
require('dotenv').config();
const crypto = require('crypto');
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

// Fonction pour générer un token de confirmation
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
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

        // Créer le lien de confirmation
        // Utiliser l'IP de WSL pour que le lien fonctionne depuis Windows
        const wslIp = '172.21.181.228';
        const confirmationLink = `http://${wslIp}:5500/confirm-email.html?token=${token}`;

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
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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
        const usersFilePath = path.join(__dirname, 'users.json');
        let users = {};
        
        if (fs.existsSync(usersFilePath)) {
            const usersData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(usersData);
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Le serveur écoute sur toutes les interfaces (0.0.0.0)`);
    console.log(`Assurez-vous d'avoir configuré votre clé API Brevo dans le fichier .env`);
    console.log(`Le serveur est accessible sur:`);
    console.log(`  - http://localhost:${PORT}`);
    console.log(`  - http://127.0.0.1:${PORT}`);
    console.log(`  - http://172.21.181.228:${PORT} (IP WSL)`);
    console.log(`========================================`);
});

