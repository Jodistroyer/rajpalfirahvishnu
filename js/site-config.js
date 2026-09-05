/**
 * site-config.js — Shared site URL helpers for SEO and structured data.
 */

export const WHATSAPP_NUMBER_DISPLAY = '+60 12-261 5635';
export const WHATSAPP_NUMBER_DIGITS = '60122615635';

const WHATSAPP_MESSAGE_EN = 'Hello, I would like to enquire about legal assistance.';
const WHATSAPP_MESSAGE_MS = 'Helo, saya ingin bertanya mengenai bantuan guaman.';

export const WHATSAPP_ICON_SVG = `<svg class="btn__whatsapp-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

/**
 * @param {boolean} [ms]
 * @returns {string}
 */
export function getWhatsAppUrl(ms = false) {
  const text = ms ? WHATSAPP_MESSAGE_MS : WHATSAPP_MESSAGE_EN;
  return `https://wa.me/${WHATSAPP_NUMBER_DIGITS}?text=${encodeURIComponent(text)}`;
}

/**
 * @param {boolean} [ms]
 * @returns {string}
 */
export function whatsappCtaLabel(ms = false) {
  return ms ? 'Bantuan Segera' : 'Get Help Now';
}

/**
 * @param {boolean} [ms]
 * @returns {string}
 */
export function whatsappCtaAriaLabel(ms = false) {
  return ms
    ? `Bantuan segera di WhatsApp, ${WHATSAPP_NUMBER_DISPLAY}`
    : `Get help now on WhatsApp, ${WHATSAPP_NUMBER_DISPLAY}`;
}

/**
 * @param {{ ms?: boolean, label?: string }} [opts]
 * @returns {string}
 */
export function whatsappCtaInnerHtml(opts = {}) {
  const ms = Boolean(opts.ms);
  const label = opts.label || whatsappCtaLabel(ms);
  return `${WHATSAPP_ICON_SVG}<span class="btn__whatsapp-label">${label}</span>`;
}

/** @deprecated Google Form replaced by WhatsApp. */
export const CONSULTATION_FORM_URL = getWhatsAppUrl();

/** @type {string | null} */
let cachedSiteBasePath = null;

/**
 * Site root path from the origin (e.g. '/' or '/rajpalfirahvishnu/').
 * Inferred from the resolved main.js script URL so GitHub Pages project
 * sites and custom-domain roots both work without configuration.
 * @returns {string}
 */
export function getSiteBasePath() {
  if (cachedSiteBasePath !== null) return cachedSiteBasePath;

  try {
    const moduleUrl = new URL(import.meta.url);
    const base = moduleUrl.pathname.replace(/\/js\/site-config\.js$/, '/');
    cachedSiteBasePath = base.startsWith('/') ? base : `/${base}`;
    return cachedSiteBasePath;
  } catch {
    cachedSiteBasePath = '/';
    return cachedSiteBasePath;
  }
}

/**
 * Root-absolute asset URL from site root, e.g. "/rajpalfirahvishnu/assets/foo.jpg".
 * @param {string} pathFromSiteRoot
 * @returns {string}
 */
export function siteAssetUrl(pathFromSiteRoot) {
  const clean = String(pathFromSiteRoot).replace(/^\//, '');
  return `${getSiteBasePath()}${clean}`;
}

/**
 * Current pathname relative to the site root (no leading slash).
 * @returns {string}
 */
function getPathRelativeToSiteRoot() {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  const base = getSiteBasePath();

  if (base === '/') {
    return pathname.replace(/^\//, '');
  }

  if (pathname.startsWith(base)) {
    return pathname.slice(base.length);
  }

  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 1 ? segments.slice(1).join('/') : '';
}

/**
 * Production origin from canonical link, or current origin in local dev.
 * @returns {string}
 */
export function getSiteOrigin() {
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (canonical) {
    try {
      const url = new URL(canonical, window.location.href);
      if (!url.hostname.includes('yourdomain')) {
        return url.origin;
      }
    } catch {
      /* fall through */
    }
  }
  return window.location.origin;
}

/**
 * @param {string} path Path from site root, e.g. "assets/media/foo.jpg"
 * @returns {string}
 */
export function absoluteUrl(path) {
  const clean = path.replace(/^\//, '').replace(/^(?:\.\.\/)+/, '');
  const base = getSiteBasePath().replace(/\/$/, '');
  return `${getSiteOrigin()}${base}/${clean}`;
}

/**
 * @returns {boolean}
 */
export function isMediaSubpage() {
  return /\/media(?:\/|$)/.test(window.location.pathname.replace(/\\/g, '/'));
}

/**
 * @returns {boolean}
 */
export function isMsMediaSubpage() {
  return /\/ms\/media(?:\/|$)/.test(window.location.pathname.replace(/\\/g, '/'));
}

/**
 * @returns {boolean}
 */
export function isMsSubpage() {
  return /\/ms(?:\/|$)/.test(window.location.pathname.replace(/\\/g, '/'));
}

/**
 * Relative prefix from the current page to the site root (e.g. '', '../', '../../').
 * @returns {string}
 */
export function getRootRelativePrefix() {
  const relative = getPathRelativeToSiteRoot();
  const dir = relative.endsWith('/') || relative === ''
    ? relative
    : relative.replace(/\/[^/]+$/, '/');
  const depth = dir.split('/').filter(Boolean).length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

/**
 * @returns {string}
 */
export function clippingsPageUrl() {
  const base = getSiteBasePath().replace(/\/$/, '');
  const origin = getSiteOrigin();
  if (isMsMediaSubpage()) return `${origin}${base}/ms/media/#clippings-library`;
  if (isMediaSubpage()) return `${origin}${base}/media/#clippings`;
  if (isMsSubpage()) return `${origin}${base}/ms/#clippings-library`;
  return `${origin}${base}/#media`;
}

/**
 * @returns {string}
 */
export function pressPageUrl() {
  const base = getSiteBasePath().replace(/\/$/, '');
  const origin = getSiteOrigin();
  if (isMsMediaSubpage()) return `${origin}${base}/ms/media/#press`;
  if (isMediaSubpage()) return `${origin}${base}/media/#press`;
  if (isMsSubpage()) return `${origin}${base}/ms/#press`;
  return `${origin}${base}/#media`;
}

/**
 * @returns {string}
 */
export function clippingsAssetBase() {
  return siteAssetUrl('assets/media/newspaper-clippings/');
}

/**
 * Drop tracking/filter query params from the address bar without reloading.
 * Canonical URLs never include these; leaving them visible created duplicate
 * crawl URLs in Search Console ("Alternative page with proper canonical").
 * @param {string[]} keys
 */
export function stripSearchParams(keys) {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of keys) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (!changed) return;
  const search = url.searchParams.toString();
  history.replaceState(null, '', `${url.pathname}${search ? `?${search}` : ''}${url.hash}`);
}
