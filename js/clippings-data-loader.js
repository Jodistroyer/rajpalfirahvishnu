/**
 * clippings-data-loader.js — Shared lazy loader for clippings metadata.
 */

import { getClippings, isMsMediaLocale } from './media-locale.js';

/** @type {Promise<{ CLIPPINGS: import('./clippings-data.js').Clipping[] }> | null} */
let dataPromise = null;

/** @returns {Promise<{ CLIPPINGS: import('./clippings-data.js').Clipping[] }>} */
export function loadClippingsData() {
  if (!dataPromise) {
    dataPromise = Promise.resolve({ CLIPPINGS: getClippings() });
  }
  return dataPromise;
}

/** Reset cache when locale changes (e.g. SPA navigation — not used today). */
export function resetClippingsDataCache() {
  dataPromise = null;
}

/** Warm caches during browser idle time. */
export function prefetchClippingsData() {
  loadClippingsData();
}

/** @type {Promise<typeof import('./clippings.js')> | null} */
let galleryPromise = null;

/** @returns {Promise<typeof import('./clippings.js')>} */
export function loadClippingsGallery() {
  if (!galleryPromise) {
    galleryPromise = import('./clippings.js');
  }
  return galleryPromise;
}

export function prefetchClippingsGallery() {
  loadClippingsGallery();
}

export { isMsMediaLocale };
