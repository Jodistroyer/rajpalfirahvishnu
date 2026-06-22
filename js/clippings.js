/**
 * clippings.js — Newspaper clippings collage gallery for the Media Room.
 */

import { openModal } from './modal.js';
import { getClippingSeoMeta } from './clippings-seo.js';
import { loadClippingsData } from './clippings-data-loader.js';

const ARCHIVE_YEAR = 'Archive';
const IMAGE_LOAD_BATCH = 2;

/** @type {IntersectionObserver | null} */
let imageObserver = null;

/** @type {HTMLImageElement[]} */
const imageLoadQueue = [];

/** @type {boolean} */
let drainingImageQueue = false;

/** @type {[string, import('./clippings-data.js').Clipping[]][] | null} */
let cachedYearGroups = null;

/** Resolve image base path for root (index.html) vs /media/ subdirectory. */
function getClippingsBase() {
  const path = window.location.pathname.replace(/\\/g, '/');
  return /\/media(?:\/|$)/.test(path)
    ? '../assets/media/newspaper-clippings/'
    : 'assets/media/newspaper-clippings/';
}

/** @param {string} str */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** @param {string} sort */
function yearFromSort(sort) {
  const year = parseInt(sort.slice(0, 4), 10);
  return year < 2004 ? ARCHIVE_YEAR : String(year);
}

/**
 * @param {import('./clippings-data.js').Clipping[]} items
 * @returns {[string, import('./clippings-data.js').Clipping[]][]}
 */
function groupByYear(items) {
  if (cachedYearGroups) return cachedYearGroups;

  /** @type {Map<string, import('./clippings-data.js').Clipping[]>} */
  const groups = new Map();
  const sorted = [...items].sort((a, b) => a.sort.localeCompare(b.sort));

  for (const item of sorted) {
    const year = yearFromSort(item.sort);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(item);
  }

  cachedYearGroups = [...groups.entries()].sort(([a], [b]) => {
    if (a === ARCHIVE_YEAR) return 1;
    if (b === ARCHIVE_YEAR) return -1;
    return Number(b) - Number(a);
  });

  return cachedYearGroups;
}

/**
 * @param {HTMLImageElement} img
 */
function activateImage(img) {
  if (!img.dataset.src) return;
  img.src = img.dataset.src;
  img.removeAttribute('data-src');
  img.classList.remove('clipping-card__img--pending');
  img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
}

function drainImageQueue() {
  if (drainingImageQueue || !imageLoadQueue.length) return;
  drainingImageQueue = true;

  requestAnimationFrame(() => {
    const batch = imageLoadQueue.splice(0, IMAGE_LOAD_BATCH);
    batch.forEach(activateImage);
    drainingImageQueue = false;
    if (imageLoadQueue.length) drainImageQueue();
  });
}

/**
 * @param {import('./clippings-data.js').Clipping} clipping
 * @param {number} index
 * @param {string} base
 */
function renderClippingCard(clipping, index, base) {
  const src = `${base}${clipping.file}`;
  const seo = getClippingSeoMeta(clipping);
  const spanClass = index % 5 === 0 ? ' clipping-card--tall' : index % 3 === 0 ? ' clipping-card--wide' : '';

  return `
    <button type="button"
            class="clipping-card${spanClass}"
            data-clipping-file="${escHtml(clipping.file)}"
            aria-label="${escHtml(seo.title)}">
      <figure class="clipping-card__figure">
        <img class="clipping-card__img clipping-card__img--pending"
             data-src="${escHtml(src)}"
             alt="${escHtml(seo.alt)}"
             title="${escHtml(seo.title)}"
             width="320"
             height="240"
             decoding="async"
             fetchpriority="low">
        <figcaption class="clipping-card__overlay">
          <time class="clipping-card__date" datetime="${escHtml(clipping.sort.slice(0, 10))}">${escHtml(clipping.dateLabel)}</time>
        </figcaption>
      </figure>
    </button>`;
}

/**
 * @param {string[]} years
 * @param {string} activeYear
 */
function renderYearNav(years, activeYear) {
  const items = years.map(year => {
    const isActive = year === activeYear;
    return `
      <li class="clippings-years-nav__item" role="none">
        <button type="button"
                class="clippings-years-nav__btn${isActive ? ' is-active' : ''}"
                data-clipping-year="${escHtml(year)}"
                aria-current="${isActive ? 'true' : 'false'}">
          ${escHtml(year)}
        </button>
      </li>`;
  }).join('');

  return `
    <nav class="clippings-years-nav" aria-label="Filter clippings by year">
      <ul class="clippings-years-nav__list" role="list">
        ${items}
      </ul>
    </nav>`;
}

/**
 * @param {import('./clippings-data.js').Clipping[]} items
 * @param {string} base
 */
function renderCollage(items, base) {
  const cards = items.map((item, i) => renderClippingCard(item, i, base)).join('');
  return `<div class="clippings-collage" role="list">${cards}</div>`;
}

/** @param {HTMLElement} root */
function observeClippingImages(root) {
  imageObserver?.disconnect();
  imageLoadQueue.length = 0;
  drainingImageQueue = false;

  const images = [...root.querySelectorAll('img[data-src]')];
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    images.forEach(activateImage);
    return;
  }

  imageObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = /** @type {HTMLImageElement} */ (entry.target);
      obs.unobserve(img);
      imageLoadQueue.push(img);
    });
    drainImageQueue();
  }, { rootMargin: '40px 0px', threshold: 0.01 });

  images.forEach(img => imageObserver.observe(img));
}

/**
 * @param {import('./clippings-data.js').Clipping} clipping
 */
function openClippingModal(clipping) {
  const src = `${getClippingsBase()}${clipping.file}`;
  const seo = getClippingSeoMeta(clipping);
  const linkHtml = clipping.link
    ? `<a href="${escHtml(clipping.link)}" class="clipping-modal__link" target="_blank" rel="noopener noreferrer">Related document <span aria-hidden="true">↗</span></a>`
    : '';

  const html = `
    <div class="modal__body modal__body--clipping">
      <button class="modal__close" aria-label="Close clipping viewer">&times;</button>
      <figure class="clipping-modal">
        <div class="clipping-modal__image-wrap">
          <img class="clipping-modal__img"
               src="${escHtml(src)}"
               alt="${escHtml(seo.alt)}"
               title="${escHtml(seo.title)}">
        </div>
        <figcaption class="clipping-modal__caption">
          <time class="clipping-modal__date" datetime="${escHtml(clipping.sort.slice(0, 10))}">${escHtml(clipping.dateLabel)}</time>
          <p class="clipping-modal__desc">${escHtml(seo.caption)}</p>
          ${linkHtml}
        </figcaption>
      </figure>
    </div>`;

  const dialog = document.getElementById('modal-dialog');
  if (dialog) dialog.classList.add('modal__dialog--wide');

  openModal(html);
}

/**
 * @param {HTMLElement} [container]
 */
export async function initClippings(container) {
  container = container
    || document.getElementById('clippings-gallery')
    || document.getElementById('clippings');
  if (!container || container.dataset.clippingsReady === 'true') return;

  container.dataset.clippingsReady = 'true';

  const { CLIPPINGS } = await loadClippingsData();

  const mode = container.dataset.clippingsMode === 'preview' ? 'preview' : 'full';
  const previewLimit = Math.max(1, parseInt(container.dataset.clippingsLimit || '8', 10) || 8);

  const yearGroups = groupByYear(CLIPPINGS);
  const years = yearGroups.map(([year]) => year);
  const itemsByYear = new Map(yearGroups);
  const byFile = new Map(CLIPPINGS.map(c => [c.file, c]));

  let activeYear = years[0] || '';

  let inner = container.querySelector('.clippings-gallery__inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'clippings-gallery__inner';
    container.appendChild(inner);
  }

  function render() {
    const allForYear = itemsByYear.get(activeYear) || [];
    const visible = mode === 'preview' ? allForYear.slice(0, previewLimit) : allForYear;
    const base = getClippingsBase();

    const panelHtml = visible.length
      ? renderCollage(visible, base)
      : '<p class="clippings-gallery__empty">No clippings for this year.</p>';

    inner.innerHTML = `
      ${renderYearNav(years, activeYear)}
      <div class="clippings-panel" id="clippings-panel" aria-live="polite">
        ${panelHtml}
      </div>`;

    const panel = inner.querySelector('#clippings-panel');
    if (panel) observeClippingImages(panel);
  }

  requestAnimationFrame(() => {
    render();
    container.classList.remove('clippings-gallery--loading');
  });

  container.addEventListener('click', e => {
    if (!(e.target instanceof Element)) return;

    const yearBtn = e.target.closest('.clippings-years-nav__btn');
    if (yearBtn instanceof HTMLButtonElement) {
      const year = yearBtn.dataset.clippingYear;
      if (!year || year === activeYear) return;
      activeYear = year;
      requestAnimationFrame(render);
      return;
    }

    const card = e.target.closest('.clipping-card');
    if (!card) return;

    const clipping = byFile.get(card.dataset.clippingFile || '');
    if (clipping) openClippingModal(clipping);
  });
}
