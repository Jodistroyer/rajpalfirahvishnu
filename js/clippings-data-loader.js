/**
 * clippings-data-loader.js — Shared lazy loader for clippings metadata.
 */

/** @type {Promise<typeof import('./clippings-data.js')> | null} */
let dataPromise = null;

/** @returns {Promise<typeof import('./clippings-data.js')>} */
export function loadClippingsData() {
  if (!dataPromise) {
    dataPromise = import('./clippings-data.js');
  }
  return dataPromise;
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
