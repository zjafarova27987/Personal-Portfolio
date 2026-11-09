(function () {
  function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const target = link.getAttribute('href');
        if (!target || !target.startsWith('#')) {
          return;
        }

        const id = target.slice(1);
        setActiveLink(id);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        setActiveLink(visibleEntry.target.id);
      },
      {
        threshold: [0.35, 0.6, 0.9],
        rootMargin: '-10% 0px -35% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.initializeNavigation = initializeNavigation;
})();
