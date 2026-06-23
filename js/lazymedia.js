/**
 * lazymedia.js — Lazy loading and staggered entrance animations.
 *
 * Uses IntersectionObserver for:
 *   1. Lazy images   (<img data-src="…">)
 *   2. Hero video    (loads & plays when visible)
 *   3. Card entrance (staggered .lazy → .loaded per grid)
 *
 * Falls back to eager-load everything when IntersectionObserver
 * is unsupported (rare, but handles old browsers gracefully).
 */

export function initLazyMedia() {

  // ── Fallback for unsupported browsers ────────────────────────────────

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    document.querySelectorAll('.lazy').forEach(el => el.classList.add('loaded'));
    return;
  }

  // ── 1. Lazy images ────────────────────────────────────────────────────

  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = /** @type {HTMLImageElement} */ (entry.target);
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
      } else {
        img.classList.add('loaded');
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '300px 0px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));

  // ── 2. Hero video lazy-load ───────────────────────────────────────────

  const heroVideo = /** @type {HTMLVideoElement|null} */ (document.querySelector('.hero__video'));
  if (heroVideo && heroVideo.dataset.src) {
    const videoObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        heroVideo.src = heroVideo.dataset.src;
        heroVideo.load();
        obs.unobserve(heroVideo);
      });
    }, { rootMargin: '200px 0px', threshold: 0.1 });
    videoObserver.observe(heroVideo);
  }

  // ── 3. Staggered card entrance animations ────────────────────────────

  // Pre-select cards that carry the .lazy class (set on them in HTML)
  const cardSelector = '.service-card.lazy, .attorney-card.lazy, .media-card.lazy';
  const allCards = document.querySelectorAll(cardSelector);

  if (!allCards.length) return;

  // Group cards by their direct parent so stagger is per-grid
  const grids = new Map();
  allCards.forEach(card => {
    const parent = card.parentElement;
    if (!grids.has(parent)) grids.set(parent, []);
    grids.get(parent).push(card);
  });

  const cardObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = /** @type {HTMLElement} */ (entry.target);
      const delayMs = parseInt(el.dataset.delay ?? '0', 10);
      setTimeout(() => el.classList.add('loaded'), delayMs);
      obs.unobserve(el);
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08,
  });

  // Assign stagger delay per grid
  grids.forEach(cards => {
    cards.forEach((card, i) => {
      card.dataset.delay = String(i * 80);
      cardObserver.observe(card);
    });
  });
}

/** Observe dynamically injected .media-card.lazy elements (e.g. press grid). */
export function observeLazyCards(root) {
  if (!('IntersectionObserver' in window)) {
    root.querySelectorAll('.lazy').forEach(el => el.classList.add('loaded'));
    return;
  }

  const cards = root.querySelectorAll('.media-card.lazy:not(.loaded)');
  if (!cards.length) return;

  const cardObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = /** @type {HTMLElement} */ (entry.target);
      const delayMs = parseInt(el.dataset.delay ?? '0', 10);
      setTimeout(() => el.classList.add('loaded'), delayMs);
      obs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  cards.forEach(card => cardObserver.observe(card));
}
