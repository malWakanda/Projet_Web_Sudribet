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

    if (profileIcon && dropdown) {
        dropdown.classList.add('hidden'); // Masqué par défaut
        profileIcon.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });
    }

    // ---------- GESTION DES MODALES ----------
    const signupModal = document.getElementById('signup-modal');
    const signupBtn = document.getElementById('signup-btn');
    if(signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'flex';
            if(dropdown) dropdown.classList.add('hidden');
        });
    }
    
    const closeModal = document.getElementById('close-modal');
    if(closeModal) {
        closeModal.addEventListener('click', () => {
            signupModal.style.display = 'none';
        });
    }

    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            if(dropdown) dropdown.classList.add('hidden');
        });
    }

    const closeLoginModal = document.getElementById('close-login-modal');
    if(closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    // ---------- MODAL MOT DE PASSE OUBLIÉ ----------
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    
    if(forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            forgotPasswordModal.style.display = 'flex';
        });
    }

    const closeForgotModal = document.getElementById('close-forgot-password-modal');
    if(closeForgotModal) {
        closeForgotModal.addEventListener('click', () => {
            forgotPasswordModal.style.display = 'none';
            document.getElementById('forgot-password-email').value = '';
        });
    }

    // ---------- ENVOI EMAIL RÉINITIALISATION ----------
    const resetBtn = document.getElementById('send-reset-email-btn');
    if(resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const email = document.getElementById('forgot-password-email').value.trim();
            if (!email) return alert('Email requis');
            
            // Simulation
            alert('Si cet email existe, vous recevrez les instructions.');
            forgotPasswordModal.style.display = 'none';
        });
    }

    // ---------- CREATION DE COMPTE ----------
    const createAccountBtn = document.getElementById('create-account-btn');
    if(createAccountBtn) {
        createAccountBtn.addEventListener('click', async (e) => {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            if(name && email && password) {
                 let users = JSON.parse(localStorage.getItem('users')) || {};
                 
                 if (users[email]) {
                     alert("Cet email existe déjà !");
                     return;
                 }

                 // CRUCIAL : On initialise les coins à 1000 ici
                 users[email] = { 
                     name: name, 
                     password: password, 
                     emailConfirmed: true, 
                     coins: 1000 
                 };
                 
                 localStorage.setItem('users', JSON.stringify(users));
                 alert('Compte créé avec succès ! Vous avez reçu 1000 coins de bienvenue.');
                 signupModal.style.display = 'none';
            } else {
                alert("Veuillez remplir tous les champs");
            }
        });
    }

    // ---------- CONNEXION ----------
    const loginAccountBtn = document.getElementById('login-account-btn');
    if(loginAccountBtn) {
        loginAccountBtn.addEventListener('click', async () => {
             const email = document.getElementById('login-email').value;
             const password = document.getElementById('login-password').value;
             
             let users = JSON.parse(localStorage.getItem('users')) || {};
             
             // Vérification simple
             if(users[email] && users[email].password === password) {
                 
                 // CORRECTION : Si l'utilisateur n'a pas de coins (vieux compte), on lui met 1000
                 if (users[email].coins === undefined || users[email].coins === null) {
                     users[email].coins = 1000;
                     localStorage.setItem('users', JSON.stringify(users));
                 }

                 // On connecte l'utilisateur
                 localStorage.setItem('currentUser', email);
                 
                 alert("Connexion réussie !");
                 loginModal.style.display = 'none';
                 updateUI();
             } else {
                 alert("Email ou mot de passe incorrect.");
             }
        });
    }

    // ---------- LOGOUT ----------
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert("Déconnexion réussie !");
            updateUI();
            if(dropdown) dropdown.classList.add('hidden');
        });
    }

    // ============================================================
    //  GESTION DES PARIS (NOUVEAU SYSTÈME)
    // ============================================================
    // On sélectionne toutes les cartes de match pour gérer les clics
    document.querySelectorAll('.match-card').forEach(card => {
        const options = card.querySelectorAll('.bet-option');
        const validateBtn = card.querySelector('.validate-bet-btn');
        // Génère un ID si absent pour tester
        const matchId = card.getAttribute('data-match-id') || 'match_' + Math.floor(Math.random() * 1000); 

        // 1. QUAND ON CLIQUE SUR UNE COTE (Victoire/Nul/Défaite)
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Si pas de bouton valider, on ne fait rien
                if (!validateBtn) return; 

                // Si pari déjà placé (bouton caché), on bloque
                if (validateBtn.classList.contains('hidden') && card.dataset.betPlaced === "true") return;

                // a) On enlève l'orange des autres
                options.forEach(opt => opt.classList.remove('selected'));
                
                // b) On met l'orange sur celui cliqué
                this.classList.add('selected');

                // c) On affiche le bouton Valider
                validateBtn.classList.remove('hidden');
            });
        });

        // 2. QUAND ON CLIQUE SUR "VALIDER LE PARI"
        if (validateBtn) {
            validateBtn.addEventListener('click', function() {
                const userEmail = localStorage.getItem('currentUser');
                
                // Vérifier si connecté
                if (!userEmail) {
                    alert('Veuillez vous connecter pour parier.');
                    return;
                }

                // Récupérer l'utilisateur
                let users = JSON.parse(localStorage.getItem('users')) || {};
                let user = users[userEmail];

                // Vérifier les coins
                if (!user.coins || user.coins < 10) {
                    alert('Solde insuffisant ! Il vous faut 10 coins.');
                    return;
                }

                // Récupérer le choix
                const selectedOption = card.querySelector('.bet-option.selected');
                if (!selectedOption) return; 

                const choice = selectedOption.querySelector('.bet-label').textContent; // "Victoire"
                const odds = parseFloat(selectedOption.querySelector('.bet-value').textContent); 

                // --- ACTION : DÉBITER ET ENREGISTRER ---
                
                // 1. Débiter
                user.coins -= 10;
                
                // 2. Enregistrer le pari
                if (!user.bets) user.bets = []; 
                user.bets.push({
                    matchId: matchId,
                    choice: choice,
                    odds: odds,
                    amount: 10,
                    status: 'en cours',
                    date: new Date().toISOString()
                });

                // 3. Sauvegarder
                users[userEmail] = user;
                localStorage.setItem('users', JSON.stringify(users));

                // 4. Feedback visuel
                updateUI(); // Met à jour le solde en haut
                alert(`Pari validé sur "${choice}" ! 10 coins débités.`);

                // 5. Masquer le bouton et verrouiller
                validateBtn.classList.add('hidden');
                card.dataset.betPlaced = "true"; 
                card.style.border = "2px solid #28a745"; // Bordure verte
            });
        }
    });


    // ==========================================
    //  FONCTION UPDATE UI
    // ==========================================
    function updateUI() {
        const userEmail = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userName = userEmail ? (users[userEmail]?.name || 'Utilisateur') : null;
        const userCoins = userEmail ? (users[userEmail]?.coins || 0) : 0;

        const userInfo = document.getElementById('user-info');
        const userNameSpan = document.querySelector('.user-name');
        const menuUsername = document.getElementById('menu-username');

        // 1. Mise à jour des textes
        if (userEmail) {
            if(userInfo) {
                userInfo.classList.remove('hidden'); 
                if(menuUsername) menuUsername.textContent = userName;
            }
            if(userNameSpan) userNameSpan.textContent = `🪙 ${userCoins}`;
        } else {
            if(userInfo) userInfo.classList.add('hidden');
            if(userNameSpan) userNameSpan.textContent = 'Connectez vous!';
        }

        // 2. Gestion des boutons
        const btnLogin = document.getElementById('login-btn');
        const btnSignup = document.getElementById('signup-btn');
        const btnLogout = document.getElementById('logout-btn');

        if (userEmail) {
            // Si connecté
            if(btnLogin) btnLogin.classList.add('hidden');
            if(btnSignup) btnSignup.classList.add('hidden');
            if(btnLogout) btnLogout.classList.remove('hidden');
        } else {
            // Si déconnecté
            if(btnLogin) btnLogin.classList.remove('hidden');
            if(btnSignup) btnSignup.classList.remove('hidden');
            if(btnLogout) btnLogout.classList.add('hidden');
        }
    }

    // Appeler updateUI au chargement
    updateUI();

    // ---------- NAVIGATION PAR HASH ----------
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
    handleHashChange();
});

// Fonctions utilitaires globales
function filterMatchesBySport(sport, matchCards) {
    matchCards.forEach(card => {
        const cardSport = card.getAttribute('data-sport');
        if (cardSport === sport) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
//  FONCTION CORRIGÉE : GESTION DES ONGLETS
// ==========================================
// Plus besoin de 'event', on cherche le bouton qui correspond au sportId
function showTab(sportId) {
    // 1. Cacher tous les contenus
    document.querySelectorAll('.ranking-content').forEach(el => el.classList.remove('active'));
    
    // 2. Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // 3. Afficher le contenu demandé
    const content = document.getElementById(sportId);
    if(content) content.classList.add('active');

    // 4. Activer le bon bouton (Astuce pour éviter 'event')
    document.querySelectorAll('.tab-btn').forEach(btn => {
        // Si le bouton contient l'appel à la fonction avec le bon ID, on l'active
        if(btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(sportId)) {
            btn.classList.add('active');
        }
    });
}

// Redirection profil
const btnProfilExiste = document.getElementById('profil-btn');
if(btnProfilExiste) {
    btnProfilExiste.addEventListener('click', () => {
        window.location.href = 'profil.html';
    });
}