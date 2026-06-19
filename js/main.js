/**
 * main.js — App entry point and module orchestrator.
 *
 * Initialises all modules in the correct order after DOM is ready.
 * Handles global concerns: JS class, scrollbar width, reduced-motion.
 */

import { initNav }       from './nav.js';
import { initModals }    from './modal.js';
import { initForm }      from './form.js';
import { initLazyMedia } from './lazymedia.js';

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

  // ── Initialise modules ──
  initNav();
  initModals();

  // Pass your Formspree endpoint here, e.g. 'https://formspree.io/f/xxxxxabc'
  // Leave empty string for a simulated-success development fallback.
  initForm('#contact-form', '');

  initLazyMedia();

  // ── Service card CTA → pre-fill contact form subject ──
  // Handles anchor links like <a href="#contact" data-subject="Corporate Law">
  document.querySelectorAll('.service-card__cta[data-subject]').forEach(link => {
    link.addEventListener('click', e => {
      const subject = link.dataset.subject;
      if (!subject) return;
      // Small timeout to let smooth-scroll settle first
      setTimeout(() => {
        const select = document.getElementById('field-subject');
        if (!select) return;
        for (const opt of select.options) {
          if (opt.value === subject) { opt.selected = true; break; }
        }
      }, 600);
    });
  });

  // ── Handle ?subject= query param (deep-linked from external sources) ──
  const params  = new URLSearchParams(window.location.search);
  const subject = params.get('subject');
  if (subject) {
    const select = document.getElementById('field-subject');
    if (select) {
      for (const opt of select.options) {
        if (opt.value === subject) { opt.selected = true; break; }
      }
    }
  }

})();
