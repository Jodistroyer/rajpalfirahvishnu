/**
 * site-config.js — Shared site URL helpers for SEO and structured data.
 */

/** Google Form — Borang Hubungi (Rajpal, Firah, Vishnu), trilingual EN/BM/ZH. */
export const CONSULTATION_FORM_URL = 'https://forms.gle/AmrRiv3vucivaYid7';

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

  const script = document.querySelector('script[type="module"][src*="main.js"]');
  if (script) {
    try {
      const scriptUrl = new URL(script.getAttribute('src') || '', window.location.href);
      const base = scriptUrl.pathname.replace(/\/js\/main\.js$/, '/');
      cachedSiteBasePath = base.startsWith('/') ? base : `/${base}`;
      return cachedSiteBasePath;
    } catch {
      /* fall through */
    }
  }

  cachedSiteBasePath = '/';
  return cachedSiteBasePath;
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
  return `${getRootRelativePrefix()}assets/media/newspaper-clippings/`;
}
