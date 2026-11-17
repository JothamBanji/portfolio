const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');

  // ---- Scroll reveal ----------------------------------------------------
  // Each group of siblings animates in one after another (stagger).
  const revealGroups = [
    { selector: '.section-kicker, section h2, .section-intro, .mini-heading', type: 'up' },
    { selector: '.project-card', type: 'rise' },
    { selector: '.timeline > div', type: 'left' },
    { selector: '.skill-group', type: 'rise' },
    { selector: '.lang-list li', type: 'right' },
    { selector: '#about .text-lg, .more-link, .chip-legend', type: 'up' },
    { selector: '#contact p, #contact .cta-actions, #contact .social-links', type: 'up' }
  ];

  const revealTargets = [];
  revealGroups.forEach(({ selector, type }) => {
    document.querySelectorAll(selector).forEach(element => {
      if (element.closest('section') === document.querySelector('main > section:first-child')) return;
      if (element.dataset.reveal !== undefined) return;
      const siblings = [...element.parentElement.children].filter(child => child.matches(selector));
      const order = Math.max(0, siblings.indexOf(element));
      element.dataset.reveal = type;
      element.style.setProperty('--reveal-delay', `${Math.min(order, 5) * 110}ms`);
      revealTargets.push(element);
    });
  });

  // Skill chips pop in one by one once their card is visible.
  document.querySelectorAll('.chip-list').forEach(list => {
    [...list.children].forEach((chip, index) => chip.style.setProperty('--chip-i', index));
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        element.classList.add('visible');
        // Drop the stagger delay afterwards so hover effects respond instantly.
        window.setTimeout(() => element.classList.add('revealed'), 1400);
        observer.unobserve(element);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px' });
    revealTargets.forEach(element => observer.observe(element));
  }

  // ---- Hero counters ------------------------------------------------------
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    if (prefersReducedMotion) { counter.textContent = `${target}${suffix}`; return; }
    const duration = 1600;
    const start = performance.now() + 700; // wait for the hero entrance
    counter.textContent = `0${suffix}`;
    const tick = now => {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // ---- Scroll-linked effects ------------------------------------------------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  const siteNav = document.querySelector('.site-nav');
  const timeline = document.querySelector('.timeline');
  const heroGlow = document.querySelector('main > section:first-child .blur-3xl');

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  let ticking = false;
  const onScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;
    if (siteNav) siteNav.classList.toggle('scrolled', scrollY > 24);
    backToTop.classList.toggle('show', scrollY > 600);

    // The timeline line "draws" itself as you scroll through it.
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const visible = (window.innerHeight * 0.75 - rect.top) / rect.height;
      timeline.style.setProperty('--line-progress', Math.min(Math.max(visible, 0), 1).toFixed(3));
    }

    // Hero glow drifts a little slower than the page.
    if (heroGlow && !prefersReducedMotion && scrollY < window.innerHeight) {
      heroGlow.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ---- Highlight the current section in the menu ----------------------------
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  // ---- Smooth in-page navigation, moving focus to the destination ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target.focus({ preventScroll: true }), 500);
    });
  });

  // ---- Gentle portrait movement on desktop ----------------------------------
  const portrait = document.querySelector('img[alt*="Jotham"]');
  if (portrait && !prefersReducedMotion) {
    window.addEventListener('pointermove', event => {
      if (window.innerWidth < 768) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      portrait.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    document.addEventListener('pointerleave', () => {
      portrait.style.transform = 'translate3d(0,0,0)';
    });
  }

  // Keep the copyright year current.
  const year = document.querySelector('footer .footer-inner span');
  if (year) year.textContent = year.textContent.replace(/\d{4}/, new Date().getFullYear());
});

// Mouse-follow glow for interactive cards.
document.addEventListener('pointermove', event => {
  const card = event.target.closest && event.target.closest('.glass-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
  card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
});
