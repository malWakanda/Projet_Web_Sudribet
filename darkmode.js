// ========================================
// DARK MODE GLOBAL SCRIPT
// ========================================
// Ce script gère le mode sombre pour toutes les pages de l'application

(function () {
    'use strict';

    // Appliquer le mode sombre au chargement de la page
    function applyDarkMode() {
        const darkModeEnabled = localStorage.getItem("darkMode") === "true";

        if (darkModeEnabled) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
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

    // Appliquer immédiatement au chargement (avant DOMContentLoaded pour éviter le flash)
    applyDarkMode();

    // Exposer les fonctions globalement
    window.darkMode = {
        apply: applyDarkMode,
        toggle: toggleDarkMode,
        isEnabled: () => localStorage.getItem("darkMode") === "true"
    };

    // Écouter les changements de localStorage depuis d'autres onglets
    window.addEventListener('storage', function (e) {
        if (e.key === 'darkMode') {
            applyDarkMode();
        }
    });

})();
