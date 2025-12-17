// Fonction pour créer un gradient text animé
function createGradientText({
  element,
  text,
  colors = ['#FF6B35', '#FF8C5A', '#FF6B35', '#FF8C5A', '#FF6B35'],
  animationSpeed = 8,
  showBorder = false
}) {
  if (!element) return;

  // Créer le conteneur
  const container = document.createElement('div');
  container.className = 'animated-gradient-text';
  
  // Créer le gradient style
  const gradientStyle = `linear-gradient(to right, ${colors.join(', ')})`;
  
  // Ajouter le border overlay si nécessaire
  if (showBorder) {
    const overlay = document.createElement('div');
    overlay.className = 'gradient-overlay';
    overlay.style.backgroundImage = gradientStyle;
    overlay.style.animationDuration = `${animationSpeed}s`;
    container.appendChild(overlay);
  }
  
  // Créer le contenu texte
  const textContent = document.createElement('div');
  textContent.className = 'text-content';
  textContent.style.backgroundImage = gradientStyle;
  textContent.style.animationDuration = `${animationSpeed}s`;
  textContent.textContent = text;
  
  container.appendChild(textContent);
  
  // Remplacer l'élément original
  element.parentNode.replaceChild(container, element);
  
  return container;
}

// Initialiser le gradient text pour le titre "Paris Sport ESME"
document.addEventListener('DOMContentLoaded', function() {
  const titleElement = document.querySelector('header h1');
  if (titleElement) {
    createGradientText({
      element: titleElement,
      text: titleElement.textContent,
      colors: ['#FF6B35', '#FFB84D', '#FF8C5A', '#FFD93D', '#FF6B35', '#FFB84D', '#FF8C5A'],
      animationSpeed: 5,
      showBorder: false
    });
  }
});

