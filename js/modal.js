/**
 * modal.js — Modal manager for attorney bios and media articles.
 *
 * Responsibilities:
 *   - Open / close modal with transition
 *   - Full focus trap (Tab / Shift+Tab cycles within dialog)
 *   - Body scroll lock (with scrollbar-width compensation)
 *   - aria-hidden on #main-content when open
 *   - Restores focus to trigger element on close
 *   - ESC key and backdrop-click to dismiss
 */

import { enhanceCopyable } from './copy.js';
import { CONSULTATION_FORM_URL } from './site-config.js';

const overlay    = /** @type {HTMLElement|null} */ (document.getElementById('modal-overlay'));
const dialog     = /** @type {HTMLElement|null} */ (document.getElementById('modal-dialog'));
const mainContent = document.getElementById('main-content');

let triggerElement = /** @type {HTMLElement|null} */ (null);

export function initModals() {
  if (!overlay || !dialog) return;

  // Attorney card clicks (skip cards that link to a full profile page)
  document.querySelectorAll('.attorney-card').forEach(card => {
    if (card.matches('a[href]')) return;
    card.addEventListener('click', () => openAttorneyModal(/** @type {HTMLElement} */ (card)));
  });

  // Media article CTA button clicks
  document.querySelectorAll('.media-card__cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const article = /** @type {HTMLElement|null} */ (btn.closest('.media-card'));
      if (article) openArticleModal(article);
    });
  });

  // Backdrop click
  overlay.querySelector('.modal__backdrop')?.addEventListener('click', closeModal);

  // Global ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
}

/** Inject HTML, show overlay, lock scroll, trap focus. */
export function openModal(htmlContent) {
  if (!overlay || !dialog) return;

  triggerElement = /** @type {HTMLElement} */ (document.activeElement);

  dialog.innerHTML = htmlContent;
  enhanceCopyable(dialog);

  // Wire close button (injected into the modal body)
  dialog.querySelector('.modal__close')?.addEventListener('click', closeModal);

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-open');
  mainContent?.setAttribute('aria-hidden', 'true');
  lockBodyScroll();

  // Focus first focusable element (or the dialog itself)
  requestAnimationFrame(() => {
    const first = getFirstFocusable(dialog);
    (first || dialog).focus();
  });

  dialog.addEventListener('keydown', trapFocus);
}

/** Hide overlay, restore scroll and focus. */
export function closeModal() {
  if (!overlay || !dialog) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  mainContent?.setAttribute('aria-hidden', 'false');
  unlockBodyScroll();
  dialog.removeEventListener('keydown', trapFocus);
  dialog.classList.remove('modal__dialog--wide');

  // Restore focus after transition
  const trigger = triggerElement;
  triggerElement = null;
  setTimeout(() => {
    trigger?.focus();
    dialog.innerHTML = '';
  }, 300);
}

// ── Attorney bio modal ────────────────────────────────────────────────────

function openAttorneyModal(card) {
  const name     = card.dataset.name     || '';
  const title    = card.dataset.title    || '';
  const practice = card.dataset.practice || '';
  const called   = card.dataset.called   || '';
  const bio      = card.dataset.bio      || '';
  const email    = card.dataset.email    || '';
  const phone    = card.dataset.phone    || '';

  // Two-letter initials from first and last name
  const parts    = name.split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0]?.[0] ?? '?');

  // First name for personalised CTA label
  const firstName = parts.find(p => /^[A-Z]/.test(p) && !['Datuk','Dato','Tan','Sri'].includes(p)) || name;

  const emailLink = email
    ? `<a href="mailto:${email}" class="attorney-modal__contact-link" data-copyable data-copy-type="email">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M2 6l7 5 7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>${escHtml(email)}</a>`
    : '';

  const phoneLink = phone
    ? `<a href="tel:${phone.replace(/\s/g, '')}" class="attorney-modal__contact-link" data-copyable data-copy-type="phone">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3.6 2H6.9L8.4 5.75L6.525 6.9C7.35 8.575 8.925 10.15 10.6 10.975L11.75 9.1L15.5 10.6V13.9C15.5 14.825 14.75 15.5 13.825 15.5C7.475 15.275 2.225 10.025 2 3.675C2 2.75 2.675 2 3.6 2Z" fill="currentColor"/>
        </svg>${escHtml(phone)}</a>`
    : '';

  const html = `
    <div class="modal__body">
      <button class="modal__close" aria-label="Close modal">&times;</button>
      <div class="attorney-modal__header">
        <div class="attorney-modal__avatar" aria-hidden="true">${escHtml(initials)}</div>
        <div>
          <h2 class="attorney-modal__name" id="modal-title">${escHtml(name)}</h2>
          <p class="attorney-modal__title">${escHtml(title)}</p>
          <p class="attorney-modal__practice">${escHtml(practice)}</p>
          <p class="attorney-modal__called">${escHtml(called)}</p>
        </div>
      </div>
      <p class="attorney-modal__bio">${escHtml(bio)}</p>
      <div class="attorney-modal__cta-row">
        <a href="${CONSULTATION_FORM_URL}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
          Contact ${escHtml(firstName)}
        </a>
        <div class="attorney-modal__contact-links">
          ${emailLink}
          ${phoneLink}
        </div>
      </div>
    </div>`;

  openModal(html);
}

// ── Article / media modal ─────────────────────────────────────────────────

function openArticleModal(card) {
  const category = card.dataset.category || '';
  const date     = card.dataset.date     || '';
  const title    = card.dataset.title    || '';
  const author   = card.dataset.author   || '';
  const content  = card.dataset.content  || '';

  const html = `
    <div class="modal__body">
      <button class="modal__close" aria-label="Close modal">&times;</button>
      <div class="article-modal__meta">
        <span class="media-card__category">${escHtml(category)}</span>
        <time class="media-card__date">${escHtml(date)}</time>
      </div>
      <h2 class="article-modal__title" id="modal-title">${escHtml(title)}</h2>
      <p class="article-modal__author">By ${escHtml(author)}</p>
      <div class="article-modal__content">${escHtml(content)}</div>
      <div class="article-modal__cta-row">
        <a href="${CONSULTATION_FORM_URL}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
          Book a Consultation
        </a>
      </div>
    </div>`;

  openModal(html);
}

// ── Focus trap helpers ────────────────────────────────────────────────────

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFirstFocusable(container) {
  return container.querySelector(FOCUSABLE);
}

function getAllFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE));
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = getAllFocusable(dialog);
  if (!focusable.length) { e.preventDefault(); return; }

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
}

// ── Scroll lock helpers ───────────────────────────────────────────────────

function lockBodyScroll()   { document.body.classList.add('scroll-locked');    }
function unlockBodyScroll() { document.body.classList.remove('scroll-locked'); }

// ── HTML escape ───────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
