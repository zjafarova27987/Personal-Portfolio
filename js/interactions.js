(function () {
  function initializeInteractions() {
    const mapPanels = document.querySelectorAll('.map-placeholder');
    const interactiveCards = document.querySelectorAll('.info-card, .project-card, .skill-badge');

    mapPanels.forEach((mapPanel) => {
      mapPanel.addEventListener('pointermove', (event) => {
        const bounds = mapPanel.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width;
        const offsetY = (event.clientY - bounds.top) / bounds.height;

        const rotateX = (0.5 - offsetY) * 10;
        const rotateY = (offsetX - 0.5) * 12;

        mapPanel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      mapPanel.addEventListener('pointerleave', () => {
        mapPanel.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });

    interactiveCards.forEach((card, index) => {
      card.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
      card.style.animationDelay = `${index * 80}ms`;

      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        const rotateX = (0.5 - y) * 6;
        const rotateY = (x - 0.5) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  window.initializeInteractions = initializeInteractions;
})();
