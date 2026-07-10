/**
 * site-config.js — Shared site URL helpers for SEO and structured data.
 */

/** Google Form — Borang Hubungi (Rajpal, Firah, Vishnu), trilingual EN/BM/ZH. */
export const CONSULTATION_FORM_URL = 'https://forms.gle/AmrRiv3vucivaYid7';

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
  const path = window.location.pathname.replace(/\\/g, '/');
  const dir = path.endsWith('/') ? path : path.replace(/\/[^/]+$/, '/');
  const depth = dir.split('/').filter(Boolean).length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

/**
 * @returns {string}
 */
export function clippingsPageUrl() {
  if (isMsMediaSubpage()) return `${getSiteOrigin()}/ms/media/#clippings-library`;
  if (isMediaSubpage()) return `${getSiteOrigin()}/media/#clippings`;
  if (isMsSubpage()) return `${getSiteOrigin()}/ms/#clippings-library`;
  return `${getSiteOrigin()}/#media`;
}

/**
 * @returns {string}
 */
export function pressPageUrl() {
  if (isMsMediaSubpage()) return `${getSiteOrigin()}/ms/media/#press`;
  if (isMediaSubpage()) return `${getSiteOrigin()}/media/#press`;
  if (isMsSubpage()) return `${getSiteOrigin()}/ms/#press`;
  return `${getSiteOrigin()}/#media`;
}

/**
 * @returns {string}
 */
export function clippingsAssetBase() {
  return `${getRootRelativePrefix()}assets/media/newspaper-clippings/`;
}
