document.addEventListener('DOMContentLoaded', () => {
  // Add reveal animations to the major content blocks.
  const revealTargets = document.querySelectorAll(
    'section h2, section > div > div, .glass-card, .border-l > div, footer'
  );

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px' }
  );

  revealTargets.forEach(element => observer.observe(element));

  // Smooth internal navigation with focus moved to the destination.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const selector = link.getAttribute('href');
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target.focus({ preventScroll: true }), 500);
    });
  });

  // Gentle portrait movement on desktop.
  const portrait = document.querySelector('img[alt*="Jotham"]');
  if (portrait && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', event => {
      if (window.innerWidth < 768) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      portrait.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    window.addEventListener('pointerleave', () => {
      portrait.style.transform = 'translate3d(0,0,0)';
    });
  }

  // Back-to-top control.
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keep the copyright year current.
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
  }
});

// Mouse-follow glow for interactive cards.
document.addEventListener('pointermove', event => {
  const card = event.target.closest('.glass-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
  card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
});
