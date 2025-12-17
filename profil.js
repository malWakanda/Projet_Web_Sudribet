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

    // Afficher le nom et l'email
    document.getElementById("profile-username").innerText = userData?.name || currentUser;
    document.getElementById("profile-email").innerText = currentUser; // ici l'email correspond à la clé

    // Déconnexion
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
});
