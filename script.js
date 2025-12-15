// -------------------------------
//  Navigation entre les sports
// -------------------------------
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
    const profileIcon = document.querySelector('.profile-icon');
    const userProfile = document.querySelector('.user-profile');

    // Création du menu déroulant
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu hidden';
    dropdown.innerHTML = `
        <div id="user-info">Vous n'êtes pas connecté</div>
        <button id="login-btn">Se connecter</button>
        <button id="signup-btn">Créer un compte</button>
        <button id="logout-btn" style="display:none;">Se déconnecter</button>
    `;
    userProfile.appendChild(dropdown);

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

    // ---------- CREATION DE COMPTE ----------
    document.getElementById('create-account-btn').addEventListener('click', (e) => {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !email || !password) {
            alert('Merci de remplir tous les champs.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email]) {
            alert("Cet email existe déjà !");
            return;
        }

        users[email] = { name, password };
        localStorage.setItem('users', JSON.stringify(users));
        alert("Compte créé avec succès !");
        signupModal.style.display = 'none';
        updateUI();
    });

    // ---------- LOGIN ----------
    document.getElementById('login-btn').addEventListener('click', () => {
        const email = prompt("Email :");
        const password = prompt("Mot de passe :");
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (!users[email] || users[email].password !== password) {
            alert("Email ou mot de passe incorrect.");
            return;
        }

        localStorage.setItem('currentUser', email);
        alert("Connexion réussie !");
        updateUI();
        dropdown.classList.add('hidden');
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

        document.getElementById('user-info').innerText = userName
            ? `Bienvenue, ${userName} !`
            : "Vous n'êtes pas connecté";

        document.getElementById('login-btn').style.display = userEmail ? 'none' : 'block';
        document.getElementById('signup-btn').style.display = userEmail ? 'none' : 'block';
        document.getElementById('logout-btn').style.display = userEmail ? 'block' : 'none';
    }

    updateUI();
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
// Créer le bouton Profil
const profilBtn = document.createElement('button');
profilBtn.textContent = 'Profil';
profilBtn.addEventListener('click', () => {
    window.location.href = "profil.html";
});
dropdown.appendChild(profilBtn);

// -------------------------------
//  Animation fadeIn
// -------------------------------
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
