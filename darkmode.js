// ========================================
// DARK MODE GLOBAL SCRIPT
// ========================================
// Ce script gère le mode sombre pour toutes les pages de l'application

(function () {
    'use strict';

    // Appliquer le mode sombre au chargement de la page
    function applyDarkMode() {
        const darkModeEnabled = localStorage.getItem("darkMode") === "true";

        // Vérifier que document.body existe avant de manipuler les classes
        if (document.body) {
            if (darkModeEnabled) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        }

        return darkModeEnabled;
    }

    // Basculer le mode sombre
    function toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "false");
        }
    }

    // Exposer les fonctions globalement immédiatement
    // (même si le DOM n'est pas encore prêt)
    window.darkMode = {
        apply: applyDarkMode,
        toggle: toggleDarkMode,
        isEnabled: () => localStorage.getItem("darkMode") === "true"
    };

    // Appliquer le mode sombre dès que possible
    if (document.readyState === 'loading') {
        // Le DOM n'est pas encore chargé, attendre DOMContentLoaded
        document.addEventListener('DOMContentLoaded', applyDarkMode);
    } else {
        // Le DOM est déjà chargé (script defer ou chargé après le DOM)
        applyDarkMode();
    }

    // Écouter les changements de localStorage depuis d'autres onglets
    window.addEventListener('storage', function (e) {
        if (e.key === 'darkMode') {
            applyDarkMode();
        }
    });

})();
