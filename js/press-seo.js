/**
 * press-seo.js — SEO / AI metadata for the In the Press library.
 * Injects JSON-LD and provides enhanced alt/title text for press cards.
 */

import { getPressItems } from './media-locale.js';
import { absoluteUrl, getSiteOrigin, isMsSubpage, pressPageUrl } from './site-config.js';

/** @typedef {import('./press-data.js').PressItem} PressItem */

const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const LAWYER_NAME = 'Datuk Rajpal Singh';

const SEO_KEYWORDS_EN = [
  'criminal lawyer Malaysia',
  'criminal defence lawyer Kuala Lumpur',
  'criminal defense lawyer Malaysia',
  'Malaysia criminal lawyer',
  'Rajpal Singh lawyer',
  'criminal lawyer Selangor',
  'press coverage criminal lawyer Malaysia',
  'KK Mart lawyer Malaysia',
].join(', ');

const SEO_KEYWORDS_MS = [
  'peguam jenayah Malaysia',
  'peguam pembelaan jenayah Kuala Lumpur',
  'peguam jenayah Malaysia',
  'Rajpal Singh peguam',
  'peguam jenayah Selangor',
  'liputan media peguam jenayah Malaysia',
  'peguam KK Mart Malaysia',
].join(', ');

function seoKeywords() {
  return isMsSubpage() ? SEO_KEYWORDS_MS : SEO_KEYWORDS_EN;
}

/**
 * @param {PressItem} item
 */
function buildSeoMeta(item) {
  const ms = isMsSubpage();
  const alt = ms
    ? `${item.title} — ${LAWYER_NAME}, peguam jenayah Malaysia (${item.publisher})`
    : `${item.title} — ${LAWYER_NAME}, criminal lawyer Malaysia (${item.publisher})`;
  const title = ms
    ? `${item.title} | ${LAWYER_NAME} — Peguam Jenayah Malaysia`
    : `${item.title} | ${LAWYER_NAME} — Criminal Lawyer Malaysia`;
  let description = item.excerpt;

  if (!ms && !/\b(criminal lawyer|criminal defence|criminal defense|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
    description = `Malaysian criminal lawyer press coverage: ${description}`;
  }
  if (ms && !/\b(peguam|jenayah|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
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
 * @param {PressItem} item
 */
function pressSchemaPart(item) {
  const ms = isMsSubpage();
  const meta = getPressSeoMeta(item);
  const image = pressImageUrl(item);

  /** @type {Record<string, unknown>} */
  const part = {
    '@type': item.type === 'video' ? 'VideoObject' : 'NewsArticle',
    '@id': `${item.url}#press-ref`,
    headline: item.title,
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
      name: LAWYER_NAME,
      jobTitle: ms ? 'Peguam Jenayah' : 'Criminal Lawyer',
      worksFor: {
        '@type': 'LegalService',
        name: FIRM_NAME,
        url: getSiteOrigin(),
      },
    },
    keywords: seoKeywords(),
  };

  if (image) part.image = image;
  if (item.type === 'video' && item.youtubeId) {
    part.embedUrl = item.url;
    part.uploadDate = meta.datePublished;
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
      ? 'Dalam Media — Datuk Rajpal Singh, Peguam Jenayah Malaysia'
      : 'In the Press — Datuk Rajpal Singh, Criminal Lawyer Malaysia',
    description: ms
      ? 'Liputan media, siaran, dan dalam talian memaparkan Datuk Rajpal Singh, peguam pembelaan jenayah terkemuka di Kuala Lumpur dan Selangor, Malaysia.'
      : 'Press, broadcast, and online coverage featuring Datuk Rajpal Singh, a leading criminal defence lawyer in Kuala Lumpur and Selangor, Malaysia.',
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
 */
export function initPressSeo() {
  const grid = document.getElementById('press-grid');
  if (!grid || document.getElementById('press-jsonld')) return;

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
