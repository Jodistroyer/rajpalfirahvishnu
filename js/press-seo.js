/**
 * press-seo.js — SEO / AI metadata for the In the Press library.
 * Injects JSON-LD and provides enhanced alt/title text for press cards.
 */

import { PRESS_ITEMS } from './press-data.js';
import { absoluteUrl, getSiteOrigin, pressPageUrl } from './site-config.js';

/** @typedef {import('./press-data.js').PressItem} PressItem */

const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const LAWYER_NAME = 'Datuk Rajpal Singh';
const SEO_KEYWORDS = [
  'criminal lawyer Malaysia',
  'criminal defence lawyer Kuala Lumpur',
  'criminal defense lawyer Malaysia',
  'Malaysia criminal lawyer',
  'Rajpal Singh lawyer',
  'criminal lawyer Selangor',
  'press coverage criminal lawyer Malaysia',
  'KK Mart lawyer Malaysia',
].join(', ');

/** @type {Map<string, ReturnType<typeof buildSeoMeta>>} */
const seoMetaCache = new Map();

/**
 * @param {PressItem} item
 */
function buildSeoMeta(item) {
  const alt = `${item.title} — ${LAWYER_NAME}, criminal lawyer Malaysia (${item.publisher})`;
  const title = `${item.title} | ${LAWYER_NAME} — Criminal Lawyer Malaysia`;
  let description = item.excerpt;

  if (!/\b(criminal lawyer|criminal defence|criminal defense|Malaysia|Kuala Lumpur|Selangor)\b/i.test(description)) {
    description = `Malaysian criminal lawyer press coverage: ${description}`;
  }

  return {
    alt,
    title,
    description,
    datePublished: item.sort.slice(0, 10),
    keywords: SEO_KEYWORDS,
  };
}

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
    inLanguage: 'en-MY',
    publisher: {
      '@type': 'Organization',
      name: item.publisher,
    },
    mentions: {
      '@type': 'Person',
      name: LAWYER_NAME,
      jobTitle: 'Criminal Lawyer',
      worksFor: {
        '@type': 'LegalService',
        name: FIRM_NAME,
        url: getSiteOrigin(),
      },
    },
    keywords: SEO_KEYWORDS,
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

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#press-collection`,
    name: 'In the Press — Datuk Rajpal Singh, Criminal Lawyer Malaysia',
    description:
      'Press, broadcast, and online coverage featuring Datuk Rajpal Singh, ' +
      'a leading criminal defence lawyer in Kuala Lumpur and Selangor, Malaysia.',
    url: pageUrl,
    inLanguage: 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: getSiteOrigin(),
    },
    about: [
      { '@type': 'Thing', name: 'Criminal lawyer Malaysia' },
      {
        '@type': 'Person',
        name: LAWYER_NAME,
        jobTitle: 'Criminal Lawyer',
        knowsAbout: ['Criminal law', 'Criminal defence', 'Malaysia'],
      },
      { '@type': 'LegalService', name: FIRM_NAME },
    ],
    keywords: SEO_KEYWORDS,
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
    script.textContent = JSON.stringify(buildPressJsonLd(PRESS_ITEMS));
    document.head.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(inject, { timeout: 3000 });
  } else {
    setTimeout(inject, 1500);
  }
}
