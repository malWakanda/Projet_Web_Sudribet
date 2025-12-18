// Afficher les infos de l'utilisateur connecté
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        // Rediriger vers la page principale si personne n'est connecté
        window.location.href = "index.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = users[currentUser];
    const userName = userData?.name || currentUser;

    // Générer les initiales pour l'avatar
    const initials = userName
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Afficher les initiales dans l'avatar
    const avatarInitials = document.getElementById("avatar-initials");
    if (avatarInitials) {
        avatarInitials.innerText = initials;
    }

    // Afficher le nom d'utilisateur
    const usernameDisplay = document.getElementById("profile-username-display");
    if (usernameDisplay) {
        usernameDisplay.innerText = userName;
    }

    // Afficher l'email
    const emailDisplay = document.getElementById("profile-email-display");
    if (emailDisplay) {
        emailDisplay.innerText = currentUser;
    }

    // Backward compatibility - anciens éléments
    const oldUsername = document.getElementById("profile-username");
    if (oldUsername) {
        oldUsername.innerText = userName;
    }

    const oldEmail = document.getElementById("profile-email");
    if (oldEmail) {
        oldEmail.innerText = currentUser;
    }

    // ========================================
    // HISTORIQUE DES PARIS
    // ========================================

    const betsHistoryContainer = document.getElementById("bets-history-container");

    if (betsHistoryContainer && userData && userData.bets && userData.bets.length > 0) {
        betsHistoryContainer.innerHTML = '';

        // Trier les paris par date (plus récent en premier)
        const sortedBets = [...userData.bets].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        sortedBets.forEach(bet => {
            const betItem = document.createElement('div');
            betItem.className = 'bet-history-item';

            let statusBadge = '';
            let statusClass = '';
            let winningsText = '';

            if (bet.status === 'won') {
                statusClass = 'status-won';
                statusBadge = '✓ Gagné';
                winningsText = `<div class="bet-winnings">+${bet.winnings || Math.round(bet.amount * bet.odds)} coins</div>`;
            } else if (bet.status === 'lost') {
                statusClass = 'status-lost';
                statusBadge = '✗ Perdu';
            } else {
                statusClass = 'status-pending';
                statusBadge = '⏳ En attente';
            }

            const betDate = new Date(bet.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });

            betItem.innerHTML = `
                <div class="bet-history-info">
                    <div class="bet-history-match">Match #${bet.matchId.substring(0, 8)}</div>
                    <div class="bet-history-details">
                        ${bet.choice} • ${bet.amount} coins (×${bet.odds}) • ${betDate}
                    </div>
                </div>
                <div class="bet-history-status">
                    <div class="bet-status-badge ${statusClass}">${statusBadge}</div>
                    ${winningsText}
                </div>
            `;

            betsHistoryContainer.appendChild(betItem);
        });
    }

    // ========================================
    // MODE SOMBRE
    // ========================================

    // Récupérer la préférence du mode sombre depuis localStorage
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    const darkModeToggle = document.querySelector('.setting-item:nth-child(2) input[type="checkbox"]');

    // Appliquer le mode sombre au chargement si activé
    if (darkModeEnabled) {
        document.body.classList.add("dark-mode");
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }

    // Écouter le changement du toggle du mode sombre
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("darkMode", "true");
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "false");
            }
        });
    }

    // ========================================
    // DÉCONNEXION
    // ========================================

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    // ========================================
    // ANIMATIONS AU SCROLL
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observer les cartes de statistiques
    document.querySelectorAll('.stat-card, .activity-item').forEach(card => {
        observer.observe(card);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupérer l'élément checkbox grâce à son ID
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Vérifier que l'élément existe bien sur la page (pour éviter les erreurs)
    if (darkModeToggle) {
        
        // 2. Initialisation : Mettre la case à cocher dans le bon état au chargement
        // On utilise la fonction isEnabled() de ton darkmode.js
        if (window.darkMode && window.darkMode.isEnabled()) {
            darkModeToggle.checked = true;
        }

        // 3. Écouteur d'événement : Quand on change l'état du bouton
        darkModeToggle.addEventListener('change', (e) => {
            // e.target.checked renvoie true si coché, false sinon
            const isChecked = e.target.checked;
            
            // On appelle la fonction toggle de ton darkmode.js
            if (window.darkMode) {
                window.darkMode.toggle(isChecked);
            }
        });
    }
});