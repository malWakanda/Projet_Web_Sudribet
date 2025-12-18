document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const noResultsMsg = document.getElementById('no-results');
    
    // On cible tout ce qui peut être cherché
    const searchableItems = document.querySelectorAll('.match-card, .tournament-item, .match-row');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        // 1. Récupérer le texte tapé (minuscule + sans accents)
        const rawText = e.target.value;
        const searchText = normalizeText(rawText);

        // 2. SI LA RECHERCHE EST VIDE : On rétablit le filtre par sport
        if (searchText === '') {
            resetFilters();
            if (noResultsMsg) noResultsMsg.style.display = 'none';
            return; // On arrête là, pas besoin de chercher
        }

        // 3. SI ON CHERCHE QUELQUE CHOSE
        let hasResults = false;

        searchableItems.forEach(item => {
            const itemText = normalizeText(item.innerText);
            
            // On cherche dans le texte de l'élément OU dans son attribut data-sport
            const itemSport = item.getAttribute('data-sport') || '';
            
            if (itemText.includes(searchText) || itemSport.includes(searchText)) {
                item.style.display = ""; // On affiche
                
                // On vérifie si c'est visible pour le compteur de résultats
                // (offsetParent est null si un parent est caché, ex: onglet inactif)
                if(item.offsetParent !== null) {
                    hasResults = true;
                }
            } else {
                item.style.display = "none"; // On cache
            }
        });

        // 4. Gestion du message "Aucun résultat"
        if (noResultsMsg) {
            noResultsMsg.style.display = hasResults ? 'none' : 'block';
        }
    });

    // --- FONCTIONS UTILITAIRES ---

    // Fonction qui remet l'affichage correct quand on efface la recherche
    function resetFilters() {
        // 1. Quel est le sport actif (bouton orange) ?
        const activeBtn = document.querySelector('.sport-btn.active');
        const activeSport = activeBtn ? activeBtn.getAttribute('data-sport') : 'all';

        searchableItems.forEach(item => {
            // Si c'est une carte de match, on respecte le bouton de sport actif
            if (item.classList.contains('match-card')) {
                const itemSport = item.getAttribute('data-sport');
                
                // Si on est sur "Tous" ou si le sport correspond, on affiche
                if (activeSport === 'all' || !activeSport || itemSport === activeSport) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            } 
            // Si c'est un tournoi ou un calendrier, on réaffiche tout par défaut
            else {
                item.style.display = "";
            }
        });
    }

    // Enlève les accents et met en minuscule (Hélène -> helene)
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
});