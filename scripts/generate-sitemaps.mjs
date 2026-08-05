/**
 * Generates sitemap.xml, sitemap-images.xml, crawl fallbacks, and static JSON-LD for Media Room.
 * Run: node scripts/generate-sitemaps.mjs
 * Replace SITE_ORIGIN before deploying to production.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLIPPINGS } from '../js/clippings-data.js';
import { CLIPPINGS_MS } from '../js/clippings-data-ms.js';
import { PRESS_ITEMS } from '../js/press-data.js';
import { INSIGHTS } from '../js/insights-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {string} */
const SITE_ORIGIN = 'https://rfvlegal.com';

const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const LAWYER_NAME = 'Dato\' Rajpal Singh';

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function escXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function headlineFromFile(file) {
  return file
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function clippingSeoTitle(file, ms = false) {
  const headline = headlineFromFile(file);
  return ms
    ? `${headline} — ${LAWYER_NAME}, peguam jenayah Malaysia`
    : `${headline} — ${LAWYER_NAME}, criminal lawyer Malaysia`;
}

function clippingSeoAlt(description, ms = false) {
  if (ms) {
    if (/\b(peguam|jenayah|Malaysia)\b/i.test(description)) return description;
    return `Keratan akhbar peguam jenayah Malaysia: ${description}`;
  }
  if (/\b(criminal lawyer|criminal defence|criminal defense|Malaysia)\b/i.test(description)) return description;
  return `Malaysian criminal lawyer press clipping: ${description}`;
}

function clippingSeoCaption(description, ms = false) {
  return clippingSeoAlt(description, ms);
}

function pressSeoTitle(item, ms = false) {
  return ms
    ? `${item.title} — ${LAWYER_NAME}, peguam jenayah Malaysia`
    : `${item.title} — ${LAWYER_NAME}, criminal lawyer Malaysia`;
}

function pressSeoCaption(item, ms = false) {
  if (ms) {
    if (/\b(peguam|jenayah|Malaysia|Kuala Lumpur|Selangor)\b/i.test(item.excerpt)) return item.excerpt;
    return `Liputan media peguam jenayah Malaysia: ${item.excerpt}`;
  }
  if (/\b(criminal lawyer|Malaysia|Kuala Lumpur|Selangor)\b/i.test(item.excerpt)) return item.excerpt;
  return `Malaysian criminal lawyer press coverage: ${item.excerpt}`;
}

function pressImageLoc(item) {
  if (item.thumb && !item.thumb.endsWith('.svg')) {
    return `${SITE_ORIGIN}/${item.thumb.replace(/^\//, '')}`;
  }
  if (item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  return null;
}

function buildPressNoscript(items, heading) {
  const sorted = [...items].sort((a, b) => b.sort.localeCompare(a.sort));
  const links = sorted.map(item => `
      <li>
        <a href="${escHtml(item.url)}">${escHtml(item.title)}</a>
        <span> — ${escHtml(item.publisher)}, ${escHtml(item.sort.slice(0, 10))}. ${escHtml(item.excerpt)}</span>
      </li>`).join('');

  return `<noscript class="press-grid__noscript">
          <h4 class="press-grid__noscript-title">${escHtml(heading)}</h4>
          <ul class="press-grid__noscript-list">${links}
          </ul>
        </noscript>`;
}

/**
 * Static HTML fallback for crawlers without JavaScript (Google Images, AI indexers).
 * @param {import('../js/clippings-data.js').Clipping[]} clippings
 * @param {string} heading
 * @param {{ limit?: number, ms?: boolean }} [opts]
 */
function buildClippingsNoscript(clippings, heading, opts = {}) {
  const { limit, ms = false } = opts;
  const sorted = [...clippings].sort((a, b) => b.sort.localeCompare(a.sort));
  const items = limit ? sorted.slice(0, limit) : sorted;
  const list = items.map(c => {
    const imageUrl = `${SITE_ORIGIN}/assets/media/newspaper-clippings/${c.file}`;
    const title = clippingSeoTitle(c.file, ms);
    const alt = clippingSeoAlt(c.description, ms);
    const date = c.dateLabel || c.sort.slice(0, 10);
    return `
      <li class="clippings-gallery__noscript-item">
        <figure>
          <a href="${escHtml(imageUrl)}" title="${escHtml(title)}">
            <img src="${escHtml(imageUrl)}" alt="${escHtml(alt)}" title="${escHtml(title)}" width="320" height="240" loading="lazy" decoding="async">
          </a>
          <figcaption>${escHtml(date)} — ${escHtml(c.description)}</figcaption>
        </figure>
      </li>`;
  }).join('');

  return `<noscript class="clippings-gallery__noscript">
          <h4 class="clippings-gallery__noscript-title">${escHtml(heading)}</h4>
          <ul class="clippings-gallery__noscript-list">${list}
          </ul>
        </noscript>`;
}

/**
 * @param {import('../js/clippings-data.js').Clipping[]} clippings
 * @param {boolean} ms
 */
function buildClippingsJsonLd(clippings, ms) {
  const pageUrl = ms ? `${SITE_ORIGIN}/ms/media/#clippings` : `${SITE_ORIGIN}/media/#clippings`;
  const sorted = [...clippings].sort((a, b) => b.sort.localeCompare(a.sort));

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${pageUrl}#clippings-collection`,
    name: ms
      ? 'Arkib Keratan Akhbar — Peguam Jenayah Malaysia'
      : 'Newspaper Clippings Library — Criminal Lawyer Malaysia Press Archive',
    description: ms
      ? 'Arkib keratan akhbar dan media Malaysia memaparkan Dato\' Rajpal Singh, peguam pembelaan jenayah terkemuka di Kuala Lumpur dan Selangor.'
      : 'Archived Malaysian newspaper and press clippings featuring Dato\' Rajpal Singh, a leading criminal defence lawyer in Kuala Lumpur and Selangor.',
    url: pageUrl,
    inLanguage: ms ? 'ms-MY' : 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: `${SITE_ORIGIN}/`,
    },
    about: [
      { '@type': 'Thing', name: ms ? 'Peguam jenayah Malaysia' : 'Criminal lawyer Malaysia' },
      { '@type': 'Person', name: LAWYER_NAME, jobTitle: ms ? 'Peguam Jenayah' : 'Criminal Lawyer' },
      { '@type': 'LegalService', name: FIRM_NAME },
    ],
    numberOfItems: sorted.length,
    associatedMedia: sorted.map(c => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE_ORIGIN}/assets/media/newspaper-clippings/${c.file}`,
      name: clippingSeoTitle(c.file, ms),
      caption: clippingSeoCaption(c.description, ms),
      datePublished: c.sort.slice(0, 10),
    })),
  };
}

/**
 * @param {import('../js/press-data.js').PressItem[]} items
 * @param {boolean} ms
 */
function buildPressJsonLd(items, ms) {
  const pageUrl = ms ? `${SITE_ORIGIN}/ms/media/#press` : `${SITE_ORIGIN}/media/#press`;
  const sorted = [...items].sort((a, b) => b.sort.localeCompare(a.sort));

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
    inLanguage: ms ? 'ms-MY' : 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: `${SITE_ORIGIN}/`,
    },
    about: [
      { '@type': 'Thing', name: ms ? 'Peguam jenayah Malaysia' : 'Criminal lawyer Malaysia' },
      {
        '@type': 'Person',
        name: LAWYER_NAME,
        jobTitle: ms ? 'Peguam Jenayah' : 'Criminal Lawyer',
      },
      { '@type': 'LegalService', name: FIRM_NAME },
    ],
    numberOfItems: sorted.length,
    hasPart: sorted.map(item => {
      /** @type {Record<string, unknown>} */
      const part = {
        '@type': item.type === 'video' ? 'VideoObject' : 'NewsArticle',
        headline: item.title,
        description: pressSeoCaption(item, ms),
        url: item.url,
        datePublished: item.sort.slice(0, 10),
        publisher: { '@type': 'Organization', name: item.publisher },
        mentions: {
          '@type': 'Person',
          name: LAWYER_NAME,
          jobTitle: ms ? 'Peguam Jenayah' : 'Criminal Lawyer',
          worksFor: { '@type': 'LegalService', name: FIRM_NAME, url: `${SITE_ORIGIN}/` },
        },
      };
      const image = pressImageLoc(item);
      if (image) part.image = image;
      if (item.type === 'video' && item.youtubeId) {
        part.embedUrl = item.url;
        part.uploadDate = item.sort.slice(0, 10);
      }
      return part;
    }),
  };
}

function buildMediaJsonLdScripts(clippings, pressItems, ms) {
  const clippingsLd = JSON.stringify(buildClippingsJsonLd(clippings, ms), null, 2);
  const pressLd = JSON.stringify(buildPressJsonLd(pressItems, ms), null, 2);
  return `
  <script type="application/ld+json" id="clippings-jsonld">
${clippingsLd}
  </script>
  <script type="application/ld+json" id="press-jsonld">
${pressLd}
  </script>`;
}

function replaceBetweenMarkers(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Markers not found: ${startMarker}`);
  }
  return html.slice(0, start + startMarker.length) + replacement + html.slice(end);
}

const featuredPress = PRESS_ITEMS.filter(item => item.featured);

const pages = [
  { loc: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/#press`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/#clippings`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${SITE_ORIGIN}/media/#firm-insights`, priority: '0.85', changefreq: 'weekly' },
  ...INSIGHTS.flatMap(item => [
    { loc: `${SITE_ORIGIN}/insights/${item.id}/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_ORIGIN}/ms/insights/${item.id}/`, priority: '0.8', changefreq: 'monthly' },
  ]),
  { loc: `${SITE_ORIGIN}/ms/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/ms/media/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/ms/media/#press`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/ms/media/#clippings`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${SITE_ORIGIN}/ms/media/#firm-insights`, priority: '0.85', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/legal/privacy-policy/`, priority: '0.5', changefreq: 'yearly' },
  { loc: `${SITE_ORIGIN}/legal/terms-of-use/`, priority: '0.5', changefreq: 'yearly' },
  { loc: `${SITE_ORIGIN}/ms/legal/dasar-privasi/`, priority: '0.5', changefreq: 'yearly' },
  { loc: `${SITE_ORIGIN}/ms/legal/terma-penggunaan/`, priority: '0.5', changefreq: 'yearly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${escXml(p.loc)}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

function clippingImageEntry(c, pageLoc) {
  const imageLoc = `${SITE_ORIGIN}/assets/media/newspaper-clippings/${c.file}`;
  return `  <url>
    <loc>${escXml(pageLoc)}</loc>
    <image:image>
      <image:loc>${escXml(imageLoc)}</image:loc>
      <image:title>${escXml(clippingSeoTitle(c.file))}</image:title>
      <image:caption>${escXml(clippingSeoCaption(c.description))}</image:caption>
    </image:image>
  </url>`;
}

const clippingImageEntries = CLIPPINGS.flatMap(c => [
  clippingImageEntry(c, `${SITE_ORIGIN}/media/#clippings`),
  clippingImageEntry(c, `${SITE_ORIGIN}/ms/media/#clippings`),
]);

const pressImageEntries = PRESS_ITEMS.flatMap(item => {
  const imageLoc = pressImageLoc(item);
  if (!imageLoc) return [];
  const entry = (pageLoc) => `  <url>
    <loc>${escXml(pageLoc)}</loc>
    <image:image>
      <image:loc>${escXml(imageLoc)}</image:loc>
      <image:title>${escXml(pressSeoTitle(item))}</image:title>
      <image:caption>${escXml(pressSeoCaption(item))}</image:caption>
    </image:image>
  </url>`;
  return [entry(`${SITE_ORIGIN}/media/#press`), entry(`${SITE_ORIGIN}/ms/media/#press`)];
});

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...clippingImageEntries, ...pressImageEntries].join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'sitemap-images.xml'), imageSitemap);

/** @param {string} relPath @param {{ clippingsHeading: string, clippings: typeof CLIPPINGS, clippingsLimit?: number, ms: boolean, pressHeading: string, pressItems: typeof PRESS_ITEMS, injectJsonLd?: boolean }} opts */
function patchMediaPage(relPath, opts) {
  let html = readFile(relPath);
  html = replaceBetweenMarkers(
    html,
    '<!-- press-noscript:start -->',
    '<!-- press-noscript:end -->',
    buildPressNoscript(opts.pressItems, opts.pressHeading),
  );
  html = replaceBetweenMarkers(
    html,
    '<!-- clippings-noscript:start -->',
    '<!-- clippings-noscript:end -->',
    buildClippingsNoscript(opts.clippings, opts.clippingsHeading, {
      limit: opts.clippingsLimit,
      ms: opts.ms,
    }),
  );
  if (opts.injectJsonLd !== false && html.includes('<!-- media-jsonld:start -->')) {
    html = replaceBetweenMarkers(
      html,
      '<!-- media-jsonld:start -->',
      '<!-- media-jsonld:end -->',
      buildMediaJsonLdScripts(opts.clippings, opts.pressItems, opts.ms),
    );
  }
  fs.writeFileSync(path.join(root, relPath), html);
}

patchMediaPage('index.html', {
  ms: false,
  injectJsonLd: false,
  pressItems: featuredPress,
  pressHeading: 'Featured press coverage — Dato\' Rajpal Singh, criminal lawyer Malaysia',
  clippings: CLIPPINGS,
  clippingsHeading: 'Newspaper clippings — Dato\' Rajpal Singh, criminal lawyer Malaysia',
  clippingsLimit: 12,
});

patchMediaPage('media/index.html', {
  ms: false,
  pressItems: PRESS_ITEMS,
  pressHeading: 'Press coverage archive — Dato\' Rajpal Singh, criminal lawyer Malaysia',
  clippings: CLIPPINGS,
  clippingsHeading: 'Newspaper clippings archive — Dato\' Rajpal Singh, criminal lawyer Malaysia',
});

patchMediaPage('ms/index.html', {
  ms: true,
  injectJsonLd: false,
  pressItems: featuredPress,
  pressHeading: 'Liputan media terpilih — Dato\' Rajpal Singh, peguam jenayah Malaysia',
  clippings: CLIPPINGS_MS,
  clippingsHeading: 'Keratan akhbar — Dato\' Rajpal Singh, peguam jenayah Malaysia',
  clippingsLimit: 12,
});

patchMediaPage('ms/media/index.html', {
  ms: true,
  pressItems: PRESS_ITEMS,
  pressHeading: 'Arkib liputan media — Dato\' Rajpal Singh, peguam jenayah Malaysia',
  clippings: CLIPPINGS_MS,
  clippingsHeading: 'Arkib keratan akhbar — Dato\' Rajpal Singh, peguam jenayah Malaysia',
});

console.log(`Wrote sitemap.xml (${pages.length} URLs)`);
console.log(`Wrote sitemap-images.xml (${clippingImageEntries.length + pressImageEntries.length} image entries)`);
console.log(`Updated press noscript: ${featuredPress.length} featured, ${PRESS_ITEMS.length} full archive`);
console.log(`Updated clippings noscript: ${CLIPPINGS.length} clippings (12 on homepage preview)`);
console.log(`Injected static JSON-LD on media pages (${CLIPPINGS.length} clippings + ${PRESS_ITEMS.length} press items)`);
