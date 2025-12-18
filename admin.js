// ========================================
// ADMIN PANEL - BETTING SYSTEM
// ========================================

const ADMIN_PASSWORD = "admin2024";

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-admin');
const matchesContainer = document.getElementById('matches-container');

// Stats elements
const totalBetsEl = document.getElementById('total-bets');
const pendingMatchesEl = document.getElementById('pending-matches');
const validatedMatchesEl = document.getElementById('validated-matches');
const totalCoinsEl = document.getElementById('total-coins');

// ========================================
// AUTHENTICATION
// ========================================

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        loginError.textContent = 'Mot de passe incorrect';
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
});

function showAdminPanel() {
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    loadAdminData();
}

// Check if already logged in
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    showAdminPanel();
}

// ========================================
// DATA MANAGEMENT
// ========================================

function getBets() {
    return JSON.parse(localStorage.getItem('bets')) || {};
}

function setBets(bets) {
    localStorage.setItem('bets', JSON.stringify(bets));
}

function getMatchResults() {
    return JSON.parse(localStorage.getItem('matchResults')) || {};
}

function setMatchResults(results) {
    localStorage.setItem('matchResults', JSON.stringify(results));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
}

function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ========================================
// MATCH DATA
// ========================================

const matchesData = {
    // FOOTBALL
    'match_1': {
        id: 'match_1',
        homeTeam: 'Foot ESME 1',
        awayTeam: 'Foot IESEG',
        sport: 'Football',
        date: '16/03'
    },
    'match_2': {
        id: 'match_2',
        homeTeam: 'Foot ESME Féminines',
        awayTeam: 'Foot Centrale',
        sport: 'Football',
        date: '17/03'
    },
    // BASKETBALL
    'match_3': {
        id: 'match_3',
        homeTeam: 'Basket ESME',
        awayTeam: 'Basket IESEG',
        sport: 'Basketball',
        date: '18/03'
    },
    // RUGBY
    'match_4': {
        id: 'match_4',
        homeTeam: 'Rugby ESME',
        awayTeam: 'Rugby Centrale',
        sport: 'Rugby',
        date: '19/03'
    },
    // VOLLEY
    'match_5': {
        id: 'match_5',
        homeTeam: 'Volley ESME Équipe 1',
        awayTeam: 'Volley IPSA',
        sport: 'Volley',
        date: '20/03'
    },
    'match_6': {
        id: 'match_6',
        homeTeam: 'Volley ESME Féminines',
        awayTeam: 'Volley IPSA Féminines',
        sport: 'Volley',
        date: '21/03'
    },
    // HAND
    'match_7': {
        id: 'match_7',
        homeTeam: 'Hand ESME',
        awayTeam: 'Hand IESEG',
        sport: 'Handball',
        date: '16/03'
    },
    'match_8': {
        id: 'match_8',
        homeTeam: 'Hand ESME Féminines',
        awayTeam: 'Hand IPSA Féminines',
        sport: 'Handball',
        date: '22/03'
    }
};


// ========================================
// LOAD AND DISPLAY DATA
// ========================================

function loadAdminData() {
    const bets = getBets();
    const results = getMatchResults();

    // Calculate statistics
    let totalBets = 0;
    let pendingMatches = 0;
    let validatedMatches = 0;
    let totalCoins = 0;

    Object.keys(matchesData).forEach(matchId => {
        const matchBets = bets[matchId] || [];
        totalBets += matchBets.length;
        totalCoins += matchBets.reduce((sum, bet) => sum + bet.amount, 0);

        if (results[matchId] && results[matchId].processed) {
            validatedMatches++;
        } else if (matchBets.length > 0) {
            pendingMatches++;
        }
    });

    // Update stats
    totalBetsEl.textContent = totalBets;
    pendingMatchesEl.textContent = pendingMatches;
    validatedMatchesEl.textContent = validatedMatches;
    totalCoinsEl.textContent = totalCoins;

    // Display matches
    displayMatches();
}

function displayMatches() {
    const bets = getBets();
    const results = getMatchResults();

    matchesContainer.innerHTML = '';

    Object.values(matchesData).forEach(match => {
        const matchBets = bets[match.id] || [];
        const matchResult = results[match.id];
        const isValidated = matchResult && matchResult.processed;

        const card = document.createElement('div');
        card.className = 'match-admin-card';

        card.innerHTML = `
            <div class="match-admin-header">
                <div>
                    <div class="match-title">${match.homeTeam} vs ${match.awayTeam}</div>
                    <div style="color: var(--text-secondary); font-size: 14px; margin-top: 5px;">
                        ${match.sport} - ${match.date}
                    </div>
                </div>
                <span class="match-status ${isValidated ? 'status-validated' : 'status-pending'}">
                    ${isValidated ? '✓ Validé' : '⏳ En attente'}
                </span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: var(--text-primary);">Paris (${matchBets.length})</strong>
            </div>
            
            ${matchBets.length > 0 ? `
                <div class="bets-list">
                    ${matchBets.map(bet => `
                        <div class="bet-item">
                            <div>
                                <span class="bet-user">${bet.userName}</span>
                                <span class="bet-prediction"> - ${getPredictionLabel(bet.prediction)}</span>
                            </div>
                            <div>
                                <span class="bet-amount">${bet.amount} coins</span>
                                <span style="color: var(--text-secondary); margin-left: 10px;">
                                    (×${bet.odds})
                                </span>
                                ${bet.status !== 'pending' ? `
                                    <span style="margin-left: 10px; font-weight: 600; color: ${bet.status === 'won' ? '#28a745' : '#dc3545'};">
                                        ${bet.status === 'won' ? '✓ Gagné' : '✗ Perdu'}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="no-bets">Aucun pari pour ce match</div>
            `}
            
            ${!isValidated && matchBets.length > 0 ? `
                <div class="result-form">
                    <select id="result-${match.id}">
                        <option value="">Sélectionner le résultat</option>
                        <option value="victoire">Victoire ${match.homeTeam}</option>
                        <option value="nul">Match nul</option>
                        <option value="defaite">Victoire ${match.awayTeam}</option>
                    </select>
                    <button class="validate-btn" onclick="validateMatch('${match.id}')">
                        Valider et distribuer
                    </button>
                </div>
            ` : ''}
            
            ${isValidated ? `
                <div style="margin-top: 15px; padding: 10px; background: var(--input-bg); border-radius: 8px;">
                    <strong style="color: var(--text-primary);">Résultat:</strong> 
                    <span style="color: #28a745; font-weight: 600;">${getPredictionLabel(matchResult.result)}</span>
                    <br>
                    <small style="color: var(--text-secondary);">
                        Validé le ${new Date(matchResult.validatedAt).toLocaleString('fr-FR')}
                    </small>
                </div>
            ` : ''}
        `;

        matchesContainer.appendChild(card);
    });
}

function getPredictionLabel(prediction) {
    const labels = {
        'victoire': 'Victoire domicile',
        'nul': 'Match nul',
        'defaite': 'Victoire extérieur'
    };
    return labels[prediction] || prediction;
}

// ========================================
// VALIDATE MATCH AND DISTRIBUTE WINNINGS
// ========================================

window.validateMatch = function (matchId) {
    const resultSelect = document.getElementById(`result-${matchId}`);
    const result = resultSelect.value;

    if (!result) {
        alert('Veuillez sélectionner un résultat');
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir valider ce résultat ? Cette action est irréversible.')) {
        return;
    }

    const bets = getBets();
    const matchBets = bets[matchId] || [];
    const users = getUsers();

    // Process each bet
    matchBets.forEach(bet => {
        if (bet.prediction === result) {
            // Winner - calculate winnings
            const winnings = Math.round(bet.amount * bet.odds);
            bet.status = 'won';
            bet.winnings = winnings;

            // Add winnings to user's balance
            if (users[bet.userId]) {
                users[bet.userId].coins = (users[bet.userId].coins || 100) + winnings;
            }
        } else {
            // Loser
            bet.status = 'lost';
            bet.winnings = 0;
        }
    });

    // Save updated bets and users
    bets[matchId] = matchBets;
    setBets(bets);
    setUsers(users);

    // Save match result
    const results = getMatchResults();
    results[matchId] = {
        result: result,
        validatedBy: 'admin',
        validatedAt: new Date().toISOString(),
        processed: true
    };
    setMatchResults(results);

    // Reload data
    loadAdminData();

    alert('Résultat validé et gains distribués avec succès !');
};

// ========================================
// INITIALIZE
// ========================================

// Load data on page load
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    loadAdminData();
}
