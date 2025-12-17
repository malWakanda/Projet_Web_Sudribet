// Fonction pour créer la navigation PillNav
function createPillNav({
  container,
  logo,
  logoAlt = 'Logo',
  items = [],
  activeHref = '',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor = null,
  initialLoadAnimation = true
}) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  let isMobileMenuOpen = false;
  const circleRefs = [];
  const activeAnimations = [];
  let logoImgRef = null;
  let hamburgerRef = null;
  let mobileMenuRef = null;
  let navItemsRef = null;
  let logoRef = null;

  // Fonction pour vérifier si c'est un lien externe
  const isExternalLink = (href) =>
    href && (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    );

  // Fonction pour calculer la position du cercle
  const layout = () => {
    circleRefs.forEach((circle, i) => {
      if (!circle?.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;
      circle.style.left = '50%';
      circle.style.transform = 'translateX(-50%) scale(0)';
      circle.style.transformOrigin = `50% ${originY}px`;

      const label = pill.querySelector('.pill-label');
      const white = pill.querySelector('.pill-label-hover');

      if (label) {
        label.style.transform = 'translateY(0)';
      }
      if (white) {
        white.style.transform = `translateY(${h + 12}px)`;
        white.style.opacity = '0';
      }
    });
  };

  // Fonction pour gérer le hover
  const handleEnter = (i) => {
    const circle = circleRefs[i];
    const pill = circle?.parentElement;
    if (!pill) return;

    const label = pill.querySelector('.pill-label');
    const white = pill.querySelector('.pill-label-hover');
    const h = pill.getBoundingClientRect().height;

    // Animer le cercle
    circle.style.transition = 'transform 0.3s ease';
    circle.style.transform = 'translateX(-50%) scale(1.2)';

    // Animer les labels
    if (label) {
      label.style.transition = 'transform 0.3s ease';
      label.style.transform = `translateY(-${h + 8}px)`;
    }
    if (white) {
      white.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      white.style.transform = 'translateY(0)';
      white.style.opacity = '1';
    }
  };

  const handleLeave = (i) => {
    const circle = circleRefs[i];
    const pill = circle?.parentElement;
    if (!pill) return;

    const label = pill.querySelector('.pill-label');
    const white = pill.querySelector('.pill-label-hover');

    // Réinitialiser le cercle
    circle.style.transition = 'transform 0.2s ease';
    circle.style.transform = 'translateX(-50%) scale(0)';

    // Réinitialiser les labels
    if (label) {
      label.style.transition = 'transform 0.2s ease';
      label.style.transform = 'translateY(0)';
    }
    if (white) {
      white.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      white.style.transform = `translateY(${pill.getBoundingClientRect().height + 12}px)`;
      white.style.opacity = '0';
    }
  };

  // Fonction pour gérer le hover du logo
  const handleLogoEnter = () => {
    const img = logoImgRef;
    if (!img) return;
    img.style.transition = 'transform 0.2s ease';
    img.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      img.style.transform = 'rotate(0deg)';
    }, 200);
  };

  // Fonction pour toggle le menu mobile
  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;

    const hamburger = hamburgerRef;
    const menu = mobileMenuRef;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (isMobileMenuOpen) {
        lines[0].style.transform = 'rotate(45deg) translateY(3px)';
        lines[1].style.transform = 'rotate(-45deg) translateY(-3px)';
      } else {
        lines[0].style.transform = 'rotate(0deg) translateY(0)';
        lines[1].style.transform = 'rotate(0deg) translateY(0)';
      }
    }

    if (menu) {
      if (isMobileMenuOpen) {
        menu.style.visibility = 'visible';
        menu.classList.add('visible');
      } else {
        menu.classList.remove('visible');
        setTimeout(() => {
          menu.style.visibility = 'hidden';
        }, 300);
      }
    }
  };

  // Créer le HTML de la navigation
  const nav = document.createElement('nav');
  nav.className = 'pill-nav';
  nav.setAttribute('aria-label', 'Primary');
  nav.style.setProperty('--base', baseColor);
  nav.style.setProperty('--pill-bg', pillColor);
  nav.style.setProperty('--hover-text', hoveredPillTextColor);
  nav.style.setProperty('--pill-text', resolvedPillTextColor);

  // Créer le logo si fourni
  if (logo) {
    const logoLink = document.createElement('a');
    logoLink.className = 'pill-logo';
    logoLink.href = items[0]?.href || '#';
    logoLink.setAttribute('aria-label', 'Home');
    logoLink.addEventListener('mouseenter', handleLogoEnter);
    logoRef = logoLink;

    const logoImg = document.createElement('img');
    logoImg.src = logo;
    logoImg.alt = logoAlt;
    logoImgRef = logoImg;
    logoLink.appendChild(logoImg);
    nav.appendChild(logoLink);
  }

  // Créer les items de navigation desktop
  const navItems = document.createElement('div');
  navItems.className = 'pill-nav-items desktop-only';
  navItemsRef = navItems;

  const pillList = document.createElement('ul');
  pillList.className = 'pill-list';
  pillList.setAttribute('role', 'menubar');

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');

    const link = document.createElement('a');
    link.setAttribute('role', 'menuitem');
    link.href = item.href || '#';
    link.className = `pill${activeHref === item.href ? ' is-active' : ''}`;
    link.setAttribute('aria-label', item.ariaLabel || item.label);
    link.addEventListener('mouseenter', () => handleEnter(i));
    link.addEventListener('mouseleave', () => handleLeave(i));

    const hoverCircle = document.createElement('span');
    hoverCircle.className = 'hover-circle';
    hoverCircle.setAttribute('aria-hidden', 'true');
    circleRefs[i] = hoverCircle;

    const labelStack = document.createElement('span');
    labelStack.className = 'label-stack';

    const pillLabel = document.createElement('span');
    pillLabel.className = 'pill-label';
    pillLabel.textContent = item.label;

    const pillLabelHover = document.createElement('span');
    pillLabelHover.className = 'pill-label-hover';
    pillLabelHover.setAttribute('aria-hidden', 'true');
    pillLabelHover.textContent = item.label;

    labelStack.appendChild(pillLabel);
    labelStack.appendChild(pillLabelHover);
    link.appendChild(hoverCircle);
    link.appendChild(labelStack);
    li.appendChild(link);
    pillList.appendChild(li);
  });

  navItems.appendChild(pillList);
  nav.appendChild(navItems);

  // Créer le bouton menu mobile
  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.className = 'mobile-menu-button mobile-only';
  mobileMenuButton.setAttribute('aria-label', 'Toggle menu');
  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  hamburgerRef = mobileMenuButton;

  const line1 = document.createElement('span');
  line1.className = 'hamburger-line';
  const line2 = document.createElement('span');
  line2.className = 'hamburger-line';

  mobileMenuButton.appendChild(line1);
  mobileMenuButton.appendChild(line2);
  nav.appendChild(mobileMenuButton);

  // Créer le menu mobile popover
  const mobileMenuPopover = document.createElement('div');
  mobileMenuPopover.className = 'mobile-menu-popover mobile-only';
  mobileMenuPopover.style.setProperty('--base', baseColor);
  mobileMenuPopover.style.setProperty('--pill-bg', pillColor);
  mobileMenuPopover.style.setProperty('--hover-text', hoveredPillTextColor);
  mobileMenuPopover.style.setProperty('--pill-text', resolvedPillTextColor);
  mobileMenuRef = mobileMenuPopover;

  const mobileMenuList = document.createElement('ul');
  mobileMenuList.className = 'mobile-menu-list';

  items.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href || '#';
    link.className = `mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`;
    link.textContent = item.label;
    link.addEventListener('click', () => {
      toggleMobileMenu();
    });
    li.appendChild(link);
    mobileMenuList.appendChild(li);
  });

  mobileMenuPopover.appendChild(mobileMenuList);

  // Créer le conteneur
  const navContainer = document.createElement('div');
  navContainer.className = 'pill-nav-container';
  navContainer.appendChild(nav);
  navContainer.appendChild(mobileMenuPopover);

  // Ajouter au conteneur parent
  container.appendChild(navContainer);

  // Initialiser le layout
  setTimeout(() => {
    layout();
    window.addEventListener('resize', layout);
  }, 100);

  // Animation initiale
  if (initialLoadAnimation) {
    if (logoRef) {
      logoRef.style.transform = 'scale(0)';
      logoRef.style.transition = 'transform 0.6s ease';
      setTimeout(() => {
        logoRef.style.transform = 'scale(1)';
      }, 50);
    }

    if (navItemsRef) {
      navItemsRef.style.width = '0';
      navItemsRef.style.overflow = 'hidden';
      navItemsRef.style.transition = 'width 0.6s ease';
      setTimeout(() => {
        navItemsRef.style.width = 'auto';
      }, 50);
    }
  }

  return navContainer;
}

// Initialiser la navigation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('.bottom-nav'); // Le script cherche ta div ici
  if (footer) {
    // Créer la navigation avec les items par défaut
    const navContainer = document.createElement('div');
    navContainer.id = 'pill-nav-container';
    
    createPillNav({
      container: navContainer,
      items: [
        { href: 'index.html', label: 'Accueil', ariaLabel: 'Accueil' },
        { href: 'tournois.html', label: 'Tournois', ariaLabel: 'Tournois' },
        { href: 'matchs.html', label: 'Matchs', ariaLabel: 'Matchs' },
        { href: 'classements.html', label: 'Classements', ariaLabel: 'Classements' },
        { href: 'profil.html', label: 'Profil', ariaLabel: 'Profil' }
      ],
      // Cette ligne permet de surligner le bouton de la page actuelle
      activeHref: window.location.pathname.split('/').pop() || 'index.html',
      baseColor: '#FF6B35',
      pillColor: '#fff',
      hoveredPillTextColor: '#FF6B35',
      pillTextColor: '#060010',
      initialLoadAnimation: true
    });

    // Remplacer le footer par la barre de navigation
    footer.parentNode.replaceChild(navContainer, footer);
  }
});

