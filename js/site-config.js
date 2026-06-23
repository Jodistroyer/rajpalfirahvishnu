/**
 * site-config.js — Shared site URL helpers for SEO and structured data.
 */

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
  const clean = path.replace(/^\//, '');
  return `${getSiteOrigin()}/${clean}`;
}

/**
 * @returns {boolean}
 */
export function isMediaSubpage() {
  return /\/media(?:\/|$)/.test(window.location.pathname.replace(/\\/g, '/'));
}

/**
 * @returns {string}
 */
export function clippingsPageUrl() {
  return isMediaSubpage()
    ? `${getSiteOrigin()}/media/#clippings`
    : `${getSiteOrigin()}/#media`;
}

/**
 * @returns {string}
 */
export function pressPageUrl() {
  return isMediaSubpage()
    ? `${getSiteOrigin()}/media/#press`
    : `${getSiteOrigin()}/#media`;
}

/**
 * @returns {string}
 */
export function clippingsAssetBase() {
  return isMediaSubpage()
    ? '../assets/media/newspaper-clippings/'
    : 'assets/media/newspaper-clippings/';
}
