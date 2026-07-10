/**
 * nav.js — Sticky navigation, hamburger menu, smooth scroll, active section.
 */

const LANG_GLOBE_SVG = `<svg class="navbar__lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" stroke-linecap="round"/></svg>`;

/** @returns {number} */
function getPageDirDepth() {
  let path = window.location.pathname.replace(/\\/g, '/');
  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'/index.html'.length);
  } else if (!path.endsWith('/') && /\.[a-z0-9]+$/i.test(path)) {
    path = path.replace(/\/[^/]+$/, '');
  }
  if (!path.endsWith('/')) path += '/';
  return path.split('/').filter(Boolean).length;
}

/**
 * @param {string} targetLang
 * @returns {string | null}
 */
function resolveAlternateLanguageUrl(targetLang) {
  const link = document.querySelector(`link[rel="alternate"][hreflang="${targetLang}"]`);
  if (!link) return null;

  const href = link.getAttribute('href');
  if (!href) return null;

  try {
    const url = new URL(href, window.location.origin);
    const suffix = `${url.search}${url.hash}`;
    const depth = getPageDirDepth();
    const targetPath = url.pathname.replace(/^\//, '');

    if (depth === 0) {
      return `${targetPath}${suffix}`;
    }

    return `${'../'.repeat(depth)}${targetPath}${suffix}`;
  } catch {
    return null;
  }
}

/** @returns {{ href: string, label: string, lang: string, ariaLabel: string, title: string }} */
function getLanguageSwitchMeta() {
  const isMs = document.documentElement.lang === 'ms'
    || /\/ms(?:\/|$)/.test(window.location.pathname.replace(/\\/g, '/'));
  const targetLang = isMs ? 'en' : 'ms';
  const depth = getPageDirDepth();
  const prefix = depth === 0 ? '' : '../'.repeat(depth);

  const href = resolveAlternateLanguageUrl(targetLang)
    ?? (isMs ? `${prefix || '../'}` : `${prefix}ms/`);

  const label = isMs ? 'BM' : 'EN';

  if (targetLang === 'ms') {
    return {
      href,
      label,
      lang: 'ms',
      ariaLabel: 'Switch to Bahasa Malaysia',
      title: isMs ? 'Bahasa semasa: Bahasa Malaysia' : 'Current language: English',
    };
  }

  return {
    href,
    label,
    lang: 'en',
    ariaLabel: isMs ? 'Tukar ke Bahasa Inggeris' : 'Switch to English',
    title: isMs ? 'Bahasa semasa: Bahasa Malaysia' : 'Current language: English',
  };
}

/**
 * Inject language toggle on inner pages that share the global navbar.
 * @param {HTMLElement} navbar
 */
function initNavbarLanguage(navbar) {
  const inner = navbar.querySelector('.navbar__inner');
  if (!inner || inner.querySelector('.navbar__lang')) return;

  const { href, label, lang, ariaLabel, title } = getLanguageSwitchMeta();
  const langLink = document.createElement('a');
  langLink.className = 'navbar__lang';
  langLink.href = href;
  langLink.setAttribute('hreflang', lang);
  langLink.setAttribute('lang', lang);
  langLink.setAttribute('aria-label', ariaLabel);
  langLink.title = title;
  langLink.innerHTML = `${LANG_GLOBE_SVG}<span class="navbar__lang-label" aria-hidden="true">${label}</span>`;

  let actions = inner.querySelector('.navbar__actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'navbar__actions';

    const cta = inner.querySelector('.navbar__cta');
    const hamburger = inner.querySelector('.hamburger');

    actions.appendChild(langLink);
    if (cta) actions.appendChild(cta);
    if (hamburger) actions.appendChild(hamburger);
    inner.appendChild(actions);
    return;
  }

  actions.insertBefore(langLink, actions.firstChild);
}

export function initNav() {

  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger-btn');
  const navOverlay = navbar?.querySelector('.navbar__nav');
  const navLinks   = navbar?.querySelectorAll('.navbar__link');
  const body       = document.body;

  if (!navbar) return;

  initNavbarLanguage(navbar);

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
  navbar.querySelector('.navbar__lang')?.addEventListener('click', () => closeMenu());

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
