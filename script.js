// -------------------------------
//  Navigation entre les sports
// -------------------------------
function getApiBaseUrl() {
    const meta = document.querySelector('meta[name="api-base-url"]');
    if (meta && meta.content) return meta.content.replace(/\/$/, '');
    if (window.API_BASE_URL) return window.API_BASE_URL.replace(/\/$/, '');
    const { protocol, hostname, port } = window.location;
    if (protocol === 'file:') return 'http://localhost:3000';
    const needsPort = !port && (hostname === 'localhost' || hostname === '127.0.0.1');
    return `${protocol}//${hostname}${needsPort ? ':3000' : port ? `:${port}` : ''}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const sportBtns = document.querySelectorAll('.sport-btn');
    const matchCards = document.querySelectorAll('.match-card');

    sportBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            sportBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const selectedSport = this.getAttribute('data-sport');
            filterMatchesBySport(selectedSport, matchCards);
        });
    });

    // ---------- MENU DEROULANT ----------
    const profileIcon = document.getElementById('profile-icon');
    const dropdown = document.querySelector('.dropdown-menu');

    dropdown.classList.add('hidden'); // Masqué par défaut
    profileIcon.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });

    // ---------- MODAL CREATION DE COMPTE ----------
    const signupModal = document.getElementById('signup-modal');
    document.getElementById('signup-btn').addEventListener('click', () => {
        signupModal.style.display = 'flex';
        dropdown.classList.add('hidden');
    });
    document.getElementById('close-modal').addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    // ---------- MODAL CONNEXION ----------
    const loginModal = document.getElementById('login-modal');
    document.getElementById('login-btn').addEventListener('click', () => {
        loginModal.style.display = 'flex';
        dropdown.classList.add('hidden');
    });
    document.getElementById('close-login-modal').addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // ---------- MODAL MOT DE PASSE OUBLIÉ ----------
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'flex';
    });

    document.getElementById('close-forgot-password-modal').addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
        // Réinitialiser le formulaire
        document.getElementById('forgot-password-email').value = '';
    });

    // ---------- ENVOI EMAIL RÉINITIALISATION ----------
    document.getElementById('send-reset-email-btn').addEventListener('click', async () => {
        const email = document.getElementById('forgot-password-email').value.trim();

        if (!email) {
            alert('Veuillez entrer votre adresse email.');
            return;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer un email valide.');
            return;
        }

        // Désactiver le bouton pendant l'envoi
        const sendBtn = document.getElementById('send-reset-email-btn');
        const originalText = sendBtn.textContent;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Envoi en cours...';

        try {
            const apiUrl = getApiBaseUrl();
            const response = await fetch(`${apiUrl}/api/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Si cet email existe dans notre système, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.');
                forgotPasswordModal.style.display = 'none';
                // Réinitialiser le formulaire
                document.getElementById('forgot-password-email').value = '';
            } else {
                alert(data.error || 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur détaillée:', error);
            alert(`Erreur de connexion au serveur.\n\nDétails: ${error.message}\n\nVérifiez que:\n1. Le serveur est démarré (npm start)\n2. L'URL API est correcte (${getApiBaseUrl()})\n3. Le firewall ne bloque pas le port 3000`);
        } finally {
            // Réactiver le bouton
            sendBtn.disabled = false;
            sendBtn.textContent = originalText;
        }
    });

    // ---------- MISE A JOUR DES PARI EN FONCTION DU SCORE ----------
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        input.addEventListener('input', function() {
            const container = this.closest('.match-card');
            const inputs = container.querySelectorAll('.score-input');
            const homeScore = parseInt(inputs[0].value) || 0;
            const awayScore = parseInt(inputs[1].value) || 0;
            const betOptions = container.querySelectorAll('.bet-option');
            betOptions.forEach(option => option.classList.remove('highlighted'));
            if (homeScore > awayScore) {
                betOptions[0].classList.add('highlighted'); // Victoire
            } else if (homeScore === awayScore) {
                betOptions[1].classList.add('highlighted'); // Nul
            } else {
                betOptions[2].classList.add('highlighted'); // Défaite
            }
        });
    });

    // ---------- CREATION DE COMPTE ----------
    document.getElementById('create-account-btn').addEventListener('click', async (e) => {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !email || !password) {
            alert('Merci de remplir tous les champs.');
            return;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer un email valide.');
            return;
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
        if (!passwordRegex.test(password)) {
            alert('Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un symbole.');
            return;
        }

        // Vérifier si l'email existe déjà dans le localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            alert("Cet email existe déjà !");
            return;
        }

        // Désactiver le bouton pendant l'envoi
        const createBtn = document.getElementById('create-account-btn');
        const originalText = createBtn.textContent;
        createBtn.disabled = true;
        createBtn.textContent = 'Envoi en cours...';

        try {
            // Envoyer une requête au backend pour envoyer l'email de confirmation
            const apiUrl = getApiBaseUrl();
            const response = await fetch(`${apiUrl}/api/send-confirmation-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Sauvegarder temporairement les données utilisateur avec le statut "non confirmé"
                users[email] = { 
                    name, 
                    password,
                    emailConfirmed: false,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('users', JSON.stringify(users));
                
                alert(`Un email de confirmation a été envoyé à ${email}. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.`);
                signupModal.style.display = 'none';
                
                // Réinitialiser le formulaire
                document.getElementById('signup-name').value = '';
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
            } else {
                alert(data.error || 'Erreur lors de l\'envoi de l\'email de confirmation. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur détaillée:', error);
            console.error('URL tentée:', `${getApiBaseUrl()}/api/send-confirmation-email`);
            alert(`Erreur de connexion au serveur.\n\nDétails: ${error.message}\n\nVérifiez que:\n1. Le serveur est démarré (npm start)\n2. L'URL API est correcte (${getApiBaseUrl()})\n3. Le firewall ne bloque pas le port 3000`);
        } finally {
            // Réactiver le bouton
            createBtn.disabled = false;
            createBtn.textContent = originalText;
        }
    });

    // ---------- CONNEXION ----------
    document.getElementById('login-account-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            alert('Merci de remplir tous les champs.');
            return;
        }

        const apiUrl = getApiBaseUrl();
        let users = JSON.parse(localStorage.getItem('users')) || {};

        try {
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Email ou mot de passe incorrect.');
            }

            // Synchroniser localStorage avec le serveur
            users[email] = {
                name: data.user.name,
                password,
                emailConfirmed: true,
                confirmedAt: data.user.confirmedAt || new Date().toISOString()
            };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', email);
            alert("Connexion réussie !");
            loginModal.style.display = 'none';
            updateUI();
        } catch (err) {
            // Fallback local si le serveur est injoignable mais que les données locales existent
            if (!users[email] || users[email].password !== password) {
                alert(err.message || "Email ou mot de passe incorrect.");
                return;
            }
            if (users[email].emailConfirmed === false) {
                alert("Votre compte n'est pas encore activé. Veuillez vérifier votre email et cliquer sur le lien de confirmation.");
                return;
            }
            localStorage.setItem('currentUser', email);
            alert("Connexion réussie (mode local) !");
            loginModal.style.display = 'none';
            updateUI();
        }
    });

    // ---------- LOGOUT ----------
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert("Déconnexion réussie !");
        updateUI();
        dropdown.classList.add('hidden');
    });

    // ---------- MISE A JOUR UI ----------
    function updateUI() {
        const userEmail = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userName = userEmail ? users[userEmail].name : null;

        const userInfo = document.getElementById('user-info');
        const profilBtn = document.getElementById('profil-btn');
        const userNameSpan = document.querySelector('.user-name');

        if (userEmail && userName) {
            userInfo.innerText = `Bienvenue, ${userName} !`;
            userInfo.style.display = 'block';
            profilBtn.style.display = 'block';
            // Mettre à jour le nom d'utilisateur dans le header
            if (userNameSpan) {
                userNameSpan.textContent = userName;
            }
        } else {
            userInfo.style.display = 'none';
            profilBtn.style.display = 'none';
            // Réinitialiser le texte si déconnecté
            if (userNameSpan) {
                userNameSpan.textContent = 'Connectez vous!';
            }
        }


        document.getElementById('login-btn').style.display = userEmail ? 'none' : 'block';
        document.getElementById('signup-btn').style.display = userEmail ? 'none' : 'block';
        document.getElementById('logout-btn').style.display = userEmail ? 'block' : 'none';
    }

    updateUI();

    // ---------- SECTION NAVIGATION ----------
    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }

    function handleHashChange() {
        const hash = window.location.hash.substring(1) || 'accueil';
        showSection(hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load
});

// -------------------------------
//  Fonction pour filtrer les matchs
// -------------------------------
function filterMatchesBySport(sport, matchCards) {
    matchCards.forEach(card => {
        const cardSport = card.getAttribute('data-sport');
        if (cardSport === sport) {
            card.style.display = 'block';
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// -------------------------------
//  CLASSIFICATIONS TAB FUNCTION
// -------------------------------
function showTab(sportId) {
    // Masquer tous les contenus
    document.querySelectorAll('.ranking-content').forEach(el => el.classList.remove('active'));
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Activer le contenu et le bouton sélectionnés
    document.getElementById(sportId).classList.add('active');
    event.target.classList.add('active');
}
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

document.getElementById('profil-btn').addEventListener('click', () => {
    window.location.href = 'profil.html';
});
