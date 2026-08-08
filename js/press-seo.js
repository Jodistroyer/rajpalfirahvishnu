/**
 * press-seo.js — SEO / AI metadata for the In the Press library.
 * Injects JSON-LD and provides enhanced alt/title text for press cards.
 */

import { getPressItems } from './media-locale.js';
import { absoluteUrl, getSiteOrigin, isMsSubpage, pressPageUrl } from './site-config.js';

/** @typedef {import('./press-data.js').PressItem} PressItem */

const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const LAWYER_NAME = 'Dato\' Rajpal Singh';

/** @type {Record<string, { name: string, jobTitleEn: string, jobTitleMs: string, keywordsEn: string, keywordsMs: string }>} */
const COUNSEL = {
  'rajpal-singh': {
    name: 'Dato\' Rajpal Singh',
    jobTitleEn: 'Criminal Lawyer',
    jobTitleMs: 'Peguam Jenayah',
    keywordsEn: 'criminal lawyer Malaysia, criminal defence lawyer Kuala Lumpur, Rajpal Singh lawyer',
    keywordsMs: 'peguam jenayah Malaysia, peguam pembelaan jenayah Kuala Lumpur, Rajpal Singh peguam',
  },
  'vishnu-kumar': {
    name: 'Vishnu Kumar',
    jobTitleEn: 'Civil Litigation Lawyer',
    jobTitleMs: 'Peguam Litigasi Sivil',
    keywordsEn: 'civil litigation lawyer Malaysia, civil lawyer Kuala Lumpur, Vishnu Kumar lawyer',
    keywordsMs: 'peguam litigasi sivil Malaysia, peguam sivil Kuala Lumpur, Vishnu Kumar peguam',
  },
  'siti-anis': {
    name: 'Siti Anis Che Ab Wahab',
    jobTitleEn: 'Criminal Lawyer',
    jobTitleMs: 'Peguam Jenayah',
    keywordsEn: 'criminal lawyer Malaysia, criminal defence lawyer Kuala Lumpur, Siti Anis lawyer',
    keywordsMs: 'peguam jenayah Malaysia, peguam pembelaan jenayah Kuala Lumpur, Siti Anis peguam',
  },
};

const SEO_KEYWORDS_EN = [
  'criminal lawyer Malaysia',
  'civil litigation lawyer Malaysia',
  'criminal defence lawyer Kuala Lumpur',
  'criminal defense lawyer Malaysia',
  'Malaysia criminal lawyer',
  'Rajpal Singh lawyer',
  'Vishnu Kumar lawyer',
  'Siti Anis lawyer',
  'criminal lawyer Selangor',
  'press coverage lawyer Malaysia',
  'KK Mart lawyer Malaysia',
].join(', ');

const SEO_KEYWORDS_MS = [
  'peguam jenayah Malaysia',
  'peguam litigasi sivil Malaysia',
  'peguam pembelaan jenayah Kuala Lumpur',
  'peguam jenayah Malaysia',
  'Rajpal Singh peguam',
  'Vishnu Kumar peguam',
  'Siti Anis peguam',
  'peguam jenayah Selangor',
  'liputan media peguam Malaysia',
  'peguam KK Mart Malaysia',
].join(', ');

/** @param {import('./press-data.js').PressItem} item */
function getCounselMeta(item) {
  return COUNSEL[item.counsel || 'rajpal-singh'];
}

/** @param {import('./press-data.js').PressItem} item */
export function getPressItemCounsel(item) {
  return item.counsel || 'rajpal-singh';
}

/** @returns {{ id: string, label: string }[]} */
export function getPressCounselFilters() {
  return Object.entries(COUNSEL).map(([id, meta]) => ({ id, label: meta.name }));
}

function seoKeywords() {
  return isMsSubpage() ? SEO_KEYWORDS_MS : SEO_KEYWORDS_EN;
}

/**
 * @param {PressItem} item
 */
function buildSeoMeta(item) {
  const ms = isMsSubpage();
  const counsel = getCounselMeta(item);
  const alt = ms
    ? `${item.title} — ${counsel.name}, ${counsel.jobTitleMs.toLowerCase()} (${item.publisher})`
    : `${item.title} — ${counsel.name}, ${counsel.jobTitleEn.toLowerCase()} (${item.publisher})`;
  const title = ms
    ? `${item.title} | ${counsel.name} — ${counsel.jobTitleMs}`
    : `${item.title} | ${counsel.name} — ${counsel.jobTitleEn}`;
  let description = item.excerpt;

  if (!ms && item.counsel === 'vishnu-kumar') {
    if (!/\b(civil litigation|lawyer|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
      description = `Malaysian civil litigation press coverage: ${description}`;
    }
  } else if (!ms && item.counsel === 'siti-anis') {
    if (!/\b(criminal lawyer|criminal defence|criminal defense|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
      description = `Malaysian criminal lawyer press coverage: ${description}`;
    }
  } else if (!ms && !/\b(criminal lawyer|criminal defence|criminal defense|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
    description = `Malaysian criminal lawyer press coverage: ${description}`;
  }
  if (ms && item.counsel === 'vishnu-kumar') {
    if (!/\b(peguam|litigasi|sivil|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
      description = `Liputan media peguam litigasi sivil Malaysia: ${description}`;
    }
  } else if (ms && item.counsel === 'siti-anis') {
    if (!/\b(peguam|jenayah|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
      description = `Liputan media peguam jenayah Malaysia: ${description}`;
    }
  } else if (ms && !/\b(peguam|jenayah|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
    description = `Liputan media peguam jenayah Malaysia: ${description}`;
  }

  return {
    alt,
    title,
    description,
    datePublished: item.sort.slice(0, 10),
    keywords: seoKeywords(),
  };
}

/** @type {Map<string, ReturnType<typeof buildSeoMeta>>} */
const seoMetaCache = new Map();

/**
 * @param {PressItem} item
 */
export function getPressSeoMeta(item) {
  const cached = seoMetaCache.get(item.id);
  if (cached) return cached;
  const meta = buildSeoMeta(item);
  seoMetaCache.set(item.id, meta);
  return meta;
}

/**
 * @param {PressItem} item
 */
function pressImageUrl(item) {
  if (item.thumb && !item.thumb.endsWith('.svg')) {
    return absoluteUrl(item.thumb);
  }
  if (item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  return undefined;
}

/**
 * Convert a date-only string like "2026-07-29" into an ISO 8601 datetime
 * with timezone so Google accepts it as a valid schema.org dateTime.
 */
function schemaUploadDate(datePublished) {
  if (!datePublished) return undefined;
  if (datePublished.includes('T')) return datePublished; // already datetime
  // Site pages use en-MY/ms-MY; "T00:00:00+08:00" keeps an explicit timezone.
  return `${datePublished}T00:00:00+08:00`;
}

/**
 * @param {PressItem} item
 */
function pressSchemaPart(item) {
  const ms = isMsSubpage();
  const meta = getPressSeoMeta(item);
  const counsel = getCounselMeta(item);
  const image = pressImageUrl(item);

  /** @type {Record<string, unknown>} */
  const part = {
    '@type': item.type === 'video' ? 'VideoObject' : 'NewsArticle',
    '@id': `${item.url}#press-ref`,
    headline: item.title,
    // Search Console requires "name" for VideoObject.
    name: item.type === 'video' ? item.title : undefined,
    description: meta.description,
    url: item.url,
    datePublished: meta.datePublished,
    inLanguage: isMsSubpage() ? 'ms-MY' : 'en-MY',
    publisher: {
      '@type': 'Organization',
      name: item.publisher,
    },
    mentions: {
      '@type': 'Person',
      name: counsel.name,
      jobTitle: ms ? counsel.jobTitleMs : counsel.jobTitleEn,
      worksFor: {
        '@type': 'LegalService',
        name: FIRM_NAME,
        url: getSiteOrigin(),
      },
    },
    keywords: seoKeywords(),
    // Search Console requires "thumbnailUrl" for VideoObject.
    thumbnailUrl: item.type === 'video' ? image : undefined,
  };

  if (image) part.image = image;
  if (item.type === 'video' && item.youtubeId) {
    part.embedUrl = item.url;
    part.uploadDate = schemaUploadDate(meta.datePublished);
  }

  return part;
}

/**
 * @param {PressItem[]} items
 */
export function buildPressJsonLd(items) {
  const pageUrl = pressPageUrl();
  const sorted = [...items].sort((a, b) => b.sort.localeCompare(a.sort));

  const ms = isMsSubpage();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#press-collection`,
    name: ms
      ? 'Dalam Media — Dato\' Rajpal Singh, Peguam Jenayah Malaysia'
      : 'In the Press — Dato\' Rajpal Singh, Criminal Lawyer Malaysia',
    description: ms
      ? 'Liputan media, siaran, dan dalam talian memaparkan Dato\' Rajpal Singh, peguam pembelaan jenayah terkemuka di Kuala Lumpur dan Selangor, Malaysia.'
      : 'Press, broadcast, and online coverage featuring Dato\' Rajpal Singh, a leading criminal defence lawyer in Kuala Lumpur and Selangor, Malaysia.',
    url: pageUrl,
    inLanguage: isMsSubpage() ? 'ms-MY' : 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: getSiteOrigin(),
    },
    about: ms
      ? [
          { '@type': 'Thing', name: 'Peguam jenayah Malaysia' },
          {
            '@type': 'Person',
            name: LAWYER_NAME,
            jobTitle: 'Peguam Jenayah',
            knowsAbout: ['Undang-undang jenayah', 'Pembelaan jenayah', 'Malaysia'],
          },
          { '@type': 'LegalService', name: FIRM_NAME },
        ]
      : [
          { '@type': 'Thing', name: 'Criminal lawyer Malaysia' },
          {
            '@type': 'Person',
            name: LAWYER_NAME,
            jobTitle: 'Criminal Lawyer',
            knowsAbout: ['Criminal law', 'Criminal defence', 'Malaysia'],
          },
          { '@type': 'LegalService', name: FIRM_NAME },
        ],
    keywords: seoKeywords(),
    numberOfItems: sorted.length,
    hasPart: sorted.map(pressSchemaPart),
  };
}

/**
 * Inject structured data during idle time (non-blocking).
 * Homepage previews skip this — VideoObject/NewsArticle JSON-LD belongs on /media/
 * only (static #press-jsonld). Injecting it on / made Search Console flag 7 invalid videos.
 */
export function initPressSeo() {
  const grid = document.getElementById('press-grid');
  if (!grid || document.getElementById('press-jsonld')) return;
  if (grid.dataset.pressMode === 'preview') return;

  const inject = () => {
    const script = document.createElement('script');
    script.id = 'press-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildPressJsonLd(getPressItems()));
    document.head.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(inject, { timeout: 3000 });
  } else {
    setTimeout(inject, 1500);
  }
}
