(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealNodes = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, io) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((node) => observer.observe(node));
  }

  const slideButtons = [...document.querySelectorAll('[data-slide-target]')];
  const slides = [...document.querySelectorAll('[data-slide]')];

  const activateSlide = (name, focusButton = false) => {
    slides.forEach((slide) => {
      const active = slide.dataset.slide === name;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    slideButtons.forEach((button) => {
      const active = button.dataset.slideTarget === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      if (active && focusButton) button.focus();
    });
  };

  slideButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateSlide(button.dataset.slideTarget));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % slideButtons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + slideButtons.length) % slideButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = slideButtons.length - 1;
      activateSlide(slideButtons[next].dataset.slideTarget, true);
    });
  });

  const messageByContext = {
    header: 'Olá! Vi a Showcase da Domo e quero entender como uma demo gratuita funcionaria para o meu negócio.',
    hero: 'Olá! Vi a Showcase da Domo. Quero uma demo gratuita focada em um problema real do meu negócio.',
    final: 'Olá! Quero mostrar um processo do meu negócio para vocês avaliarem e, se fizer sentido, criarem uma demo gratuita.',
    'mobile-sticky': 'Olá! Vi a Showcase V2 da Domo e quero conversar sobre uma demo gratuita.',
    footer: 'Olá! Vim pela Showcase da Domo e quero conversar sobre meu negócio.'
  };

  document.querySelectorAll('[data-wa-context]').forEach((anchor) => {
    const context = anchor.dataset.waContext;
    const message = messageByContext[context] || messageByContext.hero;
    anchor.href = `https://wa.me/5522999686677?text=${encodeURIComponent(message)}`;
    anchor.rel = 'noopener';
  });
})();
