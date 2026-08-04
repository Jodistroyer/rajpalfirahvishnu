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
import { CONSULTATION_FORM_URL, isMsSubpage, siteAssetUrl } from './site-config.js';

/** @type {Record<string, string>} author display name → people profile path from site root (EN) */
const AUTHOR_PROFILE_PATHS = {
  'Vishnu Kumar': 'people/vishnu-kumar/',
  "Dato' Rajpal Singh": 'people/rajpal-singh/',
};

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

  // Firm Insights: whole card is clickable (not press/external cards)
  document.querySelectorAll('.media-card[data-content]').forEach(card => {
    if (card.classList.contains('media-card--external')) return;
    const el = /** @type {HTMLElement} */ (card);
    el.classList.add('media-card--insight');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    const label = el.dataset.title
      ? (isMsSubpage() ? `Baca artikel penuh: ${el.dataset.title}` : `Read full article: ${el.dataset.title}`)
      : (isMsSubpage() ? 'Baca artikel penuh' : 'Read full article');
    el.setAttribute('aria-label', label);

    // Keep "Read More" visual but remove nested button focus trap
    el.querySelectorAll('.media-card__cta').forEach(cta => {
      cta.setAttribute('tabindex', '-1');
      cta.setAttribute('aria-hidden', 'true');
    });

    const open = () => openArticleModal(el);
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    // Author name on the card → profile (stop card click from also firing)
    const authorEl = el.querySelector('.media-card__author');
    const authorName = el.dataset.author || '';
    const profileHref = profileUrlForAuthor(authorName);
    if (authorEl && profileHref && !authorEl.querySelector('a')) {
      const linked = document.createElement('a');
      linked.href = profileHref;
      linked.className = 'media-card__author-link';
      linked.textContent = authorEl.textContent?.trim() || authorName;
      linked.addEventListener('click', e => e.stopPropagation());
      authorEl.textContent = '';
      authorEl.appendChild(linked);
    }
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
      <button class="modal__close" aria-label="${isMsSubpage() ? 'Tutup tetingkap' : 'Close modal'}">&times;</button>
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
  const category    = card.dataset.category    || '';
  const date        = card.dataset.date        || '';
  const title       = card.dataset.title       || '';
  const author      = card.dataset.author      || '';
  const authorTitle = card.dataset.authorTitle || '';
  const content     = card.dataset.content     || '';

  const ms = isMsSubpage();
  const profileHref = profileUrlForAuthor(author);
  const authorNameHtml = profileHref
    ? `<a class="article-modal__author-link" href="${escHtml(profileHref)}">${escHtml(author)}</a>`
    : escHtml(author);

  const authorBlock = authorTitle
    ? `<p class="article-modal__author">${ms ? 'Oleh' : 'By'} ${authorNameHtml}</p>
      <p class="article-modal__author-title">${escHtml(authorTitle)}</p>`
    : `<p class="article-modal__author">${ms ? 'Oleh' : 'By'} ${authorNameHtml}</p>`;

  const html = `
    <div class="modal__body">
      <button class="modal__close" aria-label="${ms ? 'Tutup tetingkap' : 'Close modal'}">&times;</button>
      <div class="article-modal__meta">
        <span class="media-card__category">${escHtml(category)}</span>
        <time class="media-card__date">${escHtml(date)}</time>
      </div>
      <h2 class="article-modal__title" id="modal-title">${escHtml(title)}</h2>
      ${authorBlock}
      <div class="article-modal__content">${formatArticleContent(content, profileHref)}</div>
      <div class="article-modal__cta-row">
        <a href="${CONSULTATION_FORM_URL}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
          ${ms ? 'Tempah Perundingan' : 'Book a Consultation'}
        </a>
      </div>
    </div>`;

  openModal(html);
}

/** @param {string} author */
function profileUrlForAuthor(author) {
  const path = AUTHOR_PROFILE_PATHS[author];
  if (!path) return '';
  return siteAssetUrl(isMsSubpage() ? `ms/${path}` : path);
}

/**
 * Render Firm Insights body text as structured HTML.
 * Supports # / ## / ### headings, - lists, > quotes, and **bold**.
 * Also auto-detects ALL-CAPS / lettered / known section lines as headings
 * when markdown markers are not present.
 */
function formatArticleContent(raw, authorProfileHref = '') {
  const text = String(raw || '').replace(/\r\n/g, '\n').trim();
  if (!text) return '';

  const lines = text.split('\n');
  /** @type {string[]} */
  const out = [];
  /** @type {string[]} */
  let para = [];
  /** @type {string[]} */
  let list = [];
  /** @type {string[]} */
  let quote = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${inlineFormat(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push(`<ul>${list.map(i => `<li>${inlineFormat(i)}</li>`).join('')}</ul>`);
    list = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    out.push(`<blockquote><p>${inlineFormat(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushList();
    flushQuote();
    flushPara();
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushAll();
      continue;
    }

    const mdH = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (mdH) {
      flushAll();
      const level = mdH[1].length + 2; // # → h3, ## → h4, ### → h5
      out.push(`<h${level}>${inlineFormat(mdH[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushList();
      flushPara();
      quote.push(trimmed.slice(2));
      continue;
    }
    if (quote.length) flushQuote();

    if (/^[-•]\s+/.test(trimmed)) {
      flushPara();
      list.push(trimmed.replace(/^[-•]\s+/, ''));
      continue;
    }
    if (list.length) flushList();

    const heading = detectHeading(trimmed);
    if (heading) {
      flushAll();
      out.push(`<h${heading.level}>${inlineFormat(heading.text)}</h${heading.level}>`);
      continue;
    }

    if (isSignatureLine(trimmed)) {
      flushAll();
      if (authorProfileHref && isAuthorNameLine(trimmed)) {
        out.push(
          `<p class="article-modal__sign"><a class="article-modal__author-link" href="${escHtml(authorProfileHref)}">${inlineFormat(trimmed)}</a></p>`
        );
      } else {
        out.push(`<p class="article-modal__sign">${inlineFormat(trimmed)}</p>`);
      }
      continue;
    }

    // Opening single-quote dialogue / long quote as its own block
    if (
      (trimmed.startsWith("'") || trimmed.startsWith('"') || trimmed.startsWith('\u2018') || trimmed.startsWith('\u201C')) &&
      trimmed.length > 40
    ) {
      flushAll();
      const q = trimmed.replace(/^['"\u2018\u201C]/, '').replace(/['"\u2019\u201D]\.?$/, '');
      out.push(`<blockquote><p>${inlineFormat(q)}</p></blockquote>`);
      continue;
    }

    para.push(trimmed);
  }

  flushAll();
  return out.join('');
}

/** Signature name lines that should link to a people profile. */
function isAuthorNameLine(line) {
  return /^(?:[A-Z]\.\s+)?Vishnu\s+Kumar\b/i.test(line)
    || /^Dato'\s+Rajpal\s+Singh\b/i.test(line);
}

/** Signature / byline lines — muted body style, not headings. */
function isSignatureLine(line) {
  if (/^(Advocate\s*&\s*Solicitor|Peguambela\s*&\s*Peguamcara)\b/i.test(line)) return true;
  if (/^(Civil Law Subcommittee|Pengerusi Subjawatankuasa|Certified Mediator|Pengantara Bertauliah)\b/i.test(line)) return true;
  // Short personal name: "A. Vishnu Kumar" / "Vishnu Kumar"
  if (/^(?:[A-Z]\.\s+)?[A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ'.-]+){0,3}$/.test(line) && line.length < 40) {
    return true;
  }
  return false;
}

/** @param {string} line */
function detectHeading(line) {
  // Skip obvious body sentences
  if (line.length > 140) return null;
  if (/[.?!]$/.test(line) && !/^[A-G]\./.test(line) && line.length > 60) return null;

  // Personal names are signatures, not section headings
  if (isSignatureLine(line)) return null;

  const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (letters.length >= 8) {
    const upper = (letters.match(/[A-ZÀ-Ý]/g) || []).length;
    if (upper / letters.length >= 0.88) {
      return { level: 3, text: titleCaseAllCaps(line) };
    }
  }

  if (/^[A-G]\.\s+\S/.test(line)) return { level: 3, text: line };
  // Numbered section titles only - not enumerated body points ending in ; / and / or
  if (
    /^\d+\.\s+[A-ZÀ-Ý]/.test(line) &&
    line.length < 110 &&
    !/[.;,]$/.test(line) &&
    !/\b(and|or|dan)\s*$/i.test(line)
  ) {
    return { level: 4, text: line };
  }

  const sub = /^(Law\s*&\s*Drafting|Approach(\s+To)?\b|Undang-undang\b|Pendekatan\b|FUNDAMENTAL RULE|NOTE\b|Nota\b|PENGENALAN|KESIMPULAN|INTRODUCTION|CONCLUSION)\b/i;
  if (sub.test(line) && line.length < 100) return { level: 4, text: line };

  return null;
}

/** @param {string} s */
function titleCaseAllCaps(s) {
  // Keep short ALL-CAPS tokens (CJA, SCR, EGM) but title-case long words
  return s.replace(/[A-ZÀ-Ý]{2,}(?:'[A-ZÀ-Ý]+)?/g, (word) => {
    if (word.length <= 4) return word; // CJA, SCR, AGM, EGM, ROC, RFC…
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
}

/** Escape then apply **bold** and light auto-emphasis for citations / sections. */
function inlineFormat(str) {
  let s = escHtml(str);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Case citations: Name v. Name [year]
  s = s.replace(
    /\b([A-ZÀ-Ý][\w'&.]*(?:\s+(?:v\.|v|bin|binti|&amp;|and|&)\s+[A-ZÀ-Ý][\w'&.]*)+(?:\s+[A-ZÀ-Ý][\w'&.]*)*\s*\[[^\]]+\])/g,
    '<strong>$1</strong>'
  );
  // Section / Order / Rule / Practice Direction refs at start of a clause
  s = s.replace(
    /\b(Section|Seksyen|Order|Perintah|Rule|Kaedah|Practice Direction|Arahan Amalan)\s+(\d+[A-Za-z]?(?:\s*\([a-z0-9]+\))?(?:\s*r\.?\s*\d+[A-Za-z]?)?)/gi,
    '<strong>$1 $2</strong>'
  );
  return s;
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
