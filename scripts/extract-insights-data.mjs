/**
 * One-time / maintenance extractor: reads Firm Insights cards from HTML
 * and writes js/insights-data.js (source of truth for generate-insights-seo.mjs).
 * Run: node scripts/extract-insights-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @param {string} title */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @param {string} html
 * @returns {object[]}
 */
function parseInsightCards(html) {
  const gridStart = html.indexOf('<div id="firm-insights"');
  const gridEnd = html.indexOf('</div>\n\n        \n      </div>\n    </section>', gridStart);
  const section = gridStart === -1 ? html : html.slice(gridStart, gridEnd === -1 ? undefined : gridEnd);

  /** @type {object[]} */
  const items = [];
  const articleRe = /<article class="media-card[^"]*"([\s\S]*?)<\/article>/g;
  let match;

  while ((match = articleRe.exec(section)) !== null) {
    const block = match[0];
    const attrs = match[1];

    const get = (name) => {
      const re = new RegExp(`data-${name}="([\\s\\S]*?)"`, 'i');
      const m = block.match(re);
      return m ? m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : '';
    };

    const title = get('title');
    const excerptMatch = block.match(/<p class="media-card__excerpt">\s*([\s\S]*?)\s*<\/p>/);
    const excerpt = excerptMatch
      ? excerptMatch[1].replace(/\s+/g, ' ').trim()
      : '';
    const datetimeMatch = block.match(/datetime="([^"]+)"/);

    items.push({
      category: get('category'),
      dateLabel: get('date'),
      sort: datetimeMatch ? datetimeMatch[1] : get('date'),
      title,
      author: get('author'),
      authorTitle: get('author-title'),
      excerpt,
      content: get('content'),
    });
  }

  return items;
}

const enCards = parseInsightCards(fs.readFileSync(path.join(root, 'media/index.html'), 'utf8'));
const msCards = parseInsightCards(fs.readFileSync(path.join(root, 'ms/media/index.html'), 'utf8'));

if (enCards.length !== msCards.length) {
  throw new Error(`EN/MS insight count mismatch: ${enCards.length} vs ${msCards.length}`);
}

const insights = enCards.map((en, i) => {
  const ms = msCards[i];
  const id = slugify(en.title);
  return {
    id,
    authorSlug: en.author === 'Vishnu Kumar' ? 'vishnu-kumar' : 'rajpal-singh',
    keywords: {
      en: inferKeywords(en),
      ms: inferKeywords(ms),
    },
    en,
    ms,
  };
});

/** @param {{ title: string, category: string, excerpt: string }} item */
function inferKeywords(item) {
  const base = [
    'Malaysia lawyer',
    'Kuala Lumpur lawyer',
    'Rajpal Firah Vishnu',
    item.category,
    item.author || 'Vishnu Kumar',
  ];
  const text = `${item.title} ${item.excerpt}`.toLowerCase();
  if (/mediat/i.test(text)) base.push('mediation Malaysia', 'dispute resolution Malaysia');
  if (/contract/i.test(text)) base.push('contract law Malaysia', 'void contract Malaysia');
  if (/director|fiduciar|compan/i.test(text)) base.push('director duties Malaysia', 'company law Malaysia', 'shareholder dispute');
  if (/appeal|civil/i.test(text)) base.push('civil appeal Malaysia', 'Court of Appeal Malaysia');
  return [...new Set(base)].join(', ');
}

function escJs(s) {
  return JSON.stringify(s);
}

const out = `/**
 * Firm Insights articles — source of truth for article pages and media cards.
 * Regenerate pages: node scripts/generate-insights-seo.mjs
 * Re-extract from HTML: node scripts/extract-insights-data.mjs
 */

/** @typedef {{ category: string, dateLabel: string, sort: string, title: string, author: string, authorTitle: string, excerpt: string, content: string }} InsightLocale */

/** @typedef {{ id: string, authorSlug: string, keywords: { en: string, ms: string }, en: InsightLocale, ms: InsightLocale }} InsightItem */

/** @type {InsightItem[]} */
export const INSIGHTS = ${JSON.stringify(insights, null, 2)};
`;

fs.writeFileSync(path.join(root, 'js/insights-data.js'), out);
console.log(`Wrote js/insights-data.js (${insights.length} articles)`);
for (const item of insights) {
  console.log(`  - ${item.id}`);
}
