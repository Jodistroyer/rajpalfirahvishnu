/**
 * Generates profile SEO (meta, JSON-LD, llms.txt) from data/people.json.
 * Run: node scripts/generate-people-seo.mjs
 * Replace siteOrigin in data/people.json before deploying.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRESS_ITEMS } from '../js/press-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** @type {Record<string, import('../js/press-data.js').PressItem>} */
const pressById = Object.fromEntries(PRESS_ITEMS.map((item) => [item.id, item]));

/** @type {{ siteOrigin: string, firm: { name: string, email: string }, offices: Record<string, object>, people: object[] }} */
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/people.json'), 'utf8'));
const { siteOrigin, firm, offices, people } = data;

/** Machine-readable FAQ index for llms.txt and AI assistants */
const practiceFaqs = [
  {
    slug: 'criminal-law',
    title: 'Criminal law',
    lead: 'Rajpal Singh',
    topics:
      'arrest, police investigation, remand, bail, Criminal Procedure Code, Penal Code, court process, appeals, drug offences, fraud, white-collar crime, SOSMA',
  },
  {
    slug: 'civil-litigation',
    title: 'Civil litigation',
    lead: 'Vishnu Kumar',
    topics:
      'contract disputes, debt recovery, writ of summons, limitation periods, Magistrates Court, Sessions Court, High Court, appeals, shareholder disputes, injunctions, summary judgment',
  },
  {
    slug: 'property-conveyancing',
    title: 'Property & conveyancing',
    lead: null,
    topics:
      'buying property Malaysia, stamp duty, LHDN, sale and purchase agreement, title transfer, National Land Code, land search, caveat, strata title, foreign buyers, conveyancing fees',
  },
  {
    slug: 'probate-estate',
    title: 'Probate & estate administration',
    lead: null,
    topics:
      'wills, grant of probate, letters of administration, intestacy, Distribution Act 1958, Wills Act 1959, estate distribution, inheritance, High Court probate',
  },
  {
    slug: 'corporate-commercial',
    title: 'Corporate & commercial',
    lead: null,
    topics:
      'company incorporation SSM, MyCoID, shareholders agreement, Companies Act 2016, director duties, due diligence, M&A, commercial contracts, NDA, SME compliance',
  },
];

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function experienceSidebar(person, lang) {
  const years = person.experienceYears;
  const area = person.experienceArea[lang];
  if (lang === 'ms') return `${years} tahun ${area}`;
  return `${years} years in ${area}`;
}

function profileUrl(slug, lang) {
  return lang === 'ms'
    ? `${siteOrigin}/ms/people/${slug}/`
    : `${siteOrigin}/people/${slug}/`;
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

function buildHead(person, lang) {
  const slug = person.slug;
  const url = profileUrl(slug, lang);
  const enUrl = profileUrl(slug, 'en');
  const msUrl = profileUrl(slug, 'ms');
  const photoUrl = `${siteOrigin}/${person.photo}`;
  const office = offices[person.office];
  const locale = lang === 'ms' ? 'ms_MY' : 'en_MY';
  const inLanguage = lang === 'ms' ? 'ms-MY' : 'en-MY';
  const breadcrumbHome = lang === 'ms' ? 'Laman Utama' : 'Home';
  const breadcrumbPeople = lang === 'ms' ? 'Pasukan Kami' : 'Our People';
  const peopleHash = lang === 'ms' ? `${siteOrigin}/ms/#pasukan` : `${siteOrigin}/#people`;

  const personId = `${url}#person`;
  const webpageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  const personNode = {
    '@type': 'Person',
    '@id': personId,
    name: person.name.full,
    jobTitle: person.jobTitle[lang],
    email: person.email,
    image: photoUrl,
    url,
    knowsAbout: person.knowsAbout,
    worksFor: {
      '@type': 'LegalService',
      name: firm.name,
      url: `${siteOrigin}/`,
    },
    workLocation: {
      '@type': 'Place',
      name: person.office === 'petaling-jaya' ? 'Petaling Jaya Office' : 'Batu Caves Office',
      address: {
        '@type': 'PostalAddress',
        ...office,
      },
    },
    alumniOf: person.alumniOf,
    sameAs: [
      ...person.sameAs,
      enUrl,
      msUrl,
    ],
  };

  if (person.telephone.length === 1) {
    personNode.telephone = person.telephone[0];
  } else {
    personNode.telephone = person.telephone;
  }
  if (person.knowsLanguage) personNode.knowsLanguage = person.knowsLanguage;
  if (person.nationality) personNode.nationality = person.nationality;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url,
        name: person.title[lang].replace(' | Rajpal, Firah & Vishnu', '').replace(' | Rajpal, Firah &amp; Vishnu', ''),
        description: person.metaDescription[lang],
        inLanguage,
        isPartOf: { '@type': 'WebSite', name: firm.name, url: `${siteOrigin}/` },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': personId },
        primaryImageOfPage: { '@type': 'ImageObject', url: photoUrl },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: breadcrumbHome, item: lang === 'ms' ? `${siteOrigin}/ms/` : `${siteOrigin}/` },
          { '@type': 'ListItem', position: 2, name: breadcrumbPeople, item: peopleHash },
          { '@type': 'ListItem', position: 3, name: person.name.short, item: url },
        ],
      },
      personNode,
    ],
  };

  const twitterTitle = person.ogTitle[lang];
  const twitterDesc = person.ogDescription[lang];

  return `  <meta name="description" content="${escHtml(person.metaDescription[lang])}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${escHtml(url)}">
  <link rel="alternate" hreflang="en" href="${escHtml(enUrl)}">
  <link rel="alternate" hreflang="ms" href="${escHtml(msUrl)}">
  <link rel="alternate" hreflang="x-default" href="${escHtml(enUrl)}">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="${locale}">
  <meta property="og:site_name" content="Rajpal, Firah &amp; Vishnu">
  <meta property="og:title" content="${escHtml(person.ogTitle[lang])}">
  <meta property="og:description" content="${escHtml(person.ogDescription[lang])}">
  <meta property="og:url" content="${escHtml(url)}">
  <meta property="og:image" content="${escHtml(photoUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escHtml(twitterTitle)}">
  <meta name="twitter:description" content="${escHtml(twitterDesc)}">
  <meta name="twitter:image" content="${escHtml(photoUrl)}">
  <script type="application/ld+json">
${JSON.stringify(graph, null, 2).split('\n').map(line => '  ' + line).join('\n')}
  </script>
${assetLinks(lang === 'ms' ? '../../../' : '../../')}`;
}

function buildAvatar(person, assetPrefix) {
  const alt = escHtml(person.name.full);
  return `<div class="profile-sidebar__avatar" data-initials="${person.initials}">
              <img src="${assetPrefix}${person.photo}" alt="${alt}" class="profile-sidebar__photo" width="112" height="112" loading="eager" decoding="async">
              <span class="profile-sidebar__initials" aria-hidden="true">${person.initials}</span>
            </div>`;
}

/**
 * @param {{ slug: string, pressCoverage?: (string | { id: string, label?: string })[] }} person
 * @returns {{ url: string, label?: string }[]}
 */
function resolvePressCoverage(person) {
  if (!person.pressCoverage?.length) return [];

  return person.pressCoverage.flatMap((entry) => {
    const id = typeof entry === 'string' ? entry : entry.id;
    const item = pressById[id];
    if (!item) {
      console.warn(`Unknown press id "${id}" for ${person.slug}`);
      return [];
    }
    if (item.counsel && item.counsel !== person.slug) {
      console.warn(`Press id "${id}" counsel is ${item.counsel}, expected ${person.slug}`);
    }
    const label = typeof entry === 'object' && entry.label ? entry.label : undefined;
    return [{ url: item.url, label }];
  });
}

function buildFaqLink(person, lang, assetPrefix) {
  if (!person.faq) return '';
  const href = `${assetPrefix}faq/${person.faq}/`;
  if (lang === 'ms') {
    const label = person.faq === 'civil-litigation'
      ? 'Soalan Lazim Litigasi Sivil'
      : 'Soalan Lazim Undang-Undang Jenayah';
    return `\n            <a href="${href}" class="profile-sidebar__resource" hreflang="en">${label} <span aria-hidden="true">→</span></a>`;
  }
  const label = person.faq === 'civil-litigation' ? 'Civil Litigation FAQ' : 'Criminal Law FAQ';
  return `\n            <a href="${href}" class="profile-sidebar__resource">${label} <span aria-hidden="true">→</span></a>`;
}

function patchProfileHtml(relPath, person, lang) {
  const filePath = path.join(root, relPath);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('<main id="main-content"')) {
    throw new Error(`Body missing in ${relPath} — restore file before running generator`);
  }

  const assetPrefix = lang === 'ms' ? '../../../' : '../../';

  // Replace SEO block between markers, or meta description through first ld+json script only
  const markerStart = '<!-- people-seo:start -->';
  const markerEnd = '<!-- people-seo:end -->';
  const newSeo = buildHead(person, lang);

  if (html.includes(markerStart) && html.includes(markerEnd)) {
    html = html.replace(
      new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`),
      `${markerStart}\n${newSeo}\n  ${markerEnd}`,
    );
  } else {
    const seoRe = /  <meta name="description"[\s\S]*?  <\/script>\n(?=  <link rel="icon")/;
    if (!seoRe.test(html)) {
      throw new Error(`SEO block not found in ${relPath}`);
    }
    html = html.replace(seoRe, `${newSeo}\n`);
  }

  // Update page title
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${person.title[lang].replace(/&/g, '&amp;')}</title>`,
  );

  // Replace avatar
  const avatarRe = /            <div class="profile-sidebar__avatar"[\s\S]*?<\/div>\n            <h1 class="profile-sidebar__name">/;
  html = html.replace(
    avatarRe,
    `            ${buildAvatar(person, assetPrefix)}\n            <h1 class="profile-sidebar__name">`,
  );

  // Replace experience list item
  const expLabel = lang === 'ms' ? 'Pengalaman' : 'Experience';
  const expItemRe = new RegExp(
    `<li>\\s*<span class="profile-sidebar__meta-label">${expLabel}</span>[\\s\\S]*?</li>`,
  );
  html = html.replace(
    expItemRe,
    `<li>
                <span class="profile-sidebar__meta-label">${expLabel}</span>
                ${experienceSidebar(person, lang)}
              </li>`,
  );

  // Ensure FAQ link after contact button (add if missing, skip duplicate)
  const contactBtnRe = lang === 'ms'
    ? /(<a href="[^"]+#hubungi" class="btn btn--primary" style="width:100%;">Hubungi[^<]+<\/a>)/
    : /(<a href="[^"]+#contact" class="btn btn--primary" style="width:100%;">Contact[^<]+<\/a>)/;
  if (person.faq && !html.includes(`faq/${person.faq}/`)) {
    html = html.replace(contactBtnRe, `$1${buildFaqLink(person, lang, assetPrefix)}`);
  }

  // Summary experience phrases
  const summaryPatches = [
    [/with ten years of experience in criminal litigation/g, 'with 10+ years of experience in criminal litigation'],
    [/with 30 years of experience in civil law litigation/g, 'with 29+ years of experience in civil law litigation'],
    [/He has over 30 years of experience in criminal litigation/g, 'He has 30+ years of experience in criminal litigation'],
    [/dengan sepuluh tahun pengalaman litigasi jenayah/g, 'dengan 10+ tahun pengalaman litigasi jenayah'],
    [/dengan 30 tahun pengalaman litigasi sivil/g, 'dengan 29+ tahun pengalaman litigasi sivil'],
    [/Lebih 30 tahun litigasi jenayah/g, '30+ tahun litigasi jenayah'],
    [/mempunyai lebih 30 tahun pengalaman dalam bidang Litigasi Jenayah/g, 'mempunyai 30+ tahun pengalaman dalam bidang Litigasi Jenayah'],
  ];
  for (const [from, to] of summaryPatches) {
    html = html.replace(from, to);
  }

  fs.writeFileSync(filePath, html);
  console.log(`Patched ${relPath}`);
}

function buildLlmsTxt() {
  const lines = [
    '# Rajpal, Firah & Vishnu | Lawyer Profiles & Practice FAQs',
    `# ${firm.name}`,
    `# Contact: ${firm.email}`,
    '',
    '## About this file',
    'Machine-readable index of advocate profiles and practice-area FAQs for search engines and AI assistants.',
    'Replace [yourdomain] in data/people.json and re-run: node scripts/generate-people-seo.mjs',
    '',
    '## Firm',
    `- Name: ${firm.name}`,
    `- Website: ${siteOrigin}/`,
    `- Email: ${firm.email}`,
    `- Offices: Petaling Jaya and Batu Caves, Selangor, Malaysia`,
    '',
    '## Practice area FAQs',
  ];

  for (const faq of practiceFaqs) {
    lines.push(
      '',
      `### ${faq.title}`,
      `- URL: ${siteOrigin}/faq/${faq.slug}/`,
      `- Topics: ${faq.topics}`,
    );
    if (faq.lead) {
      lines.push(`- Led by: ${faq.lead}`);
    }
  }

  lines.push('', '## Lawyers');

  for (const person of people) {
    lines.push(
      '',
      `### ${person.name.full}`,
      `- English: ${profileUrl(person.slug, 'en')}`,
      `- Bahasa Malaysia: ${profileUrl(person.slug, 'ms')}`,
      `- Role: ${person.jobTitle.en} / ${person.jobTitle.ms}`,
      `- Practice: ${person.practice.en}`,
      `- Experience: ${person.experienceYears} years (${person.experienceArea.en})`,
      `- Called to the Bar: ${person.barYear}`,
      `- Email: ${person.email}`,
      `- Photo: ${siteOrigin}/${person.photo}`,
    );
    if (person.faq) {
      lines.push(`- FAQ: ${siteOrigin}/faq/${person.faq}/`);
    }
    const press = resolvePressCoverage(person);
    if (press.length) {
      lines.push('- Press coverage (Media Room):');
      for (const item of press) {
        lines.push(item.label ? `  - ${item.url} — ${item.label}` : `  - ${item.url}`);
      }
    }
    if (person.pressThumbnail) {
      lines.push(`- Press thumbnail: ${siteOrigin}/${person.pressThumbnail}`);
    }
  }

  lines.push(
    '',
    '## Related resources',
    ...practiceFaqs.map(
      (faq) => `- ${faq.title} FAQ: ${siteOrigin}/faq/${faq.slug}/`,
    ),
    `- Media room: ${siteOrigin}/media/`,
    `- Homepage: ${siteOrigin}/`,
    '',
  );

  fs.writeFileSync(path.join(root, 'llms.txt'), lines.join('\n'));
  console.log('Wrote llms.txt');
}

const llmsOnly = process.argv.includes('--llms-only');

if (!llmsOnly) {
  for (const person of people) {
    patchProfileHtml(`people/${person.slug}/index.html`, person, 'en');
    patchProfileHtml(`ms/people/${person.slug}/index.html`, person, 'ms');
  }
}

buildLlmsTxt();
console.log(llmsOnly ? 'Wrote llms.txt only.' : 'Done. Add headshot JPGs under assets/people/ (see assets/people/README.txt).');
