/**
 * nav.js — Sticky navigation, hamburger menu, smooth scroll, active section.
 */

export function initNav() {

  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger-btn');
  const navOverlay = navbar?.querySelector('.navbar__nav');
  const navLinks   = navbar?.querySelectorAll('.navbar__link');
  const body       = document.body;

  if (!navbar) return;

  // ── Scroll state: add .scrolled class when past threshold ──────────────
  // Homepage (and MS homepage) have a dark hero: transparent nav at top.
  // Inner pages have no hero: keep solid nav so links stay visible on load.

  const hasHero = !!document.querySelector('.hero');
  const SCROLL_THRESHOLD = 50;
  let ticking = false;

  function updateScrollState() {
    navbar.classList.toggle(
      'scrolled',
      hasHero ? window.scrollY > SCROLL_THRESHOLD : true
    );
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load (handles page refresh mid-scroll)
  updateScrollState();

  // ── Hamburger / mobile menu ─────────────────────────────────────────────

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    body.classList.add('nav-open');
    // Move focus to first link for keyboard users
    navOverlay?.querySelector('a, button')?.focus();
    document.addEventListener('keydown', handleMenuKeydown);
    // Delay so the click that opened the menu doesn't immediately close it
    setTimeout(() => document.addEventListener('click', handleOutsideClick, true), 50);
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    body.classList.remove('nav-open');
    document.removeEventListener('keydown', handleMenuKeydown);
    document.removeEventListener('click', handleOutsideClick, true);
  }

  function handleMenuKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      hamburger.focus();
    }
  }

  function handleOutsideClick(e) {
    if (navbar && !navbar.contains(e.target)) closeMenu();
  }

  hamburger?.addEventListener('click', () => {
    hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  // Close on any nav link click (mobile UX)
  navLinks?.forEach(link => link.addEventListener('click', () => closeMenu()));

  // ── Smooth scroll with sticky-nav offset ───────────────────────────────
  // Polyfills browser's native smooth scroll for anchor links,
  // accounting for the fixed navbar height.

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const raw  = anchor.getAttribute('href');
      if (!raw || raw === '#') return;

      // Strip any query string that may appear after the hash
      const hash   = raw.split('?')[0];
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const navH    = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      ) || 72;
      const top     = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', hash);
    });
  });

  // ── Active section highlight via IntersectionObserver ──────────────────

  const sections = document.querySelectorAll('main > section[id]');
  if (!sections.length || !navLinks?.length) return;

  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
  ) || 72;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, {
    rootMargin: `-${navH + 20}px 0px -55% 0px`,
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}
