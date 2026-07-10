/**
 * media-locale.js — Locale-aware press and clippings data accessors.
 */

import { PRESS_ITEMS, PRESS_CATEGORIES } from './press-data.js';
import { PRESS_ITEMS_MS, PRESS_CATEGORIES_MS } from './press-data-ms.js';
import { CLIPPINGS } from './clippings-data.js';
import { CLIPPINGS_MS } from './clippings-data-ms.js';
import { isMsSubpage } from './site-config.js';

/** @returns {import('./press-data.js').PressItem[]} */
export function getPressItems() {
  return isMsSubpage() ? PRESS_ITEMS_MS : PRESS_ITEMS;
}

/** @returns {{ id: string, label: string }[]} */
export function getPressCategories() {
  return isMsSubpage() ? PRESS_CATEGORIES_MS : PRESS_CATEGORIES;
}

/** @returns {import('./clippings-data.js').Clipping[]} */
export function getClippings() {
  return isMsSubpage() ? CLIPPINGS_MS : CLIPPINGS;
}

/** @returns {boolean} */
export function isMsMediaLocale() {
  return isMsSubpage();
}
