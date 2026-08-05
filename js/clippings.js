/**
 * clippings.js — Newspaper clippings collage gallery for the Media Room.
 * Full mode: chronological stream, sticky year rail, batched scroll + Show more.
 */

import { openModal } from './modal.js';
import { getClippingSeoMeta } from './clippings-seo.js';
import { loadClippingsData } from './clippings-data-loader.js';
import { siteAssetUrl, getSiteBasePath, isMsSubpage } from './site-config.js';

function archiveYearLabel() {
  return isMsSubpage() ? 'Arkib' : 'Archive';
}
/** Concurrent thumb activations — thumbs are small, so a higher batch is fine. */
const IMAGE_LOAD_BATCH = 6;
/** Cards appended per scroll / Show more step. */
const DEFAULT_BATCH = 12;
/** Prefetch thumbs slightly before they enter the viewport. */
const IMAGE_ROOT_MARGIN = '200px 0px';
/** Start the next batch before the sentinel is fully on screen. */
const SENTINEL_ROOT_MARGIN = '280px 0px';

/** @type {IntersectionObserver | null} */
let imageObserver = null;

/** @type {HTMLImageElement[]} */
const imageLoadQueue = [];

/** @type {boolean} */
let drainingImageQueue = false;

/** @type {[string, import('./clippings-data.js').Clipping[]][] | null} */
let cachedYearGroups = null;

/** Collage uses small JPEGs; full scans load only in the lightbox. */
function getThumbPath(file) {
  const stem = file.replace(/\.[^.]+$/, '');
  return `thumbs/${stem}.jpg`;
}

/** @param {string} file */
function getFullSrc(file) {
  return siteAssetUrl(`assets/media/newspaper-clippings/${file}`);
}

/** @param {string} file */
function getThumbSrc(file) {
  return siteAssetUrl(`assets/media/newspaper-clippings/${getThumbPath(file)}`);
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
  return year < 2004 ? archiveYearLabel() : String(year);
}

/**
 * @param {import('./clippings-data.js').Clipping[]} items
 * @returns {[string, import('./clippings-data.js').Clipping[]][]}
 */
function groupByYear(items) {
  if (cachedYearGroups) return cachedYearGroups;

  /** @type {Map<string, import('./clippings-data.js').Clipping[]>} */
  const groups = new Map();
  const sorted = [...items].sort((a, b) => b.sort.localeCompare(a.sort));

  for (const item of sorted) {
    const year = yearFromSort(item.sort);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(item);
  }

  cachedYearGroups = [...groups.entries()].sort(([a], [b]) => {
    const archive = archiveYearLabel();
    if (a === archive) return 1;
    if (b === archive) return -1;
    return Number(b) - Number(a);
  });

  return cachedYearGroups;
}

/**
 * @param {HTMLImageElement} img
 */
function activateImage(img) {
  if (!img.dataset.src) return;
  const src = img.dataset.src;
  img.removeAttribute('data-src');

  const reveal = () => {
    img.classList.remove('clipping-card__img--pending');
    // Next frame so the opacity transition always runs after paint.
    requestAnimationFrame(() => img.classList.add('loaded'));
  };

  img.addEventListener('load', reveal, { once: true });
  img.addEventListener('error', reveal, { once: true });
  img.src = src;
  if (img.complete) reveal();
}

function drainImageQueue() {
  if (drainingImageQueue || !imageLoadQueue.length) return;
  drainingImageQueue = true;

  requestAnimationFrame(() => {
    const batch = imageLoadQueue.splice(0, IMAGE_LOAD_BATCH);
    batch.forEach(activateImage);
    drainingImageQueue = false;
    if (imageLoadQueue.length) {
      // Short yield — thumbs are light; keep scroll responsive without starving the queue.
      setTimeout(drainImageQueue, 16);
    }
  });
}

/**
 * @param {import('./clippings-data.js').Clipping} clipping
 * @param {number} index
 * @param {string} [yearStart]
 */
function renderClippingCard(clipping, index, yearStart) {
  const thumbSrc = getThumbSrc(clipping.file);
  const seo = getClippingSeoMeta(clipping);
  const spanClass = index % 5 === 0 ? ' clipping-card--tall' : index % 3 === 0 ? ' clipping-card--wide' : '';
  const yearAttrs = yearStart
    ? ` data-year-start="${escHtml(yearStart)}"`
    : '';

  return `
    <button type="button"
            class="clipping-card clipping-card--enter${spanClass}"
            data-clipping-file="${escHtml(clipping.file)}"
            ${yearAttrs}
            aria-label="${escHtml(seo.title)}">
      <figure class="clipping-card__figure">
        <img class="clipping-card__img clipping-card__img--pending"
             data-src="${escHtml(thumbSrc)}"
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
 * @param {string} year
 */
function yearSlug(year) {
  return year === archiveYearLabel() ? 'archive' : year;
}

/**
 * Observe newly added images only (does not reset the queue).
 * @param {ParentNode} root
 */
function observeNewClippingImages(root) {
  const images = [...root.querySelectorAll('img[data-src]')];
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    images.forEach(img => {
      imageLoadQueue.push(img);
    });
    drainImageQueue();
    return;
  }

  if (!imageObserver) {
    imageObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = /** @type {HTMLImageElement} */ (entry.target);
        obs.unobserve(img);
        imageLoadQueue.push(img);
      });
      drainImageQueue();
    }, { rootMargin: IMAGE_ROOT_MARGIN, threshold: 0.01 });
  }

  images.forEach(img => imageObserver.observe(img));
}

/**
 * Open lightbox: show the already-cached thumb immediately, then swap in the full scan.
 * @param {import('./clippings-data.js').Clipping} clipping
 */
function openClippingModal(clipping) {
  const fullSrc = getFullSrc(clipping.file);
  const thumbSrc = getThumbSrc(clipping.file);
  const seo = getClippingSeoMeta(clipping);
  const linkHtml = clipping.link
    ? `<a href="${escHtml(clipping.link)}" class="clipping-modal__link" target="_blank" rel="noopener noreferrer">${isMsSubpage() ? 'Dokumen berkaitan' : 'Related document'} <span aria-hidden="true">↗</span></a>`
    : '';

  const closeLabel = isMsSubpage() ? 'Tutup pemapar keratan akhbar' : 'Close clipping viewer';

  const html = `
    <div class="modal__body modal__body--clipping">
      <button class="modal__close" aria-label="${escHtml(closeLabel)}">&times;</button>
      <figure class="clipping-modal">
        <div class="clipping-modal__image-wrap clipping-modal__image-wrap--loading">
          <img class="clipping-modal__img clipping-modal__img--thumb"
               src="${escHtml(thumbSrc)}"
               alt=""
               aria-hidden="true"
               decoding="async">
          <img class="clipping-modal__img clipping-modal__img--full"
               data-src="${escHtml(fullSrc)}"
               alt="${escHtml(seo.alt)}"
               title="${escHtml(seo.title)}"
               decoding="async">
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

  // Full scan loads only after open — never during collage scroll.
  const wrap = dialog?.querySelector('.clipping-modal__image-wrap');
  const fullImg = dialog?.querySelector('.clipping-modal__img--full');
  if (!(fullImg instanceof HTMLImageElement) || !(wrap instanceof HTMLElement)) return;

  const src = fullImg.dataset.src;
  if (!src) return;

  const finish = () => {
    fullImg.classList.add('is-ready');
    wrap.classList.remove('clipping-modal__image-wrap--loading');
    wrap.classList.add('clipping-modal__image-wrap--ready');
  };

  fullImg.addEventListener('load', finish, { once: true });
  fullImg.addEventListener('error', () => {
    // Keep the thumb visible if the full file fails.
    wrap.classList.remove('clipping-modal__image-wrap--loading');
  }, { once: true });

  fullImg.src = src;
  fullImg.removeAttribute('data-src');
  if (fullImg.complete && fullImg.naturalWidth) finish();
}

/**
 * Stagger enter animation on freshly appended cards.
 * @param {HTMLElement[]} cards
 */
function playEnterAnimation(cards) {
  cards.forEach((card, i) => {
    card.style.setProperty('--clipping-enter-delay', `${Math.min(i, 8) * 40}ms`);
    requestAnimationFrame(() => card.classList.add('is-visible'));
  });
}

/**
 * @param {number} total
 */
function updateViewAllCta(total) {
  const cta = document.getElementById('clippings-view-all-cta');
  if (cta) {
    cta.textContent = isMsSubpage()
      ? `Lihat Semua (${total}) →`
      : `View All (${total}) →`;
  }
}

/** @param {string} sort */
function sortYear(sort) {
  return parseInt(sort.slice(0, 4), 10);
}

/** @returns {{ cols: number, rowH: number, gap: number }} */
function getMosaicLayout() {
  const w = window.innerWidth;
  if (w >= 1200) return { cols: 5, rowH: 140, gap: 8 };
  if (w >= 900) return { cols: 4, rowH: 140, gap: 8 };
  if (w >= 600) return { cols: 3, rowH: 130, gap: 8 };
  return { cols: 2, rowH: 120, gap: 8 };
}

/**
 * Tall/wide collage spans add rows beyond a simple cols division.
 * @param {number} cardCount
 * @param {{ cols: number, rowH: number, gap: number }} layout
 */
function estimateMosaicHeight(cardCount, layout) {
  if (cardCount <= 0) return 120;

  const baseRows = Math.ceil(cardCount / layout.cols);
  const rows = Math.ceil(baseRows * 1.25);
  const mosaicH = rows * layout.rowH + Math.max(0, rows - 1) * layout.gap;
  const footer = 80;
  return mosaicH + footer;
}

/**
 * @param {HTMLElement} container
 * @param {import('./clippings-data.js').Clipping[]} CLIPPINGS
 */
function getPreviewInitialCount(container, CLIPPINGS) {
  const isDesktop = window.matchMedia('(min-width: 900px)').matches;
  const previewLimit = Math.max(1, parseInt(container.dataset.clippingsLimit || '8', 10) || 8);
  const minYear = parseInt(container.dataset.clippingsDesktopYear || '2020', 10) || 2020;

  const yearGroups = groupByYear(CLIPPINGS);
  let allItems = yearGroups.flatMap(([, items]) => items);

  if (isDesktop) {
    allItems = allItems.filter(item => sortYear(item.sort) >= minYear);
    return allItems.length;
  }

  return Math.min(previewLimit, allItems.length);
}

/**
 * Reserve vertical space for the homepage preview gallery before cards mount.
 * Keeps #contact anchor position stable during smooth scroll.
 * @param {HTMLElement} container
 * @param {import('./clippings-data.js').Clipping[]} CLIPPINGS
 */
export function reservePreviewGalleryHeight(container, CLIPPINGS) {
  if (container.dataset.clippingsMode !== 'preview') return;
  if (container.dataset.clippingsReady === 'true') return;

  const count = getPreviewInitialCount(container, CLIPPINGS);
  const height = estimateMosaicHeight(count, getMosaicLayout());

  container.style.setProperty('--clippings-gallery-reserve', `${height}px`);
  container.style.minHeight = `${height}px`;
}

/** @param {HTMLElement} container */
function clearGallerySkeleton(container) {
  container.querySelector('.clippings-gallery__skeleton')?.remove();
}

/**
 * @param {import('./clippings-data.js').Clipping[]} items
 * @param {number} minYear
 */
function filterItemsFromYear(items, minYear) {
  return items.filter(item => sortYear(item.sort) >= minYear);
}

/**
 * Shared mosaic gallery: year rail + one continuous card grid.
 * @param {HTMLElement} container
 * @param {import('./clippings-data.js').Clipping[]} CLIPPINGS
 * @param {{
 *   batchSize: number,
 *   initialCount?: number,
 *   autoScrollLoad?: boolean,
 *   viewAllHref?: string | null,
 *   maxCount?: number,
 *   minYear?: number,
 *   totalArchiveCount?: number,
 * }} opts
 */
function initMosaicGallery(container, CLIPPINGS, opts) {
  const batchSize = opts.batchSize;
  const autoScrollLoad = opts.autoScrollLoad ?? true;
  const viewAllHref = opts.viewAllHref ?? null;
  const totalArchive = opts.totalArchiveCount ?? CLIPPINGS.length;

  if (container.dataset.clippingsMode === 'preview') {
    reservePreviewGalleryHeight(container, CLIPPINGS);
  }
  clearGallerySkeleton(container);

  const yearGroups = groupByYear(CLIPPINGS);
  /** Newest-first flat list */
  let allItems = yearGroups.flatMap(([, items]) => items);
  if (opts.minYear) {
    allItems = filterItemsFromYear(allItems, opts.minYear);
  }

  const maxCount = Math.min(opts.maxCount ?? allItems.length, allItems.length);
  const initialCount = opts.initialCount ?? (opts.minYear ? allItems.length : batchSize);
  const byFile = new Map(CLIPPINGS.map(c => [c.file, c]));

  let renderedCount = 0;
  let loadingBatch = false;
  /** @type {IntersectionObserver | null} */
  let sentinelObserver = null;
  /** Global card index for collage span pattern */
  let cardIndex = 0;

  let inner = container.querySelector('.clippings-gallery__inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'clippings-gallery__inner';
    container.appendChild(inner);
  }

  inner.innerHTML = `
    <div class="clippings-stream" id="clippings-stream" aria-live="polite">
      <div class="clippings-mosaic" id="clippings-mosaic">
        <div class="clippings-year-rail" id="clippings-year-rail" aria-hidden="true"></div>
        <div class="clippings-collage clippings-collage--unified" id="clippings-collage" role="list"></div>
      </div>
      <div class="clippings-stream__footer">
        <div class="clippings-sentinel" id="clippings-sentinel" aria-hidden="true"></div>
        <div class="clippings-more" id="clippings-more" hidden></div>
      </div>
    </div>`;

  const mosaic = /** @type {HTMLElement} */ (inner.querySelector('#clippings-mosaic'));
  const yearRail = /** @type {HTMLElement} */ (inner.querySelector('#clippings-year-rail'));
  const collage = /** @type {HTMLElement} */ (inner.querySelector('#clippings-collage'));
  const moreWrap = /** @type {HTMLElement} */ (inner.querySelector('#clippings-more'));
  const sentinel = /** @type {HTMLElement} */ (inner.querySelector('#clippings-sentinel'));

  /** @type {Set<string>} */
  const placedYears = new Set();

  /** @type {Map<string, HTMLElement>} */
  const yearMarks = new Map();

  function syncYearRail() {
    const mosaicTop = mosaic.getBoundingClientRect().top + window.scrollY;
    const MIN_LABEL_GAP = 8;

    /** @type {{ mark: HTMLElement, naturalTop: number }[]} */
    const entries = [];

    yearMarks.forEach((mark, year) => {
      const firstCard = collage.querySelector(`[data-year-start="${CSS.escape(year)}"]`);
      if (!(firstCard instanceof HTMLElement)) return;
      const naturalTop = firstCard.getBoundingClientRect().top + window.scrollY - mosaicTop;
      entries.push({ mark, naturalTop: Math.max(0, naturalTop) });
    });

    entries.sort((a, b) => a.naturalTop - b.naturalTop);

    let prevBottom = -MIN_LABEL_GAP;
    for (const { mark, naturalTop } of entries) {
      const height = mark.offsetHeight || 18;
      const top = Math.max(naturalTop, prevBottom + MIN_LABEL_GAP);
      mark.style.top = `${top}px`;
      prevBottom = top + height;
    }

    yearRail.style.minHeight = `${collage.offsetHeight}px`;
  }

  function updateFooter() {
    const remaining = maxCount - renderedCount;
    const hasMore = remaining > 0;

    if (autoScrollLoad) sentinel.hidden = !hasMore;
    else sentinel.hidden = true;

    if (hasMore) {
      const next = Math.min(batchSize, remaining);
      const showMoreLabel = isMsSubpage()
        ? `Tunjuk lagi (${next})`
        : `Show more (${next})`;
      moreWrap.hidden = false;
      moreWrap.innerHTML = `
        <button type="button" class="btn btn--secondary clippings-more__btn" data-clippings-show-more>
          ${showMoreLabel}
        </button>`;
      return;
    }

    if (viewAllHref) {
      moreWrap.hidden = false;
      const viewAllLabel = isMsSubpage()
        ? `Lihat Semua (${totalArchive}) →`
        : `View All (${totalArchive}) →`;
      const enAttrs = '';
      moreWrap.innerHTML = `
        <a href="${escHtml(viewAllHref)}" class="btn btn--secondary clippings-more__btn"${enAttrs}>
          ${viewAllLabel}
        </a>`;
      return;
    }

    moreWrap.innerHTML = allItems.length
      ? `<p class="clippings-more__done">${isMsSubpage() ? `Semua ${totalArchive} keratan akhbar dimuatkan` : `All ${totalArchive} clippings loaded`}</p>`
      : '';
    moreWrap.hidden = !allItems.length;
  }

  /**
   * @param {string} year
   */
  function ensureYearMark(year) {
    if (placedYears.has(year)) return;
    placedYears.add(year);

    const mark = document.createElement('span');
    mark.className = 'clippings-year-rail__mark';
    mark.dataset.clippingYear = year;
    mark.id = `clippings-year-${yearSlug(year)}`;
    mark.textContent = year;
    yearRail.appendChild(mark);
    yearMarks.set(year, mark);
  }

  /**
   * @param {number} [count]
   */
  function appendBatch(count = batchSize) {
    if (loadingBatch || renderedCount >= maxCount) return false;
    loadingBatch = true;

    const take = Math.min(count, maxCount - renderedCount, allItems.length - renderedCount);
    const slice = allItems.slice(renderedCount, renderedCount + take);
    /** @type {HTMLElement[]} */
    const newCards = [];
    const frag = document.createDocumentFragment();

    slice.forEach(item => {
      const year = yearFromSort(item.sort);
      const isYearStart = !placedYears.has(year);
      if (isYearStart) ensureYearMark(year);

      const wrap = document.createElement('div');
      wrap.innerHTML = renderClippingCard(item, cardIndex++, isYearStart ? year : undefined).trim();
      const card = /** @type {HTMLElement} */ (wrap.firstElementChild);
      frag.appendChild(card);
      newCards.push(card);
    });

    collage.appendChild(frag);
    renderedCount += slice.length;
    updateFooter();
    observeNewClippingImages(collage);
    playEnterAnimation(newCards);

    requestAnimationFrame(() => {
      syncYearRail();
      loadingBatch = false;
      container.style.minHeight = '';
    });
    return true;
  }

  function setupObservers() {
    if (!autoScrollLoad || !('IntersectionObserver' in window)) return;

    sentinelObserver = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;

      // Ignore when the sentinel sits in the upper viewport — typical after a
      // hash jump to #firm-insights (below this gallery). Auto-load should only
      // run while the user is scrolling down through the collage.
      const top = sentinel.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.4) return;

      appendBatch();
    }, { rootMargin: SENTINEL_ROOT_MARGIN, threshold: 0 });

    sentinelObserver.observe(sentinel);
  }

  appendBatch(initialCount);
  setupObservers();
  container.classList.remove('clippings-gallery--loading');

  collage.addEventListener('load', e => {
    if (e.target instanceof HTMLImageElement && e.target.classList.contains('clipping-card__img')) {
      syncYearRail();
    }
  }, true);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => syncYearRail());
    ro.observe(collage);
  } else {
    window.addEventListener('resize', syncYearRail);
  }

  container.addEventListener('click', e => {
    if (!(e.target instanceof Element)) return;

    const moreBtn = e.target.closest('[data-clippings-show-more]');
    if (moreBtn instanceof HTMLButtonElement) {
      appendBatch();
      return;
    }

    const card = e.target.closest('.clipping-card');
    if (!card) return;
    const clipping = byFile.get(card.dataset.clippingFile || '');
    if (clipping) openClippingModal(clipping);
  });
}

/**
 * Full archive on /media/.
 * @param {HTMLElement} container
 * @param {import('./clippings-data.js').Clipping[]} CLIPPINGS
 * @param {number} batchSize
 */
function initFullStream(container, CLIPPINGS, batchSize) {
  initMosaicGallery(container, CLIPPINGS, {
    batchSize,
    autoScrollLoad: true,
  });
}

/**
 * Homepage preview: mosaic layout; desktop shows through minYear, mobile uses Show more.
 * @param {HTMLElement} container
 * @param {import('./clippings-data.js').Clipping[]} CLIPPINGS
 * @param {number} initialCount
 * @param {number} batchSize
 * @param {number} maxCount
 */
function initPreview(container, CLIPPINGS, initialCount, batchSize, maxCount) {
  const desktopMq = window.matchMedia('(min-width: 900px)');
  const minYear = parseInt(container.dataset.clippingsDesktopYear || '2020', 10) || 2020;
  const isDesktop = desktopMq.matches;

  initMosaicGallery(container, CLIPPINGS, {
    batchSize,
    initialCount: isDesktop ? undefined : initialCount,
    maxCount: isDesktop ? undefined : maxCount,
    minYear: isDesktop ? minYear : undefined,
    autoScrollLoad: false,
    viewAllHref: isMsSubpage()
      ? `${getSiteBasePath()}ms/media/#clippings-library`
      : `${getSiteBasePath()}media/#clippings`,
    totalArchiveCount: CLIPPINGS.length,
  });
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
  updateViewAllCta(CLIPPINGS.length);

  const mode = container.dataset.clippingsMode === 'preview' ? 'preview' : 'full';
  const previewLimit = Math.max(1, parseInt(container.dataset.clippingsLimit || '8', 10) || 8);
  const batchSize = Math.max(4, parseInt(container.dataset.clippingsBatch || String(DEFAULT_BATCH), 10) || DEFAULT_BATCH);

  if (mode === 'preview') {
    const previewBatch = Math.max(1, parseInt(container.dataset.clippingsBatch || String(previewLimit), 10) || previewLimit);
    const previewMax = Math.max(previewLimit, parseInt(container.dataset.clippingsMax || '24', 10) || 24);
    initPreview(container, CLIPPINGS, previewLimit, previewBatch, previewMax);
  } else {
    initFullStream(container, CLIPPINGS, batchSize);
  }
}
