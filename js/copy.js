/**
 * copy.js — Copy-to-clipboard for addresses, phone numbers, and emails.
 *
 * Mark any element with [data-copyable]. Optional:
 *   data-copy-value  — exact string to copy (defaults from text / href)
 *   data-copy-type   — address | phone | email (for aria-label)
 *   data-copy-label  — custom aria-label override
 */

const COPY_ICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="9" rx="1" stroke="currentColor" stroke-width="1.25"/><path d="M4 10.5H3.25A1.25 1.25 0 0 1 2 9.25V3.25A1.25 1.25 0 0 1 3.25 2H9.25A1.25 1.25 0 0 1 10.5 3.25V4" stroke="currentColor" stroke-width="1.25"/></svg>`;

const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const LABELS = {
  en: {
    address: 'Copy address',
    phone: 'Copy phone number',
    email: 'Copy email address',
    copied: 'Copied!',
  },
  ms: {
    address: 'Salin alamat',
    phone: 'Salin nombor telefon',
    email: 'Salin alamat e-mel',
    copied: 'Disalin!',
  },
};

/** Wire copy buttons and click handling. */
export function initCopy() {
  enhanceCopyable(document);
  document.addEventListener('click', onCopyClick);
  document.addEventListener('click', onCopyableLinkClick);
}

/** Add copy buttons to [data-copyable] elements inside root. */
export function enhanceCopyable(root = document) {
  root.querySelectorAll('[data-copyable]:not([data-copy-enhanced])').forEach(el => {
    el.dataset.copyEnhanced = 'true';

    const value = getCopyValue(el);
    if (!value) return;

    const label = getCopyLabel(el);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.dataset.copy = value;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = COPY_ICON;

    const row = document.createElement('span');
    row.className = shouldBlockWrap(el)
      ? 'copy-row copy-row--block'
      : 'copy-row';

    el.parentNode.insertBefore(row, el);
    row.append(el, btn);

    const href = el.getAttribute('href') || '';
    if (!isTouchPrimary() && (href.startsWith('tel:') || href.startsWith('mailto:'))) {
      const lang = document.documentElement.lang?.startsWith('ms') ? 'ms' : 'en';
      el.title = lang === 'ms' ? 'Klik untuk salin' : 'Click to copy';
    }
  });
}

function shouldBlockWrap(el) {
  return el.tagName === 'P'
    || el.classList.contains('copy-row__text')
    || el.dataset.copyBlock !== undefined;
}

function getCopyValue(el) {
  if (el.dataset.copyValue) return el.dataset.copyValue.trim();

  const href = el.getAttribute('href');
  if (href?.startsWith('mailto:')) return href.slice(7);
  if (href?.startsWith('tel:')) return el.textContent.replace(/\s+/g, ' ').trim();

  return el.textContent.replace(/\s+/g, ' ').trim();
}

function getCopyLabel(el) {
  if (el.dataset.copyLabel) return el.dataset.copyLabel;

  const lang = document.documentElement.lang?.startsWith('ms') ? 'ms' : 'en';
  const type = el.dataset.copyType || guessCopyType(el);
  return LABELS[lang][type] || LABELS.en[type] || LABELS.en.address;
}

function guessCopyType(el) {
  const href = el.getAttribute('href') || '';
  if (href.startsWith('mailto:') || el.dataset.copyType === 'email') return 'email';
  if (href.startsWith('tel:') || el.dataset.copyType === 'phone') return 'phone';
  return 'address';
}

async function onCopyClick(e) {
  const btn = /** @type {HTMLElement|null} */ (e.target.closest('.copy-btn'));
  if (!btn) return;

  e.preventDefault();
  const text = btn.dataset.copy;
  if (!text) return;

  const copied = await writeClipboard(text);
  if (copied) showCopied(btn);
}

/** Desktop: tel/mailto links copy instead of opening dialer or mail client. */
async function onCopyableLinkClick(e) {
  if (isTouchPrimary()) return;

  const link = /** @type {HTMLAnchorElement|null} */ (e.target.closest('a[data-copyable]'));
  if (!link) return;

  const href = link.getAttribute('href') || '';
  if (!href.startsWith('tel:') && !href.startsWith('mailto:')) return;

  e.preventDefault();

  const text = getCopyValue(link);
  if (!text) return;

  const copied = await writeClipboard(text);
  if (!copied) return;

  const btn = link.parentElement?.querySelector('.copy-btn');
  if (btn) showCopied(btn);
}

/** Phones/tablets: keep native tel: / mailto: behaviour. */
function isTouchPrimary() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function showCopied(btn) {
  const lang = document.documentElement.lang?.startsWith('ms') ? 'ms' : 'en';
  const originalLabel = btn.getAttribute('aria-label') || '';
  const originalIcon = btn.innerHTML;

  btn.classList.add('is-copied');
  btn.setAttribute('aria-label', LABELS[lang].copied);
  btn.innerHTML = CHECK_ICON;

  window.setTimeout(() => {
    btn.classList.remove('is-copied');
    btn.setAttribute('aria-label', originalLabel);
    btn.innerHTML = originalIcon;
  }, 2000);
}
