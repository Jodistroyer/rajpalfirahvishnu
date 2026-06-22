/**
 * Generates sitemap.xml and sitemap-images.xml for Google Search / Google Images.
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

const dataPath = path.join(root, 'js', 'clippings-data.js');
const raw = fs.readFileSync(dataPath, 'utf8');

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

function escXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function seoTitle(file, description) {
  const headline = file
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return `${headline} — Datuk Rajpal Singh, criminal lawyer Malaysia`;
}

function seoCaption(description) {
  if (/\b(criminal lawyer|Malaysia)\b/i.test(description)) return description;
  return `Malaysian criminal lawyer press clipping: ${description}`;
}

const pages = [
  { loc: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE_ORIGIN}/media/#clippings`, priority: '0.9', changefreq: 'monthly' },
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

const imageEntries = clippings.map(c => {
  const imageLoc = `${SITE_ORIGIN}/assets/media/newspaper-clippings/${c.file}`;
  const title = seoTitle(c.file, c.description);
  const caption = seoCaption(c.description);
  return `  <url>
    <loc>${escXml(`${SITE_ORIGIN}/media/#clippings`)}</loc>
    <image:image>
      <image:loc>${escXml(imageLoc)}</image:loc>
      <image:title>${escXml(title)}</image:title>
      <image:caption>${escXml(caption)}</image:caption>
    </image:image>
  </url>`;
}).join('\n');

const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'sitemap-images.xml'), imageSitemap);

console.log(`Wrote sitemap.xml (${pages.length} URLs)`);
console.log(`Wrote sitemap-images.xml (${clippings.length} images)`);
