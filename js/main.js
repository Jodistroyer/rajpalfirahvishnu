/**
 * main.js — App entry point and module orchestrator.
 *
 * Initialises all modules in the correct order after DOM is ready.
 * Handles global concerns: JS class, scrollbar width, reduced-motion.
 */

import { initNav }       from './nav.js';
import { initModals }    from './modal.js';
import { initLazyMedia } from './lazymedia.js';
import { initClippingsSeo } from './clippings-seo.js';
import { initPressSeo } from './press-seo.js';
import { prefetchClippingsData, prefetchClippingsGallery, loadClippingsGallery } from './clippings-data-loader.js';
import { initCopy } from './copy.js';
import { initPress } from './press.js';
import { initProfilePhotos } from './profile-photo.js';
import { CONSULTATION_FORM_URL } from './site-config.js';

(function bootstrap() {

  // Mark JavaScript as available for CSS progressive enhancement
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Compute scrollbar width once — used by scroll-lock to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

  // Disable hero video autoplay if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const video = document.querySelector('.hero__video');
    if (video) {
      video.pause();
      video.removeAttribute('autoplay');
    }
  }

  initHeroVideoFallback();

  // Wire consultation CTAs before nav attaches smooth-scroll to # anchors
  initConsultationLinks();

  // ── Initialise modules ──
  initNav();
  initModals();
  initCopy();
  initProfilePhotos();

  initLazyMedia();
  initPress(document.getElementById('press-grid'));
  initPressSeo();
  initClippingsSeo();
  setupClippingsLazyLoad();
  scheduleClippingsPrefetch();

  // ── Service card image fallbacks ──
  document.querySelectorAll('.service-card__image').forEach(img => {
    const card = img.closest('.service-card');
    if (!card) return;

    const useFallback = () => card.classList.add('service-card--fallback');

    img.addEventListener('error', useFallback, { once: true });

    if (img.complete && img.naturalWidth === 0) {
      useFallback();
    }
  });

  // ── Make whole service cards clickable to their FAQ ──
  initServiceCardLinks();

  // ── Handle ?from= query param on profile pages ──
  const params = new URLSearchParams(window.location.search);
  initProfileBack(params);

})();

/**
 * Make each service card clickable to its FAQ page.
 *
 * The card's primary FAQ link already lives inside it, so we reuse that href
 * for the whole-card click target. Native clicks on inner links/buttons keep
 * working (e.g. the "Led by …" profile link on featured cards).
 */
function initServiceCardLinks() {
  document.querySelectorAll('.service-card').forEach(card => {
    const faqLink = Array.from(card.querySelectorAll('a[href]')).find(a =>
      /\/faq\//.test(a.href)
    );
    if (!faqLink) return;

    const href = faqLink.href;
    card.classList.add('service-card--clickable');

    card.addEventListener('click', event => {
      // Let genuine clicks on links/buttons behave normally
      if (event.target.closest('a, button')) return;
      // Respect modifier keys / middle-click for new-tab behaviour
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      window.location.href = href;
    });

    card.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
        event.preventDefault();
        window.location.href = href;
      }
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
  });
}

/** Show static hero image when the background video cannot load. */
function initHeroVideoFallback() {
  const hero = document.querySelector('.hero');
  const video = /** @type {HTMLVideoElement|null} */ (document.querySelector('.hero__video'));
  if (!hero || !video) return;

  const showFallback = () => {
    hero.classList.add('hero--video-fallback');
    video.pause();
  };

  video.addEventListener('error', showFallback, { once: true });
  video.querySelectorAll('source').forEach(source => {
    source.addEventListener('error', showFallback, { once: true });
  });

  if (video.error) {
    showFallback();
  }
}

/** Wire consultation form links from site-config (single place to update the Google Form URL). */
function initConsultationLinks() {
  const consultationLabels = new Set(['book a consultation', 'tempah perundingan']);

  const wire = (link) => {
    link.setAttribute('href', CONSULTATION_FORM_URL);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  };

  document.querySelectorAll('a[href]').forEach(link => {
    if (link.hasAttribute('data-consultation-form')) {
      wire(link);
      return;
    }

    if (!link.classList.contains('btn')) return;

    const href = link.getAttribute('href') || '';
    if (!/#(?:contact|hubungi)$/.test(href.split('?')[0])) return;

    const label = (link.getAttribute('aria-label') || link.textContent)
      .replace(/↗/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    if (consultationLabels.has(label)) {
      wire(link);
    }
  });
}

/** Profile pages opened from How We Help or FAQ → back link returns to the referring section. */
function initProfileBack(params) {
  const from = params.get('from');
  if (!from) return;

  const isMs = /\/ms\//.test(window.location.pathname);

  const destinations = {
    services: {
      href: isMs ? '../../../ms/#perkhidmatan' : '../../#services',
      label: isMs ? '← Kembali ke Perkhidmatan Guaman Kami' : '← Back to How We Help',
    },
    'criminal-law': {
      href: isMs ? '../../../faq/criminal-law/' : '../../faq/criminal-law/',
      label: isMs ? '← Kembali ke Soalan Lazim Undang-Undang Jenayah' : '← Back to Criminal Law FAQ',
    },
    'civil-litigation': {
      href: isMs ? '../../../faq/civil-litigation/' : '../../faq/civil-litigation/',
      label: isMs ? '← Kembali ke Soalan Lazim Litigasi Sivil' : '← Back to Civil Litigation FAQ',
    },
  };

  const dest = destinations[from];
  if (!dest) return;

  document.querySelectorAll('.profile-page__back').forEach(link => {
    link.href = dest.href;
    link.textContent = dest.label;
  });

  document.querySelectorAll('.footer__legal-link[href*="#people"], .footer__legal-link[href*="#pasukan"]').forEach(link => {
    link.href = dest.href;
    link.textContent = dest.label;
  });
}

/** Prefetch clippings code during idle time so scroll-init feels instant. */
function scheduleClippingsPrefetch() {
  const container = document.getElementById('clippings-gallery') || document.getElementById('clippings');
  if (!container) return;

  const prefetch = () => {
    prefetchClippingsData();
    prefetchClippingsGallery();
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 2500 });
  } else {
    setTimeout(prefetch, 1200);
  }
}

/** Load clippings gallery when user scrolls near the Media section. */
function setupClippingsLazyLoad() {
  const container = document.getElementById('clippings-gallery') || document.getElementById('clippings');
  if (!container) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    container.classList.add('clippings-gallery--loading');
    loadClippingsGallery()
      .then(m => m.initClippings(container))
      .catch(() => container.classList.remove('clippings-gallery--loading'));
  };

  if (!('IntersectionObserver' in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    if (!entries[0]?.isIntersecting) return;
    obs.disconnect();
    if ('requestAnimationFrame' in window) {
      requestAnimationFrame(start);
    } else {
      start();
    }
  }, { rootMargin: '80px 0px', threshold: 0 });

  observer.observe(container);
}
