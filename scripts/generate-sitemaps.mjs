/**
 * Generates sitemap.xml, sitemap-images.xml, and press noscript crawl fallbacks.
 * Run: node scripts/generate-sitemaps.mjs
 * Replace SITE_ORIGIN before deploying to production.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {string} */
const SITE_ORIGIN = 'https://[yourdomain]';

const LAWYER_NAME = 'Dato\' Rajpal Singh';

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function parseClippings(raw) {
  /** @type {{ file: string, sort: string, description: string }[]} */
  const clippings = [];
  const entryRe = /file:\s*'([^']+)'[\s\S]*?sort:\s*'([^']+)'[\s\S]*?description:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = entryRe.exec(raw)) !== null) {
    clippings.push({
      file: m[1],
      sort: m[2],
      description: m[3].replace(/\\'/g, "'"),
    });
  }
  return clippings;
}

function parsePressItems(raw) {
  const block = raw.match(/export const PRESS_ITEMS = \[([\s\S]*?)\];/)?.[1];
  if (!block) return [];

  /** @type {{ id: string, url: string, title: string, excerpt: string, publisher: string, sort: string, featured?: boolean, thumb?: string, youtubeId?: string }[]} */
  const items = [];
  const re = /\{\s*id:\s*'([^']+)'([\s\S]*?)\n  \},/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const body = m[0];
    const get = key => body.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] || '';
    items.push({
      id: m[1],
      url: get('url'),
      title: get('title'),
      excerpt: get('excerpt'),
      publisher: get('publisher'),
      sort: get('sort'),
      featured: /featured:\s*true/.test(body),
      thumb: get('thumb') || undefined,
      youtubeId: get('youtubeId') || undefined,
    });
  }
  return items;
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

function clippingSeoTitle(file) {
  const headline = file
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return `${headline} — ${LAWYER_NAME}, criminal lawyer Malaysia`;
}

function clippingSeoCaption(description) {
  if (/\b(criminal lawyer|Malaysia)\b/i.test(description)) return description;
  return `Malaysian criminal lawyer press clipping: ${description}`;
}

function pressSeoTitle(item) {
  return `${item.title} — ${LAWYER_NAME}, criminal lawyer Malaysia`;
}

function pressSeoCaption(item) {
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

function replaceBetweenMarkers(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Markers not found: ${startMarker}`);
  }
  return html.slice(0, start + startMarker.length) + replacement + html.slice(end);
}

const clippings = parseClippings(readFile('js/clippings-data.js'));
const pressItems = parsePressItems(readFile('js/press-data.js'));
const featuredPress = pressItems.filter(item => item.featured);

const pages = [
  { loc: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/#press`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/#clippings`, priority: '0.9', changefreq: 'monthly' },
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

const clippingImageEntries = clippings.map(c => {
  const imageLoc = `${SITE_ORIGIN}/assets/media/newspaper-clippings/${c.file}`;
  return `  <url>
    <loc>${escXml(`${SITE_ORIGIN}/media/#clippings`)}</loc>
    <image:image>
      <image:loc>${escXml(imageLoc)}</image:loc>
      <image:title>${escXml(clippingSeoTitle(c.file))}</image:title>
      <image:caption>${escXml(clippingSeoCaption(c.description))}</image:caption>
    </image:image>
  </url>`;
});

const pressImageEntries = pressItems.flatMap(item => {
  const imageLoc = pressImageLoc(item);
  if (!imageLoc) return [];
  return [`  <url>
    <loc>${escXml(`${SITE_ORIGIN}/media/#press`)}</loc>
    <image:image>
      <image:loc>${escXml(imageLoc)}</image:loc>
      <image:title>${escXml(pressSeoTitle(item))}</image:title>
      <image:caption>${escXml(pressSeoCaption(item))}</image:caption>
    </image:image>
  </url>`];
});

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...clippingImageEntries, ...pressImageEntries].join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'sitemap-images.xml'), imageSitemap);

const indexHtml = replaceBetweenMarkers(
  readFile('index.html'),
  '<!-- press-noscript:start -->',
  '<!-- press-noscript:end -->',
  buildPressNoscript(featuredPress, 'Featured press coverage — Dato\' Rajpal Singh, criminal lawyer Malaysia'),
);
fs.writeFileSync(path.join(root, 'index.html'), indexHtml);

const mediaHtml = replaceBetweenMarkers(
  readFile('media/index.html'),
  '<!-- press-noscript:start -->',
  '<!-- press-noscript:end -->',
  buildPressNoscript(pressItems, 'Press coverage archive — Dato\' Rajpal Singh, criminal lawyer Malaysia'),
);
fs.writeFileSync(path.join(root, 'media/index.html'), mediaHtml);

console.log(`Wrote sitemap.xml (${pages.length} URLs)`);
console.log(`Wrote sitemap-images.xml (${clippings.length + pressImageEntries.length} images)`);
console.log(`Updated press noscript: ${featuredPress.length} featured, ${pressItems.length} full archive`);
