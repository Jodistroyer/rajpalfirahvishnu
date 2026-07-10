/**
 * clippings-seo.js — SEO / AI / Google Images metadata for newspaper clippings.
 * Injects JSON-LD and enhances image alt/title text for criminal-lawyer Malaysia queries.
 */

import { absoluteUrl, clippingsAssetBase, clippingsPageUrl, getSiteOrigin, isMsSubpage } from './site-config.js';

/** @typedef {import('./clippings-data.js').Clipping} Clipping */

const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const LAWYER_NAME = 'Datuk Rajpal Singh';
const SEO_KEYWORDS = [
  'criminal lawyer Malaysia',
  'criminal defence lawyer Kuala Lumpur',
  'criminal defense lawyer Malaysia',
  'Malaysia criminal lawyer',
  'Rajpal Singh lawyer',
  'criminal lawyer Selangor',
  'murder trial lawyer Malaysia',
  'drug trafficking lawyer Malaysia',
].join(', ');

const SEO_KEYWORDS_MS = [
  'peguam jenayah Malaysia',
  'peguam pembelaan jenayah Kuala Lumpur',
  'peguam jenayah Malaysia',
  'Rajpal Singh peguam',
  'peguam jenayah Selangor',
  'perbicaraan bunuh peguam Malaysia',
  'pengedaran dadah peguam Malaysia',
].join(', ');

const seoMetaCache = new Map();

/**
 * @param {string} file
 */
export function headlineFromFile(file) {
  return file
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

/**
 * @param {Clipping} clipping
 */
function buildSeoMeta(clipping) {
  const ms = isMsSubpage();
  const headline = clipping.headline || headlineFromFile(clipping.file);
  const name = ms
    ? `${headline} — ${LAWYER_NAME}, peguam jenayah Malaysia`
    : `${headline} — ${LAWYER_NAME}, criminal lawyer Malaysia`;
  let alt = clipping.description;

  if (!ms && !/\b(criminal lawyer|criminal defence|criminal defense|defence lawyer|defense lawyer|Malaysia)\b/i.test(alt)) {
    alt = `Malaysian criminal lawyer press clipping: ${alt}`;
  }
  if (ms && !/\b(peguam|jenayah|Malaysia)\b/i.test(alt)) {
    alt = `Keratan akhbar peguam jenayah Malaysia: ${alt}`;
  }

  return {
    name,
    alt,
    title: ms
      ? `${headline} | ${LAWYER_NAME} — Peguam Jenayah Malaysia`
      : `${headline} | ${LAWYER_NAME} — Criminal Lawyer Malaysia`,
    caption: clipping.description,
    datePublished: clipping.sort.slice(0, 10),
    keywords: ms ? SEO_KEYWORDS_MS : SEO_KEYWORDS,
  };
}

/**
 * @param {Clipping} clipping
 */
export function getClippingSeoMeta(clipping) {
  const cached = seoMetaCache.get(clipping.file);
  if (cached) return cached;
  const meta = buildSeoMeta(clipping);
  seoMetaCache.set(clipping.file, meta);
  return meta;
}

/**
 * Lightweight JSON-LD — summary only; full image URLs live in sitemap-images.xml.
 * @param {Clipping[]} clippings
 */
export function buildClippingsJsonLd(clippings) {
  const pageUrl = clippingsPageUrl();
  const ms = isMsSubpage();
  const sample = [...clippings]
    .sort((a, b) => b.sort.localeCompare(a.sort))
    .slice(0, 8);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#clippings-collection`,
    name: ms
      ? 'Arkib Keratan Akhbar — Peguam Jenayah Malaysia'
      : 'Newspaper Clippings Library — Criminal Lawyer Malaysia Press Archive',
    description: ms
      ? 'Arkib keratan akhbar dan media Malaysia memaparkan Datuk Rajpal Singh, peguam pembelaan jenayah terkemuka di Kuala Lumpur dan Selangor.'
      : 'Archived Malaysian newspaper and press clippings featuring Datuk Rajpal Singh, a leading criminal defence lawyer in Kuala Lumpur and Selangor.',
    url: pageUrl,
    inLanguage: ms ? 'ms-MY' : 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: getSiteOrigin(),
    },
    about: ms
      ? [
          { '@type': 'Thing', name: 'Peguam jenayah Malaysia' },
          { '@type': 'Person', name: LAWYER_NAME, jobTitle: 'Peguam Jenayah' },
          { '@type': 'LegalService', name: FIRM_NAME },
        ]
      : [
          { '@type': 'Thing', name: 'Criminal lawyer Malaysia' },
          { '@type': 'Person', name: LAWYER_NAME, jobTitle: 'Criminal Lawyer' },
          { '@type': 'LegalService', name: FIRM_NAME },
        ],
    keywords: ms ? SEO_KEYWORDS_MS : SEO_KEYWORDS,
    numberOfItems: clippings.length,
    image: sample.map(c => {
      const meta = getClippingSeoMeta(c);
      const imagePath = `${clippingsAssetBase()}${c.file}`.replace(/^\.\.\//, '');
      return {
        '@type': 'ImageObject',
        contentUrl: absoluteUrl(imagePath),
        name: meta.name,
        caption: meta.caption,
      };
    }),
  };
}

/**
 * Inject structured data during idle time (non-blocking).
 */
export function initClippingsSeo() {
  const gallery = document.getElementById('clippings-gallery') || document.getElementById('clippings');
  if (!gallery || document.getElementById('clippings-jsonld')) return;

  const inject = async () => {
    const { loadClippingsData } = await import('./clippings-data-loader.js');
    const { CLIPPINGS } = await loadClippingsData();
    const script = document.createElement('script');
    script.id = 'clippings-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildClippingsJsonLd(CLIPPINGS));
    document.head.appendChild(script);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => { inject(); }, { timeout: 3000 });
  } else {
    setTimeout(inject, 1500);
  }
}
