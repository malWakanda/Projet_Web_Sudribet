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
        dropdown.classList.add('hidden');
        profileIcon.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });
    }

    // ---------- GESTION DES MODALES ----------
    const signupModal = document.getElementById('signup-modal');
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'flex';
            if (dropdown) dropdown.classList.add('hidden');
        });
    }

    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            signupModal.style.display = 'none';
        });
    }

    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            if (dropdown) dropdown.classList.add('hidden');
        });
    }

    const closeLoginModal = document.getElementById('close-login-modal');
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    // ---------- MODAL MOT DE PASSE OUBLIÉ ----------
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            forgotPasswordModal.style.display = 'flex';
        });
    }

    const closeForgotModal = document.getElementById('close-forgot-password-modal');
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', () => {
            forgotPasswordModal.style.display = 'none';
            document.getElementById('forgot-password-email').value = '';
        });
    }

    // ---------- ENVOI EMAIL RÉINITIALISATION ----------
    const resetBtn = document.getElementById('send-reset-email-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const email = document.getElementById('forgot-password-email').value.trim();
            if (!email) return alert('Email requis');
            alert('Si cet email existe, vous recevrez les instructions.');
            forgotPasswordModal.style.display = 'none';
        });
    }

    // ---------- CREATION DE COMPTE ----------
    const createAccountBtn = document.getElementById('create-account-btn');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', async (e) => {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (name && email && password) {
                let users = JSON.parse(localStorage.getItem('users')) || {};
                if (users[email]) {
                    alert("Cet email existe déjà !");
                    return;
                }
                users[email] = {
                    name: name,
                    password: password,
                    emailConfirmed: true,
                    coins: 1000
                };
                localStorage.setItem('users', JSON.stringify(users));
                alert('Compte créé avec succès ! +1000 coins.');
                signupModal.style.display = 'none';
            } else {
                alert("Veuillez remplir tous les champs");
            }
        });
    }

    // ---------- CONNEXION ----------
    const loginAccountBtn = document.getElementById('login-account-btn');
    if (loginAccountBtn) {
        loginAccountBtn.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            let users = JSON.parse(localStorage.getItem('users')) || {};

            if (users[email] && users[email].password === password) {
                if (users[email].coins === undefined || users[email].coins === null) {
                    users[email].coins = 1000;
                    localStorage.setItem('users', JSON.stringify(users));
                }
                localStorage.setItem('currentUser', email);
                alert("Connexion réussie !");
                loginModal.style.display = 'none';

                // On recharge la page pour appliquer l'état des paris immédiatement
                window.location.reload();
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        });
    }

    // ---------- LOGOUT ----------
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert("Déconnexion réussie !");
            updateUI();
            if (dropdown) dropdown.classList.add('hidden');
            // On recharge pour enlever les paris visuels
            window.location.reload();
        });
    }

    // ============================================================
    //  GESTION DES PARIS (AVEC RESTAURATION)
    // ============================================================
    document.querySelectorAll('.match-card').forEach(card => {
        const options = card.querySelectorAll('.bet-option');
        const validateBtn = card.querySelector('.validate-bet-btn');
        // ATTENTION : Pour que ça marche, il faut que l'ID soit fixe dans le HTML (ex: data-match-id="match_1")
        const matchId = card.getAttribute('data-match-id');

        // 0. RESTAURATION DE L'ÉTAT (Vérification dans le stockage centralisé)
        if (matchId) {
            const userEmail = localStorage.getItem('currentUser');
            if (userEmail) {
                // Vérifier dans le stockage centralisé des paris
                const bets = JSON.parse(localStorage.getItem('bets')) || {};
                const matchBets = bets[matchId] || [];
                const userBet = matchBets.find(bet => bet.userId === userEmail);

                if (userBet) {
                    // Le pari existe ! On restaure le visuel

                    // Convertir la prédiction en label de choix
                    let choiceLabel = '';
                    if (userBet.prediction === 'victoire') choiceLabel = 'Victoire';
                    else if (userBet.prediction === 'nul') choiceLabel = 'Nul';
                    else if (userBet.prediction === 'defaite') choiceLabel = 'Défaite';

                    // 1. On retrouve la case qu'il avait choisie et on la met en orange
                    options.forEach(opt => {
                        const label = opt.querySelector('.bet-label').textContent;
                        if (label === choiceLabel) {
                            opt.classList.add('selected');
                        }
                    });

                    // 2. On cache le bouton valider
                    if (validateBtn) validateBtn.classList.add('hidden');

                    // 3. On verrouille la carte (bordure verte)
                    card.dataset.betPlaced = "true";
                    card.style.border = "2px solid #28a745";
                }
            }
        }

        // 1. QUAND ON CLIQUE SUR UNE COTE
        options.forEach(option => {
            option.addEventListener('click', function () {
                if (!validateBtn) return;
                if (validateBtn.classList.contains('hidden') && card.dataset.betPlaced === "true") return;

                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                validateBtn.classList.remove('hidden');
            });
        });

        // 2. QUAND ON CLIQUE SUR "VALIDER"
        if (validateBtn) {
            validateBtn.addEventListener('click', function () {
                const userEmail = localStorage.getItem('currentUser');

                if (!userEmail) {
                    alert('Veuillez vous connecter pour parier.');
                    return;
                }

                let users = JSON.parse(localStorage.getItem('users')) || {};
                let user = users[userEmail];

                if (!user.coins || user.coins < 10) {
                    alert('Solde insuffisant !');
                    return;
                }

                const selectedOption = card.querySelector('.bet-option.selected');
                if (!selectedOption) return;

                const choice = selectedOption.querySelector('.bet-label').textContent;
                const odds = parseFloat(selectedOption.querySelector('.bet-value').textContent);

                // Si pas d'ID, on en crée un temporaire (mais attention à la persistance !)
                const finalId = matchId || 'temp_' + Date.now();

                // Vérifier si l'utilisateur a déjà parié sur ce match
                const bets = JSON.parse(localStorage.getItem('bets')) || {};
                const matchBets = bets[finalId] || [];
                const alreadyBet = matchBets.some(bet => bet.userId === userEmail);

                if (alreadyBet) {
                    alert('Vous avez déjà parié sur ce match !');
                    return;
                }

                // Convertir le choix en format standardisé
                let prediction = '';
                if (choice === 'Victoire') prediction = 'victoire';
                else if (choice === 'Nul') prediction = 'nul';
                else if (choice === 'Défaite') prediction = 'defaite';

                // Débit
                user.coins -= 10;

                // Enregistrement dans user.bets (pour l'historique)
                if (!user.bets) user.bets = [];
                user.bets.push({
                    matchId: finalId,
                    choice: choice,
                    odds: odds,
                    amount: 10,
                    status: 'pending',
                    date: new Date().toISOString()
                });

                // Enregistrement centralisé pour l'admin
                if (!bets[finalId]) bets[finalId] = [];
                bets[finalId].push({
                    userId: userEmail,
                    userName: user.name || userEmail,
                    prediction: prediction,
                    amount: 10,
                    odds: odds,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                });

                users[userEmail] = user;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('bets', JSON.stringify(bets));

                updateUI();
                alert(`Pari validé sur "${choice}" !`);

                validateBtn.classList.add('hidden');
                card.dataset.betPlaced = "true";
                card.style.border = "2px solid #28a745";
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

        if (userEmail) {
            if (userInfo) {
                userInfo.classList.remove('hidden');
                if (menuUsername) menuUsername.textContent = userName;
            }
            if (userNameSpan) userNameSpan.textContent = `🪙 ${userCoins}`;
        } else {
            if (userInfo) userInfo.classList.add('hidden');
            if (userNameSpan) userNameSpan.textContent = 'Connectez vous!';
        }

        const btnLogin = document.getElementById('login-btn');
        const btnSignup = document.getElementById('signup-btn');
        const btnLogout = document.getElementById('logout-btn');

        if (userEmail) {
            if (btnLogin) btnLogin.classList.add('hidden');
            if (btnSignup) btnSignup.classList.add('hidden');
            if (btnLogout) btnLogout.classList.remove('hidden');
        } else {
            if (btnLogin) btnLogin.classList.remove('hidden');
            if (btnSignup) btnSignup.classList.remove('hidden');
            if (btnLogout) btnLogout.classList.add('hidden');
        }
    }

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

function showTab(sportId) {
    document.querySelectorAll('.ranking-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const content = document.getElementById(sportId);
    if (content) content.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(sportId)) {
            btn.classList.add('active');
        }
    });
}

const btnProfilExiste = document.getElementById('profil-btn');
if (btnProfilExiste) {
    btnProfilExiste.addEventListener('click', () => {
        window.location.href = 'profil.html';
    });
}