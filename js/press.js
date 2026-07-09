/**
 * press.js — Dynamic "In the Press" grid with category filtering.
 */

import { PRESS_ITEMS, PRESS_CATEGORIES } from './press-data.js';
import { observeLazyCards } from './lazymedia.js';
import { getPressSeoMeta } from './press-seo.js';

/** @typedef {import('./press-data.js').PressItem} PressItem */

/** @param {number} total */
function updatePressViewAllCta(total) {
  const cta = document.getElementById('press-view-all-cta');
  if (cta) cta.textContent = `View All (${total}) →`;
}

/** @returns {string} */
function getAssetBase() {
  const path = window.location.pathname.replace(/\\/g, '/');
  return /\/media(?:\/|$)/.test(path) ? '../' : '';
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

/**
 * @param {PressItem} item
 */
function resolveThumb(item) {
  if (item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  if (item.thumb) {
    return `${getAssetBase()}${item.thumb}`;
  }
  return null;
}

/**
 * @param {PressItem} item
 */
function categoryLabel(item) {
  if (item.type === 'video') return 'Video';
  if (item.type === 'social') return 'Social';
  if (item.type === 'document') return 'Document';
  return 'Press Coverage';
}

/**
 * @param {PressItem} item
 */
function ctaLabel(item) {
  if (item.type === 'video') return 'Watch video';
  if (item.type === 'document') return 'View document';
  if (item.type === 'social') return 'Open link';
  return 'Read article';
}

/**
 * @param {PressItem} item
 * @param {number} index
 */
function renderPressCard(item, index) {
  const thumb = resolveThumb(item);
  const seo = getPressSeoMeta(item);
  const isVideo = item.type === 'video';
  const placeholder = escHtml(item.publisher.slice(0, 12));

  const thumbHtml = thumb
    ? (isVideo
      ? `<div class="media-card__thumb-wrap">
           <img class="media-card__thumb" src="${escHtml(thumb)}" alt="${escHtml(seo.alt)}" title="${escHtml(seo.title)}" width="480" height="270" loading="lazy" decoding="async">
           <span class="media-card__play" aria-hidden="true">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           </span>
         </div>`
      : `<img class="media-card__thumb" src="${escHtml(thumb)}" alt="${escHtml(seo.alt)}" title="${escHtml(seo.title)}" width="480" height="270" loading="lazy" decoding="async">`)
    : `<div class="media-card__thumb media-card__thumb--placeholder" aria-hidden="true"><span>${placeholder}</span></div>`;

  return `
    <article class="media-card media-card--external lazy" data-delay="${index * 80}">
      <a href="${escHtml(item.url)}"
         class="media-card__link"
         target="_blank"
         rel="noopener noreferrer"
         title="${escHtml(seo.title)}">
        ${thumbHtml}
        <div class="media-card__content">
          <div class="media-card__meta">
            <span class="media-card__category">${escHtml(categoryLabel(item))}</span>
            <time class="media-card__date" datetime="${escHtml(item.sort.slice(0, 10))}">${escHtml(item.dateLabel)}</time>
          </div>
          <h3 class="media-card__title">${escHtml(item.title)}</h3>
          <p class="media-card__excerpt">${escHtml(item.excerpt)}</p>
          <footer class="media-card__footer">
            <span class="media-card__author">${escHtml(item.publisher)}</span>
            <span class="media-card__cta">${escHtml(ctaLabel(item))} <span aria-hidden="true">↗</span></span>
          </footer>
        </div>
      </a>
    </article>`;
}

/**
 * @param {string} activeCategory
 * @param {boolean} showFilters
 */
function renderCategoryNav(activeCategory, showFilters) {
  if (!showFilters) return '';

  const items = PRESS_CATEGORIES.map(cat => {
    const isActive = cat.id === activeCategory;
    return `
      <li class="clippings-years-nav__item" role="none">
        <button type="button"
                class="clippings-years-nav__btn${isActive ? ' is-active' : ''}"
                data-press-category="${escHtml(cat.id)}"
                aria-current="${isActive ? 'true' : 'false'}">
          ${escHtml(cat.label)}
        </button>
      </li>`;
  }).join('');

  return `
    <nav class="clippings-years-nav press-filter-nav" aria-label="Filter press coverage by topic">
      <ul class="clippings-years-nav__list" role="list">${items}</ul>
    </nav>`;
}

/**
 * @param {HTMLElement} container
 */
export function initPress(container) {
  if (!container || container.dataset.pressReady === 'true') return;

  updatePressViewAllCta(PRESS_ITEMS.length);

  container.dataset.pressReady = 'true';
  const mode = container.dataset.pressMode === 'preview' ? 'preview' : 'full';
  const showFilters = mode === 'full';
  const batchSizeDefault = Math.max(1, parseInt(container.dataset.pressBatch || '6', 10) || 6);
  const batchSizeMobile = container.dataset.pressBatchMobile
    ? Math.max(1, parseInt(container.dataset.pressBatchMobile, 10) || batchSizeDefault)
    : batchSizeDefault;
  const mobileQuery = window.matchMedia('(max-width: 679px)');

  function getBatchSize() {
    if (container.dataset.pressBatchMobile && mobileQuery.matches) {
      return batchSizeMobile;
    }
    return batchSizeDefault;
  }

  const sorted = [...PRESS_ITEMS].sort((a, b) => b.sort.localeCompare(a.sort));
  let activeCategory = 'all';
  let visibleCount = getBatchSize();

  let inner = container.querySelector('.press-grid__inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'press-grid__inner';
    container.appendChild(inner);
  }

  function getFiltered() {
    let items = sorted;
    if (mode === 'preview') {
      items = sorted.filter(i => i.featured);
    }
    if (activeCategory === 'video-social') {
      items = items.filter(i => i.type === 'video' || i.type === 'social');
    } else if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    return items;
  }

  function renderShowMore(filteredLength) {
    const remaining = filteredLength - visibleCount;
    if (remaining <= 0) return '';
    const nextBatch = Math.min(getBatchSize(), remaining);
    return `
      <div class="press-grid__more">
        <button type="button" class="btn btn--secondary press-grid__more-btn" data-press-show-more>
          Show more (${nextBatch})
        </button>
      </div>`;
  }

  function render({ resetCount = false } = {}) {
    if (resetCount) visibleCount = getBatchSize();

    const filtered = getFiltered();
    const visible = filtered.slice(0, visibleCount);
    const cards = visible.length
      ? visible.map((item, i) => renderPressCard(item, i)).join('')
      : '<p class="press-grid__empty">No press coverage in this category yet.</p>';

    inner.innerHTML = `
      ${renderCategoryNav(activeCategory, showFilters)}
      <div class="media-room__grid press-grid__cards" role="list">${cards}</div>
      ${renderShowMore(filtered.length)}`;

    const grid = inner.querySelector('.press-grid__cards');
    if (grid) observeLazyCards(grid);
  }

  render();

  container.addEventListener('click', e => {
    if (!(e.target instanceof Element)) return;

    const btn = e.target.closest('[data-press-category]');
    if (btn instanceof HTMLButtonElement) {
      const cat = btn.dataset.pressCategory;
      if (!cat || cat === activeCategory) return;
      activeCategory = cat;
      requestAnimationFrame(() => render({ resetCount: true }));
      return;
    }

    const moreBtn = e.target.closest('[data-press-show-more]');
    if (moreBtn instanceof HTMLButtonElement) {
      visibleCount += getBatchSize();
      requestAnimationFrame(render);
    }
  });

  if (container.dataset.pressBatchMobile) {
    mobileQuery.addEventListener('change', () => {
      requestAnimationFrame(() => render({ resetCount: true }));
    });
  }
}
