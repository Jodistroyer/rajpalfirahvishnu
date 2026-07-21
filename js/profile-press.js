/**
 * profile-press.js — "In the Press" section on lawyer profile pages.
 * Links internally to Media Room entries (#press-{id}) for each coverage item.
 */

import { getPressItems } from './media-locale.js';
import { getPressItemCounsel } from './press-seo.js';
import { isMsSubpage } from './site-config.js';

/** @typedef {import('./press-data.js').PressItem} PressItem */

const PROFILE_PRESS_LIMIT = 6;

/** @param {string} str */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** @returns {string | null} */
function getProfileSlug() {
  const match = window.location.pathname.match(/\/people\/([^/]+)/);
  return match?.[1] ?? null;
}

/**
 * @param {string} counselSlug
 * @param {string} [itemId]
 */
function mediaPressUrl(counselSlug, itemId) {
  const ms = isMsSubpage();
  const prefix = ms ? '../../../ms/media/' : '../../media/';
  const hash = itemId ? `#press-${itemId}` : '#press';
  return `${prefix}?counsel=${counselSlug}${hash}`;
}

/** @param {PressItem[]} items */
function sortPressItems(items) {
  return [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    return b.sort.localeCompare(a.sort);
  });
}

/** @param {string} slug */
export function getProfilePressItems(slug) {
  return sortPressItems(
    getPressItems().filter((item) => getPressItemCounsel(item) === slug),
  );
}

export function initProfilePress() {
  const main = document.querySelector('.profile-main');
  if (!main || main.querySelector('[data-profile-press]')) return;

  const slug = getProfileSlug();
  if (!slug) return;

  const all = getProfilePressItems(slug);
  if (!all.length) return;

  const visible = all.slice(0, PROFILE_PRESS_LIMIT);
  const ms = isMsSubpage();
  const nameEl = document.querySelector('.profile-sidebar__name');
  const name = nameEl?.textContent?.trim() || '';
  const title = ms ? 'Dalam Media' : 'In the Press';
  const intro = ms
    ? `Liputan media terpilih yang memaparkan ${name}.`
    : `Selected press coverage featuring ${name}.`;
  const viewAllLabel = ms
    ? `Lihat semua dalam Bilik Media (${all.length})`
    : `View all in Media Room (${all.length})`;

  const itemsHtml = visible.map((item) => `
      <li class="profile-press__item">
        <a href="${escHtml(mediaPressUrl(slug, item.id))}" class="profile-press__link">${escHtml(item.title)}</a>
        <span class="profile-press__meta">${escHtml(item.publisher)} · ${escHtml(item.dateLabel)}</span>
      </li>`).join('');

  const section = document.createElement('section');
  section.className = 'profile-section profile-press';
  section.setAttribute('aria-labelledby', 'profile-press');
  section.dataset.profilePress = '';
  section.innerHTML = `
    <h2 class="profile-section__title" id="profile-press">${title}</h2>
    <p class="profile-section__text">${intro}</p>
    <ul class="profile-press__list">${itemsHtml}</ul>
    <p class="profile-press__footer">
      <a href="${escHtml(mediaPressUrl(slug))}" class="profile-sidebar__resource">${viewAllLabel} <span aria-hidden="true">→</span></a>
    </p>`;

  main.appendChild(section);
}
