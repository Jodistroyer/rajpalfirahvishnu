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
import { prefetchClippingsData, prefetchClippingsGallery, loadClippingsGallery, loadClippingsData } from './clippings-data-loader.js';
import { initCopy } from './copy.js';
import { initPress } from './press.js';
import { initProfilePhotos } from './profile-photo.js';
import { initProfilePeopleNav } from './profile-people-nav.js';
import { initProfilePress } from './profile-press.js';
import {
  getWhatsAppUrl,
  isMsSubpage,
  stripSearchParams,
  whatsappCtaAriaLabel,
  whatsappCtaInnerHtml,
} from './site-config.js';

(function bootstrap() {

  if (window.location.protocol === 'http:' && window.location.hostname === 'rfvlegal.com') {
    window.location.replace(`https://rfvlegal.com${window.location.pathname}${window.location.search}${window.location.hash}`);
    return;
  }

  // Mark JavaScript as available for CSS progressive enhancement
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Compute scrollbar width once — used by scroll-lock to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

  // Wire consultation CTAs before nav attaches smooth-scroll to # anchors
  initConsultationLinks();

  // ── Initialise modules ──
  initNav();
  initModals();
  initCopy();
  initProfilePhotos();
  initProfilePeopleNav();
  initProfilePress();

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

  // ── Profile back-link context (sessionStorage / legacy ?from=) ──
  initFromLinkCapture();
  initProfileBack();
  initMediaPageBack();

})();

/**
 * Capture data-from on internal links into sessionStorage so profile/insight
 * pages can show a contextual back link without polluting crawlable URLs
 * with ?from= query params (Search Console flagged those as HTTPS issues).
 */
function initFromLinkCapture() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-from], a[data-counsel]');
    if (!link) return;
    try {
      const from = link.getAttribute('data-from');
      if (from) sessionStorage.setItem('rfv-from', from);
      const counsel = link.getAttribute('data-counsel');
      if (counsel) sessionStorage.setItem('rfv-counsel', counsel);
    } catch {
      /* private mode / blocked storage */
    }
  });
}

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

/** Wire consultation CTAs to WhatsApp (single place to update the number). */
function initConsultationLinks() {
  const ms = isMsSubpage();
  const url = getWhatsAppUrl(ms);
  const aria = whatsappCtaAriaLabel(ms);
  const inner = whatsappCtaInnerHtml({ ms });

  const isConsultationCta = (link) => {
    if (link.hasAttribute('data-consultation-form')) return true;
    if (link.classList.contains('navbar__link')) return false;
    if (link.classList.contains('footer__nav-link')) return false;

    const href = link.getAttribute('href') || '';
    if (/#(?:contact|hubungi)$/.test(href.split('?')[0])) return true;
    if (href.includes('forms.gle') || href.includes('docs.google.com/forms')) return true;
    return href.includes('wa.me/60122615635') && link.classList.contains('btn');
  };

  const wire = (link) => {
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    if (!link.classList.contains('btn') && !link.hasAttribute('data-consultation-form')) return;

    link.classList.add('btn--whatsapp');
    link.setAttribute('aria-label', aria);
    link.innerHTML = inner;
  };

  document.querySelectorAll('a[href]').forEach(link => {
    if (isConsultationCta(link)) wire(link);
  });

  const subCopy = ms ? 'WhatsApp kami · Tiada obligasi' : 'WhatsApp us · No obligation';
  document.querySelectorAll('.faq-page__cta-sub, .footer__cta-sub').forEach(el => {
    if (/book a consultation|tempah perundingan|tempah konsultasi/i.test(el.textContent || '')) {
      el.textContent = subCopy;
    }
  });
}

/** Profile pages opened from How We Can Help or FAQ → back link returns to the referring section. */
function initProfileBack() {
  const params = new URLSearchParams(window.location.search);
  let from = params.get('from');
  if (!from) {
    try {
      from = sessionStorage.getItem('rfv-from');
      if (from) sessionStorage.removeItem('rfv-from');
    } catch {
      from = null;
    }
  }
  stripSearchParams(['from']);
  if (!from) return;

  const isMs = /\/ms\//.test(window.location.pathname);

  const destinations = {
    services: {
      href: isMs ? '../../../ms/#perkhidmatan' : '../../#services',
      label: isMs ? '← Kembali ke Bagaimana Kami Boleh Membantu' : '← Back to How We Can Help',
    },
    'criminal-law': {
      href: isMs ? '../../../ms/faq/criminal-law/' : '../../faq/criminal-law/',
      label: isMs ? '← Kembali ke Soalan Lazim Undang-Undang Jenayah' : '← Back to Criminal Law FAQ',
    },
    'civil-litigation': {
      href: isMs ? '../../../ms/faq/civil-litigation/' : '../../faq/civil-litigation/',
      label: isMs ? '← Kembali ke Soalan Lazim Litigasi Sivil' : '← Back to Civil Litigation FAQ',
    },
    insights: {
      href: isMs ? '../../../ms/#firm-insights' : '../../#firm-insights',
      label: isMs ? '← Kembali ke Wawasan Firma' : '← Back to Firm Insights',
    },
    'insights-media': {
      href: isMs ? '../../../ms/media/#firm-insights' : '../../media/#firm-insights',
      label: isMs ? '← Kembali ke Wawasan Firma' : '← Back to Firm Insights',
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

/** Full media page — back link returns to the matching homepage Media Room section. */
function initMediaPageBack() {
  const back = document.getElementById('media-page-back');
  if (!back) return;

  const isMsMedia = /\/ms\/media/.test(window.location.pathname);

  /** @type {Record<string, string>} */
  const hashTargets = isMsMedia
    ? {
      press: '../../ms/#press',
      clippings: '../../ms/#clippings-library',
    }
    : {
      press: '../#press',
      clippings: '../#clippings-library',
    };

  function syncBackHref() {
    const hash = window.location.hash.slice(1);
    back.href = hashTargets[hash] || (isMsMedia ? '../../ms/#media' : '../#media');
  }

  syncBackHref();
  window.addEventListener('hashchange', syncBackHref);
}

/** Prefetch clippings code during idle time so scroll-init feels instant. */
function scheduleClippingsPrefetch() {
  const container = document.getElementById('clippings-gallery') || document.getElementById('clippings');
  if (!container) return;

  const prefetch = () => {
    prefetchClippingsData();
    prefetchClippingsGallery();

    const previewGallery = document.getElementById('clippings-gallery');
    if (previewGallery?.dataset.clippingsMode === 'preview') {
      Promise.all([loadClippingsData(), loadClippingsGallery()]).then(([{ CLIPPINGS }, gallery]) => {
        gallery.reservePreviewGalleryHeight(previewGallery, CLIPPINGS);
      });
    }

    if (document.getElementById('clippings-view-all-cta')) {
      loadClippingsData().then(data => {
        const total = data.CLIPPINGS.length;
        const cta = document.getElementById('clippings-view-all-cta');
        if (cta) {
          const isMs = /\/ms\//.test(window.location.pathname);
          cta.textContent = isMs ? `Lihat Semua (${total}) →` : `View All (${total}) →`;
        }
      });
    }
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
