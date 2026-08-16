/**
 * Generates profile SEO (meta, JSON-LD, llms.txt) from data/people.json.
 * Run: node scripts/generate-people-seo.mjs
 * Replace siteOrigin in data/people.json before deploying.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRESS_ITEMS } from '../js/press-data.js';
import { CLIPPINGS } from '../js/clippings-data.js';
import { INSIGHTS } from '../js/insights-data.js';

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
    titleMs: 'Undang-undang jenayah',
    lead: 'Rajpal Singh',
    topics:
      'arrest, police investigation, remand, bail, Criminal Procedure Code, Penal Code, court process, appeals, drug offences, fraud, white-collar crime, SOSMA',
    topicsMs:
      'tangkap, siasatan polis, reman, jamin, Kanun Tatacara Jenayah, Kanun Keseksaan, proses mahkamah, rayuan, kes dadah, penipuan, jenayah kolar putih, SOSMA',
  },
  {
    slug: 'civil-litigation',
    title: 'Civil litigation',
    titleMs: 'Litigasi sivil',
    lead: 'Vishnu Kumar',
    topics:
      'contract disputes, debt recovery, writ of summons, limitation periods, Magistrates Court, Sessions Court, High Court, appeals, shareholder disputes, injunctions, summary judgment',
    topicsMs:
      'pertikaian kontrak, tuntutan hutang, writ saman, tempoh had, Mahkamah Majistret, Mahkamah Sesyen, Mahkamah Tinggi, rayuan, pertikaian pemegang saham, injunksi, penghakiman ringkas',
  },
  {
    slug: 'property-conveyancing',
    title: 'Property & conveyancing',
    titleMs: 'Harta tanah & konveyans',
    lead: null,
    topics:
      'buying property Malaysia, stamp duty, LHDN, sale and purchase agreement, title transfer, National Land Code, land search, caveat, strata title, foreign buyers, conveyancing fees',
    topicsMs:
      'membeli hartanah Malaysia, duti setem, LHDN, perjanjian jual beli, pemindahan hakmilik, Kanun Tanah Negara, carian tanah, caveat, hakmilik strata, pembeli asing, yuran konveyans',
  },
  {
    slug: 'probate-estate',
    title: 'Probate & estate administration',
    titleMs: 'Probet & pentadbiran harta pusaka',
    lead: null,
    topics:
      'wills, grant of probate, letters of administration, intestacy, Distribution Act 1958, Wills Act 1959, estate distribution, inheritance, High Court probate',
    topicsMs:
      'wasiat, surat kuasa probet, surat kuasa pentadbiran, kematian tanpa wasiat, Akta Pengagihan 1958, Akta Wasiat 1959, pengagihan harta pusaka, warisan, probet Mahkamah Tinggi',
  },
  {
    slug: 'corporate-commercial',
    title: 'Corporate & commercial',
    titleMs: 'Korporat & komersial',
    lead: null,
    topics:
      'company incorporation SSM, MyCoID, shareholders agreement, Companies Act 2016, director duties, due diligence, M&A, commercial contracts, NDA, SME compliance',
    topicsMs:
      'penubuhan syarikat SSM, MyCoID, perjanjian pemegang saham, Akta Syarikat 2016, kewajipan pengarah, due diligence, M&A, kontrak komersial, NDA, pematuhan PKS',
  },
  {
    slug: 'family-law',
    title: 'Family law',
    titleMs: 'Undang-undang keluarga',
    lead: null,
    topics:
      'divorce Malaysia, joint petition, child custody, maintenance, nafkah, Domestic Violence Act 1994, Law Reform (Marriage and Divorce) Act 1976, Syariah court, matrimonial assets',
    topicsMs:
      'perceraian Malaysia, petisyen bersama, penjagaan anak, nafkah, Akta Keganasan Rumah Tangga 1994, Akta Pemansuhan Undang-Undang (Perkahwinan dan Perceraian) 1976, mahkamah Syariah, harta sepencarian',
  },
  {
    slug: 'bankruptcy-law',
    title: 'Bankruptcy law',
    titleMs: 'Undang-undang kebankrapan',
    lead: null,
    topics:
      'Insolvency Act 1967, bankruptcy notice, bankruptcy order, RM100000 threshold, debtor petition, AKPK, DGI MdI, discharge three years, social guarantor section 5(2), EPF protection, travel permission',
    topicsMs:
      'Akta Insolvensi 1967, notis kebankrapan, perintah kebankrapan, ambang RM100000, petisyen penghutang, AKPK, KPI MdI, pelepasan tiga tahun, penjamin sosial seksyen 5(2), perlindungan KWSP, kebenaran melancong',
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

function faqUrl(slug, lang) {
  return lang === 'ms'
    ? `${siteOrigin}/ms/faq/${slug}/`
    : `${siteOrigin}/faq/${slug}/`;
}

function insightUrl(id, lang) {
  return lang === 'ms'
    ? `${siteOrigin}/ms/insights/${id}/`
    : `${siteOrigin}/insights/${id}/`;
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

const PROFILE_PRESS_LIMIT = 6;

/** @param {string} slug */
function getPressItemsForPerson(slug) {
  return PRESS_ITEMS.filter((item) => (item.counsel || 'rajpal-singh') === slug).sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return b.sort.localeCompare(a.sort);
  });
}

function mediaPath(assetPrefix, lang) {
  return lang === 'ms' ? `${assetPrefix}ms/media/` : `${assetPrefix}media/`;
}

function buildPressSidebarLink(person, lang, assetPrefix) {
  if (!getPressItemsForPerson(person.slug).length) return '';
  const href = `${mediaPath(assetPrefix, lang)}#press`;
  const label = lang === 'ms' ? 'Dalam Media' : 'In the Press';
  return `\n            <a href="${href}" data-counsel="${person.slug}" class="profile-sidebar__resource">${label} <span aria-hidden="true">→</span></a>`;
}

function buildProfilePressBlock(person, lang, assetPrefix) {
  const items = getPressItemsForPerson(person.slug);
  if (!items.length) return '';

  const visible = items.slice(0, PROFILE_PRESS_LIMIT);
  const title = lang === 'ms' ? 'Dalam Media' : 'In the Press';
  const intro = lang === 'ms'
    ? `Liputan media terpilih yang memaparkan ${person.name.short}.`
    : `Selected press coverage featuring ${person.name.short}.`;
  const viewAll = lang === 'ms'
    ? `Lihat semua dalam Bilik Media (${items.length})`
    : `View all in Media Room (${items.length})`;
  const mediaBase = mediaPath(assetPrefix, lang);

  const listItems = visible.map((item) => `              <li class="profile-press__item">
                <a href="${escHtml(`${mediaBase}#press-${item.id}`)}" data-counsel="${escHtml(person.slug)}" class="profile-press__link">${escHtml(item.title)}</a>
                <span class="profile-press__meta">${escHtml(item.publisher)} · ${escHtml(item.dateLabel)}</span>
              </li>`).join('\n');

  return `            <!-- profile-press:start -->
            <section class="profile-section profile-press" data-profile-press aria-labelledby="profile-press">
              <h2 class="profile-section__title" id="profile-press">${title}</h2>
              <p class="profile-section__text">${intro}</p>
              <ul class="profile-press__list">
${listItems}
              </ul>
              <p class="profile-press__footer">
                <a href="${escHtml(`${mediaBase}#press`)}" data-counsel="${escHtml(person.slug)}" class="profile-sidebar__resource">${viewAll} <span aria-hidden="true">→</span></a>
              </p>
            </section>
            <!-- profile-press:end -->`;
}

function findProfileMainClose(html) {
  for (const sep of ['\r\n', '\n']) {
    const pattern = `          </div>${sep}        </div>`;
    const idx = html.lastIndexOf(pattern);
    if (idx !== -1) return idx;
  }
  return -1;
}

function patchProfilePress(html, person, lang, assetPrefix) {
  const block = buildProfilePressBlock(person, lang, assetPrefix);
  const markerRe = /            <!-- profile-press:start -->[\s\S]*?            <!-- profile-press:end -->/;
  if (markerRe.test(html)) {
    return block ? html.replace(markerRe, block) : html.replace(markerRe, '');
  }
  if (!block) return html;
  const mainClose = findProfileMainClose(html);
  if (mainClose === -1) return html;
  return `${html.slice(0, mainClose)}${block}\r\n${html.slice(mainClose)}`;
}

function patchProfileHtml(relPath, person, lang) {
  const filePath = path.join(root, relPath);
  // Normalize CRLF so the LF-based patterns below match on files edited on Windows
  let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

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
    // Consume through the icon/font/css links (regenerated inside newSeo) up to
    // </head>. Greedy so any previously duplicated blocks are collapsed too.
    const seoRe = /  <meta name="description"[\s\S]*utilities\.css">\n(?=<\/head>)/;
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

  if (getPressItemsForPerson(person.slug).length && !html.includes(`data-counsel="${person.slug}"`)) {
    html = html.replace(contactBtnRe, `$1${buildPressSidebarLink(person, lang, assetPrefix)}`);
  }

  html = patchProfilePress(html, person, lang, assetPrefix);

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

function buildLlmsTxt(lang = 'en') {
  const isMs = lang === 'ms';
  const lines = isMs
    ? [
        '# Rajpal, Firah & Vishnu | Profil Peguam & Soalan Lazim Bidang Guaman',
        `# ${firm.name}`,
        `# Hubungi: ${firm.email}`,
        '',
        '## Perihal fail ini',
        'Indeks mesin-baca profil peguam dan soalan lazim bidang guaman untuk enjin carian dan pembantu AI.',
        'Dijana oleh: node scripts/generate-people-seo.mjs',
        `- English: ${siteOrigin}/llms.txt`,
        '',
        '## Firma',
        `- Nama: ${firm.name}`,
        `- Laman web: ${siteOrigin}/ms/`,
        `- E-mel: ${firm.email}`,
        `- Pejabat: Petaling Jaya dan Batu Caves, Selangor, Malaysia`,
        '',
        '## Soalan lazim bidang guaman',
      ]
    : [
        '# Rajpal, Firah & Vishnu | Lawyer Profiles & Practice FAQs',
        `# ${firm.name}`,
        `# Contact: ${firm.email}`,
        '',
        '## About this file',
        'Machine-readable index of advocate profiles and practice-area FAQs for search engines and AI assistants.',
        'Generated by: node scripts/generate-people-seo.mjs',
        `- Bahasa Malaysia: ${siteOrigin}/ms/llms.txt`,
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
      `### ${isMs ? faq.titleMs : faq.title}`,
      `- URL: ${faqUrl(faq.slug, lang)}`,
      `- Topics: ${isMs ? faq.topicsMs : faq.topics}`,
    );
    if (faq.lead) {
      lines.push(isMs ? `- Diketuai oleh: ${faq.lead}` : `- Led by: ${faq.lead}`);
    }
  }

  lines.push('', isMs ? '## Peguam' : '## Lawyers');

  for (const person of people) {
    lines.push(
      '',
      `### ${person.name.full}`,
      `- English: ${profileUrl(person.slug, 'en')}`,
      `- Bahasa Malaysia: ${profileUrl(person.slug, 'ms')}`,
      isMs
        ? `- Peranan: ${person.jobTitle.ms}`
        : `- Role: ${person.jobTitle.en} / ${person.jobTitle.ms}`,
      isMs
        ? `- Bidang guaman: ${person.practice.ms}`
        : `- Practice: ${person.practice.en}`,
      isMs
        ? `- Pengalaman: ${person.experienceYears} tahun (${person.experienceArea.ms})`
        : `- Experience: ${person.experienceYears} years (${person.experienceArea.en})`,
      isMs
        ? `- Dipanggil ke Bar: ${person.barYear}`
        : `- Called to the Bar: ${person.barYear}`,
      `- Email: ${person.email}`,
      `- Photo: ${siteOrigin}/${person.photo}`,
    );
    if (person.faq) {
      lines.push(`- FAQ: ${faqUrl(person.faq, lang)}`);
    }
    const press = resolvePressCoverage(person);
    if (press.length) {
      lines.push(isMs ? '- Liputan media (Bilik Media):' : '- Press coverage (Media Room):');
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
    isMs ? '## Bilik Media' : '## Media Room',
    isMs
      ? `- URL: ${siteOrigin}/ms/media/`
      : `- URL: ${siteOrigin}/media/`,
    isMs
      ? `- Bahasa alternatif: ${siteOrigin}/media/`
      : `- Bahasa Malaysia: ${siteOrigin}/ms/media/`,
    isMs
      ? `- Topik: liputan media, keratan akhbar, undang-undang jenayah, perbicaraan bunuh, kes dadah, KK Mart, Hindraf, siasatan Teoh Beng Hock, Paul Yong, Nicky Liow`
      : `- Topics: press coverage, newspaper clippings, criminal law, murder trials, drug cases, KK Mart, Hindraf, Teoh Beng Hock inquest, Paul Yong, Nicky Liow`,
    isMs
      ? `- Arkib Dalam Media: ${PRESS_ITEMS.length} item`
      : `- In the Press archive: ${PRESS_ITEMS.length} items`,
    isMs
      ? `- Perpustakaan keratan akhbar: ${CLIPPINGS.length} imej arkib memaparkan Dato' Rajpal Singh`
      : `- Newspaper clippings library: ${CLIPPINGS.length} archived images featuring Dato' Rajpal Singh`,
    isMs ? '- Keratan akhbar (arkib penuh):' : '- Newspaper clippings (full archive):',
  );

  const sortedClippings = [...CLIPPINGS].sort((a, b) => b.sort.localeCompare(a.sort));
  for (const c of sortedClippings) {
    lines.push(`  - ${siteOrigin}/assets/media/newspaper-clippings/${c.file} — ${c.description}`);
  }

  lines.push(isMs ? '- Liputan media (arkib penuh):' : '- In the Press (full archive):');
  const sortedPress = [...PRESS_ITEMS].sort((a, b) => b.sort.localeCompare(a.sort));
  for (const item of sortedPress) {
    lines.push(`  - ${item.url} — ${item.title} (${item.publisher}, ${item.sort.slice(0, 10)})`);
  }

  lines.push(
    '',
    isMs ? '## Wawasan Firma (artikel)' : '## Firm Insights (articles)',
    isMs
      ? `- Indeks: ${siteOrigin}/ms/media/#firm-insights`
      : `- Index: ${siteOrigin}/media/#firm-insights`,
    isMs
      ? `- Topik: pengantaraan, litigasi sivil, undang-undang syarikat, kewajipan pengarah, rayuan sivil, kontrak`
      : `- Topics: mediation, civil litigation, company law, director duties, civil appeals, contracts`,
  );
  const sortedInsights = [...INSIGHTS].sort((a, b) => b.en.sort.localeCompare(a.en.sort));
  for (const item of sortedInsights) {
    const locale = isMs ? item.ms : item.en;
    lines.push(`  - ${insightUrl(item.id, lang)} — ${locale.title} (${locale.category}, ${locale.sort.slice(0, 10)}) — ${locale.author}`);
  }

  lines.push(
    '',
    isMs ? '## Sumber berkaitan' : '## Related resources',
    ...practiceFaqs.map((faq) =>
      isMs
        ? `- Soalan lazim ${faq.titleMs}: ${faqUrl(faq.slug, 'ms')}`
        : `- ${faq.title} FAQ: ${siteOrigin}/faq/${faq.slug}/`,
    ),
    isMs
      ? `- Laman utama: ${siteOrigin}/ms/`
      : `- Homepage: ${siteOrigin}/`,
    '',
  );

  const outPath = isMs ? path.join(root, 'ms', 'llms.txt') : path.join(root, 'llms.txt');
  fs.writeFileSync(outPath, lines.join('\n'));
  console.log(`Wrote ${isMs ? 'ms/llms.txt' : 'llms.txt'}`);
}

function buildAllLlmsTxt() {
  buildLlmsTxt('en');
  buildLlmsTxt('ms');
}

const llmsOnly = process.argv.includes('--llms-only');

if (!llmsOnly) {
  for (const person of people) {
    patchProfileHtml(`people/${person.slug}/index.html`, person, 'en');
    patchProfileHtml(`ms/people/${person.slug}/index.html`, person, 'ms');
  }
}

buildAllLlmsTxt();
console.log(llmsOnly ? 'Wrote llms.txt and ms/llms.txt.' : 'Done. Add headshot JPGs under assets/people/ (see assets/people/README.txt).');
