/**
 * Generates Firm Insights article pages, media cards, JSON-LD, noscript, and sitemap entries.
 * Run: node scripts/generate-insights-seo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INSIGHTS } from '../js/insights-data.js';
import { formatArticleContent, escHtml } from '../js/insights-format.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SITE_ORIGIN = 'https://rfvlegal.com';
const FIRM_NAME = 'Rajpal, Firah & Vishnu';
const CONSULTATION_URL = 'https://forms.gle/AmrRiv3vucivaYid7';

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function writeFile(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function replaceBetweenMarkers(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Markers not found: ${startMarker}`);
  }
  return html.slice(0, start + startMarker.length) + replacement + html.slice(end);
}

function ensureMarkers(relPath) {
  let html = readFile(relPath);
  if (html.includes('<!-- insights-grid:start -->')) return;

  const firmIdx = html.indexOf('id="firm-insights"');
  if (firmIdx === -1) throw new Error(`firm-insights not found in ${relPath}`);

  const gridOpen = html.indexOf('<div class="media-room__grid">', firmIdx);
  if (gridOpen === -1) throw new Error(`firm-insights grid not found in ${relPath}`);

  const sectionEnd = html.indexOf('</section>', gridOpen);
  const gridSlice = html.slice(gridOpen, sectionEnd);
  const closeRel = gridSlice.search(/\n\s*<\/div>/);
  if (closeRel === -1) throw new Error(`firm-insights grid end not found in ${relPath}`);
  const gridClose = gridOpen + closeRel;

  html = `${html.slice(0, gridOpen)}<!-- insights-grid:start -->
<div class="media-room__grid">
<!-- insights-grid:end -->${html.slice(gridClose)}`;

  const insertAt = html.indexOf('<!-- insights-grid:end -->') + '<!-- insights-grid:end -->'.length;
  html = `${html.slice(0, insertAt)}\n        <!-- insights-noscript:start --><!-- insights-noscript:end -->${html.slice(insertAt)}`;

  writeFile(relPath, html);
  console.log(`Added insights markers to ${relPath}`);
}

function insightUrl(id, lang) {
  return lang === 'ms'
    ? `${SITE_ORIGIN}/ms/insights/${id}/`
    : `${SITE_ORIGIN}/insights/${id}/`;
}

function profileUrl(authorSlug, lang) {
  return lang === 'ms'
    ? `${SITE_ORIGIN}/ms/people/${authorSlug}/`
    : `${SITE_ORIGIN}/people/${authorSlug}/`;
}

function mediaRoomUrl(lang) {
  return lang === 'ms' ? `${SITE_ORIGIN}/ms/media/#firm-insights` : `${SITE_ORIGIN}/media/#firm-insights`;
}

function assetLinks(assetPrefix) {
  return `  <link rel="icon" type="image/png" href="${assetPrefix}assets/favicon-gold.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${assetPrefix}css/main.css">
  <link rel="stylesheet" href="${assetPrefix}css/layout.css">
  <link rel="stylesheet" href="${assetPrefix}css/components.css">
  <link rel="stylesheet" href="${assetPrefix}css/utilities.css">`;
}

/**
 * @param {import('../js/insights-data.js').InsightItem} item
 * @param {'en'|'ms'} lang
 */
function buildArticleJsonLd(item, lang) {
  const locale = item[lang];
  const url = insightUrl(item.id, lang);
  const authorUrl = profileUrl(item.authorSlug, lang);
  const inLanguage = lang === 'ms' ? 'ms-MY' : 'en-MY';
  const articleId = `${url}#article`;
  const webpageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url,
        name: locale.title,
        description: locale.excerpt,
        inLanguage,
        datePublished: locale.sort,
        dateModified: locale.sort,
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': articleId },
        isPartOf: {
          '@type': 'WebSite',
          name: FIRM_NAME,
          url: `${SITE_ORIGIN}/`,
        },
        publisher: {
          '@type': 'LegalService',
          name: FIRM_NAME,
          url: `${SITE_ORIGIN}/`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'ms' ? 'Laman Utama' : 'Home',
            item: lang === 'ms' ? `${SITE_ORIGIN}/ms/` : `${SITE_ORIGIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: lang === 'ms' ? 'Bilik Media' : 'Media Room',
            item: mediaRoomUrl(lang),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: locale.title,
            item: url,
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': articleId,
        headline: locale.title,
        description: locale.excerpt,
        articleSection: locale.category,
        datePublished: locale.sort,
        dateModified: locale.sort,
        inLanguage,
        keywords: item.keywords[lang],
        url,
        mainEntityOfPage: { '@id': webpageId },
        author: {
          '@type': 'Person',
          name: locale.author,
          url: authorUrl,
          worksFor: {
            '@type': 'LegalService',
            name: FIRM_NAME,
            url: `${SITE_ORIGIN}/`,
          },
        },
        publisher: {
          '@type': 'LegalService',
          name: FIRM_NAME,
          url: `${SITE_ORIGIN}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_ORIGIN}/assets/logo.png`,
          },
        },
        image: `${SITE_ORIGIN}/assets/og-image.jpg`,
        isPartOf: {
          '@type': 'CollectionPage',
          name: lang === 'ms' ? 'Wawasan Firma' : 'Firm Insights',
          url: mediaRoomUrl(lang),
        },
      },
    ],
  };
}

/**
 * Relative paths from generated article pages.
 * EN: insights/{id}/index.html
 * MS: ms/insights/{id}/index.html
 * @param {'en'|'ms'} lang
 */
function articlePagePaths(lang) {
  if (lang === 'ms') {
    return {
      assetPrefix: '../../../',
      peoplePrefix: '../../people/',
      home: '../../',
      mediaNav: '../../media/',
      backHref: '../../#firm-insights',
      servicesHash: '../../#perkhidmatan',
      peopleHash: '../../#pasukan',
      contactHash: '../../#hubungi',
      navServices: 'Bagaimana Kami Boleh Membantu',
      homeAria: `${FIRM_NAME} — Laman Utama`,
    };
  }
  return {
    assetPrefix: '../../',
    peoplePrefix: '../../people/',
    home: '../../',
    mediaNav: '../../media/',
    backHref: '../../#firm-insights',
    servicesHash: '../../#services',
    peopleHash: '../../#people',
    contactHash: '../../#contact',
    navServices: 'How We Can Help',
    homeAria: `${FIRM_NAME} — Home`,
  };
}

/**
 * @param {import('../js/insights-data.js').InsightItem} item
 * @param {'en'|'ms'} lang
 */
function buildArticlePage(item, lang) {
  const locale = item[lang];
  const paths = articlePagePaths(lang);
  const url = insightUrl(item.id, lang);
  const enUrl = insightUrl(item.id, 'en');
  const msUrl = insightUrl(item.id, 'ms');
  const authorHref = `${paths.peoplePrefix}${item.authorSlug}/`;
  const profilePath = authorHref;
  const body = formatArticleContent(locale.content, profilePath, { headingOffset: 1 });

  const pageTitle = lang === 'ms'
    ? `${locale.title} | Wawasan Firma | ${FIRM_NAME}`
    : `${locale.title} | Firm Insights | ${FIRM_NAME}`;
  const metaDescription = lang === 'ms'
    ? `${locale.excerpt} Oleh ${locale.author}, ${FIRM_NAME}, Kuala Lumpur.`
    : `${locale.excerpt} By ${locale.author}, ${FIRM_NAME}, Kuala Lumpur.`;
  const ogLocale = lang === 'ms' ? 'ms_MY' : 'en_MY';
  const backLabel = lang === 'ms' ? '← Kembali ke Wawasan Firma' : '← Back to Firm Insights';
  const byLabel = lang === 'ms' ? 'Oleh' : 'By';
  const ctaLabel = lang === 'ms' ? 'Tempah Perundingan' : 'Book a Consultation';
  const navPeople = lang === 'ms' ? 'Pasukan Kami' : 'Our People';
  const navMedia = lang === 'ms' ? 'Bilik Media' : 'Media Room';
  const navContact = lang === 'ms' ? 'Hubungi Kami' : 'Contact Us';
  const skipLink = lang === 'ms' ? 'Langkau ke kandungan utama' : 'Skip to main content';
  const ariaArticle = lang === 'ms' ? 'Artikel wawasan firma' : 'Firm insight article';
  const navAria = lang === 'ms' ? 'Navigasi utama' : 'Main navigation';
  const hamburgerAria = lang === 'ms' ? 'Buka menu navigasi' : 'Open navigation menu';

  return `<!DOCTYPE html>
<html lang="${lang === 'ms' ? 'ms' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(pageTitle)}</title>
  <meta name="description" content="${escHtml(metaDescription)}">
  <meta name="keywords" content="${escHtml(item.keywords[lang])}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="${escHtml(locale.author)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="ms" href="${msUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE_ORIGIN}/sitemap.xml">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="${ogLocale}">
  <meta property="og:site_name" content="${FIRM_NAME}">
  <meta property="og:title" content="${escHtml(locale.title)}">
  <meta property="og:description" content="${escHtml(metaDescription)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE_ORIGIN}/assets/og-image.jpg">
  <meta property="article:published_time" content="${locale.sort}">
  <meta property="article:modified_time" content="${locale.sort}">
  <meta property="article:author" content="${escHtml(locale.author)}">
  <meta property="article:section" content="${escHtml(locale.category)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escHtml(locale.title)}">
  <meta name="twitter:description" content="${escHtml(metaDescription)}">
  <meta name="twitter:image" content="${SITE_ORIGIN}/assets/og-image.jpg">
${assetLinks(paths.assetPrefix)}
  <script type="application/ld+json">
${JSON.stringify(buildArticleJsonLd(item, lang), null, 2)}
  </script>
</head>
<body>

  <a href="#main-content" class="skip-link">${skipLink}</a>

  <header id="navbar" class="navbar scrolled" role="banner">
    <div class="container">
      <div class="navbar__inner">
        <a href="${paths.home}" class="navbar__logo" aria-label="${paths.homeAria}">
          <img src="${paths.assetPrefix}assets/logo.png" alt="" width="36" height="36" class="navbar__logo-mark" aria-hidden="true">
          <span class="navbar__logo-text" style="color: var(--color-ink-900);">Rajpal, Firah <span class="amp">&amp;</span> Vishnu</span>
        </a>
        <nav aria-label="${navAria}" class="navbar__nav">
          <ul class="navbar__links" role="list">
            <li><a href="${paths.servicesHash}" class="navbar__link">${paths.navServices}</a></li>
            <li><a href="${paths.peopleHash}" class="navbar__link">${navPeople}</a></li>
            <li><a href="${paths.mediaNav}" class="navbar__link active">${navMedia}</a></li>
            <li><a href="${paths.contactHash}" class="navbar__link">${navContact}</a></li>
          </ul>
        </nav>
        <a href="${paths.contactHash}" class="btn btn--primary navbar__cta">${ctaLabel}</a>
        <button class="hamburger" id="hamburger-btn" aria-label="${hamburgerAria}" aria-expanded="false" aria-controls="nav-links">
          <span class="hamburger__line" style="background:var(--color-ink-900)"></span>
          <span class="hamburger__line" style="background:var(--color-ink-900)"></span>
          <span class="hamburger__line" style="background:var(--color-ink-900)"></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main-content" class="insight-article-page" style="padding-top: var(--nav-height);">
    <article class="insight-article section-pad" aria-label="${ariaArticle}">
      <div class="container container--narrow">
        <nav class="profile-page__toolbar" aria-label="Article navigation">
          <a href="${paths.backHref}" class="profile-page__back">${backLabel}</a>
        </nav>

        <header class="insight-article__header">
          <div class="media-card__meta">
            <span class="media-card__category">${escHtml(locale.category)}</span>
            <time class="media-card__date" datetime="${escHtml(locale.sort)}">${escHtml(locale.dateLabel)}</time>
          </div>
          <h1 class="insight-article__title">${escHtml(locale.title)}</h1>
          <p class="insight-article__author">${byLabel} <a href="${authorHref}">${escHtml(locale.author)}</a></p>
          <p class="insight-article__author-title">${escHtml(locale.authorTitle)}</p>
        </header>

        <div class="insight-article__body article-modal__content">
${body}
        </div>

        <footer class="insight-article__footer">
          <a href="${CONSULTATION_URL}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">${ctaLabel}</a>
        </footer>
      </div>
    </article>
  </main>

  <footer class="footer" role="contentinfo" style="padding-top: 0;">
    <div class="container">
      <div class="footer__cta-band" style="padding-top: 2.5rem;">
        <div>
          <p class="footer__cta-headline">${lang === 'ms' ? 'Perlukan Bantuan Guaman?' : 'Need Legal Assistance?'}</p>
          <p class="footer__cta-sub">${lang === 'ms' ? 'Tempah perundingan · Tiada obligasi' : 'Book a consultation · No obligation'}</p>
        </div>
        <a href="${paths.contactHash}" class="btn btn--primary btn--large">${ctaLabel}</a>
      </div>
      <div class="footer__divider"></div>
      <div class="footer__bottom">
        <p class="footer__legal">© 2026 ${FIRM_NAME}. ${lang === 'ms' ? 'Hak cipta terpelihara.' : 'All rights reserved.'}</p>
        <a href="${paths.home}" class="footer__legal-link">${lang === 'ms' ? '← Kembali ke Laman Utama' : '← Back to Home'}</a>
      </div>
    </div>
  </footer>

  <script type="module" src="${paths.assetPrefix}js/main.js"></script>
</body>
</html>
`;
}

/**
 * @param {import('../js/insights-data.js').InsightItem} item
 * @param {'en'|'ms'} lang
 * @param {string} hrefPrefix
 * @param {'home'|'media'} [listing]
 */
function buildInsightCard(item, lang, hrefPrefix, listing = 'home') {
  const locale = item[lang];
  const readMore = lang === 'ms' ? 'Baca Lagi' : 'Read More';
  const byLabel = lang === 'ms' ? 'Oleh' : 'By';
  const from = listing === 'media' ? 'insights-media' : 'insights';
  const href = `${hrefPrefix}insights/${item.id}/`;
  const aria = lang === 'ms'
    ? `Baca artikel penuh: ${locale.title}`
    : `Read full article: ${locale.title}`;

  return `
          <a href="${escHtml(href)}" data-from="${from}" class="media-card lazy media-card--insight" aria-label="${escHtml(aria)}">
            <div class="media-card__meta">
              <span class="media-card__category">${escHtml(locale.category)}</span>
              <time class="media-card__date" datetime="${escHtml(locale.sort)}">${escHtml(locale.dateLabel)}</time>
            </div>
            <h3 class="media-card__title">${escHtml(locale.title)}</h3>
            <p class="media-card__excerpt">
              ${escHtml(locale.excerpt)}
            </p>
            <footer class="media-card__footer">
              <span class="media-card__author">${byLabel} ${escHtml(locale.author)}</span>
              <span class="media-card__cta" aria-hidden="true">
                ${readMore} <span aria-hidden="true">→</span>
              </span>
            </footer>
          </a>`;
}

/**
 * @param {'en'|'ms'} lang
 * @param {string} hrefPrefix
 * @param {'home'|'media'} [listing]
 */
function buildInsightsGrid(lang, hrefPrefix, listing = 'home') {
  const sorted = [...INSIGHTS].sort((a, b) => b[lang].sort.localeCompare(a[lang].sort));
  return `\n${sorted.map(item => buildInsightCard(item, lang, hrefPrefix, listing)).join('\n')}\n        `;
}

function buildInsightsNoscript(lang) {
  const heading = lang === 'ms'
    ? 'Wawasan Firma — artikel guaman oleh peguam Rajpal, Firah & Vishnu'
    : 'Firm Insights — legal articles by Rajpal, Firah & Vishnu advocates';
  const sorted = [...INSIGHTS].sort((a, b) => b[lang].sort.localeCompare(a[lang].sort));
  const items = sorted.map(item => {
    const locale = item[lang];
    const url = insightUrl(item.id, lang);
    return `
      <li>
        <a href="${escHtml(url)}">${escHtml(locale.title)}</a>
        <span> — ${escHtml(locale.category)}, ${escHtml(locale.dateLabel)}. ${escHtml(locale.excerpt)} ${lang === 'ms' ? 'Oleh' : 'By'} ${escHtml(locale.author)}.</span>
      </li>`;
  }).join('');

  return `<noscript class="insights-grid__noscript">
          <h4 class="insights-grid__noscript-title">${escHtml(heading)}</h4>
          <ul class="insights-grid__noscript-list">${items}
          </ul>
        </noscript>`;
}

function buildInsightsCollectionJsonLd(lang) {
  const pageUrl = mediaRoomUrl(lang);
  const sorted = [...INSIGHTS].sort((a, b) => b[lang].sort.localeCompare(a[lang].sort));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#insights-collection`,
    name: lang === 'ms' ? 'Wawasan Firma — Artikel Guaman Malaysia' : 'Firm Insights — Malaysia Legal Articles',
    description: lang === 'ms'
      ? 'Artikel dan pandangan guaman oleh peguam Rajpal, Firah & Vishnu mengenai litigasi sivil, pengantaraan, undang-undang syarikat, dan rayuan di Malaysia.'
      : 'Legal articles and commentary by Rajpal, Firah & Vishnu advocates on civil litigation, mediation, company law, and appeals in Malaysia.',
    url: pageUrl,
    inLanguage: lang === 'ms' ? 'ms-MY' : 'en-MY',
    isPartOf: {
      '@type': 'WebSite',
      name: FIRM_NAME,
      url: `${SITE_ORIGIN}/`,
    },
    numberOfItems: sorted.length,
    hasPart: sorted.map(item => {
      const locale = item[lang];
      const url = insightUrl(item.id, lang);
      return {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: locale.title,
        description: locale.excerpt,
        url,
        datePublished: locale.sort,
        articleSection: locale.category,
        author: {
          '@type': 'Person',
          name: locale.author,
          url: profileUrl(item.authorSlug, lang),
        },
      };
    }),
  };
}

function cleanupStaleInsights(relPath, afterSectionMarker) {
  let html = readFile(relPath);
  const noscriptEnd = '<!-- insights-noscript:end -->';
  const idx = html.indexOf(noscriptEnd);
  if (idx === -1) return;

  const tail = html.slice(idx + noscriptEnd.length);
  if (!tail.includes('data-content') && !tail.includes('<article class="media-card')) return;

  const endIdx = html.indexOf(afterSectionMarker, idx);
  if (endIdx === -1) throw new Error(`Section end marker not found in ${relPath}`);

  html = `${html.slice(0, idx + noscriptEnd.length)}\n\n        \n      </div>\n    </section>\n\n    ${html.slice(endIdx)}`;
  writeFile(relPath, html);
  console.log(`Cleaned stale insights markup in ${relPath}`);
}

function patchInsightsOnPage(relPath, lang, hrefPrefix, injectJsonLd, listing = 'home') {
  ensureMarkers(relPath);
  let html = readFile(relPath);

  html = replaceBetweenMarkers(
    html,
    '<!-- insights-grid:start -->',
    '<!-- insights-grid:end -->',
    `<div class="media-room__grid">${buildInsightsGrid(lang, hrefPrefix, listing)}\n        </div>\n        `,
  );

  html = replaceBetweenMarkers(
    html,
    '<!-- insights-noscript:start -->',
    '<!-- insights-noscript:end -->',
    buildInsightsNoscript(lang),
  );

  if (injectJsonLd) {
    const jsonLdBlock = `
  <script type="application/ld+json" id="insights-jsonld">
${JSON.stringify(buildInsightsCollectionJsonLd(lang), null, 2)}
  </script>`;

    if (html.includes('<!-- insights-jsonld:start -->')) {
      html = replaceBetweenMarkers(html, '<!-- insights-jsonld:start -->', '<!-- insights-jsonld:end -->', jsonLdBlock);
    } else if (html.includes('<!-- media-jsonld:end -->')) {
      html = html.replace(
        '<!-- media-jsonld:end -->',
        `<!-- media-jsonld:end -->\n  <!-- insights-jsonld:start -->${jsonLdBlock}\n  <!-- insights-jsonld:end -->`,
      );
    }
  }

  writeFile(relPath, html);
}

// ── Generate article pages ────────────────────────────────────────────────

for (const item of INSIGHTS) {
  writeFile(`insights/${item.id}/index.html`, buildArticlePage(item, 'en'));
  writeFile(`ms/insights/${item.id}/index.html`, buildArticlePage(item, 'ms'));
  console.log(`Wrote insights/${item.id}/index.html`);
}

// ── Patch listing pages ───────────────────────────────────────────────────

cleanupStaleInsights('index.html', '<!-- ── CONTACT');
cleanupStaleInsights('ms/index.html', '<section id="hubungi"');
cleanupStaleInsights('media/index.html', '  </main>');
cleanupStaleInsights('ms/media/index.html', '  </main>');

patchInsightsOnPage('index.html', 'en', '', false, 'home');
patchInsightsOnPage('media/index.html', 'en', '../', true, 'media');
patchInsightsOnPage('ms/index.html', 'ms', '', false, 'home');
patchInsightsOnPage('ms/media/index.html', 'ms', '../', true, 'media');

// ── Update sitemap.xml ────────────────────────────────────────────────────

let sitemap = readFile('sitemap.xml');
const insightUrls = INSIGHTS.flatMap(item => [
  `  <url>\n    <loc>${escHtml(`${SITE_ORIGIN}/insights/${item.id}/`)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
  `  <url>\n    <loc>${escHtml(`${SITE_ORIGIN}/ms/insights/${item.id}/`)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
]);

const firmInsightsAnchors = [
  `  <url>\n    <loc>${SITE_ORIGIN}/media/#firm-insights</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`,
  `  <url>\n    <loc>${SITE_ORIGIN}/ms/media/#firm-insights</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`,
];

if (!sitemap.includes('/insights/')) {
  const insertBefore = '  <url>\n    <loc>https://rfvlegal.com/legal/privacy-policy/</loc>';
  sitemap = sitemap.replace(
    insertBefore,
    `${firmInsightsAnchors.join('\n')}\n${insightUrls.join('\n')}\n${insertBefore}`,
  );
  writeFile('sitemap.xml', sitemap);
  console.log(`Updated sitemap.xml (+${insightUrls.length + firmInsightsAnchors.length} URLs)`);
}

console.log(`Done — ${INSIGHTS.length} Firm Insights articles generated.`);
