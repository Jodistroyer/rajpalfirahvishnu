/**
 * Patches profile HTML with press sections and sidebar links only.
 * Run: node scripts/patch-profile-press.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRESS_ITEMS } from '../js/press-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/people.json'), 'utf8'));
const { people } = data;

const PROFILE_PRESS_LIMIT = 6;

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
  const href = `${mediaPath(assetPrefix, lang)}?counsel=${person.slug}#press`;
  const label = lang === 'ms' ? 'Dalam Media' : 'In the Press';
  return `\n            <a href="${href}" class="profile-sidebar__resource">${label} <span aria-hidden="true">→</span></a>`;
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
  const mediaBase = `${mediaPath(assetPrefix, lang)}?counsel=${person.slug}`;

  const listItems = visible.map((item) => `              <li class="profile-press__item">
    <a href="${escHtml(`${mediaBase}#press-${item.id}`)}" class="profile-press__link">${escHtml(item.title)}</a>
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
                <a href="${escHtml(`${mediaBase}#press`)}" class="profile-sidebar__resource">${viewAll} <span aria-hidden="true">→</span></a>
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

function patchFile(relPath, person, lang) {
  const filePath = path.join(root, relPath);
  let html = fs.readFileSync(filePath, 'utf8');
  const assetPrefix = lang === 'ms' ? '../../../' : '../../';

  const contactBtnRe = lang === 'ms'
    ? /(<a href="[^"]+#hubungi" class="btn btn--primary" style="width:100%;">Hubungi[^<]+<\/a>)/
    : /(<a href="[^"]+#contact" class="btn btn--primary" style="width:100%;">Contact[^<]+<\/a>)/;

  const sidebarRe = new RegExp(
    `\n            <a href="[^"]*counsel=${person.slug}#press" class="profile-sidebar__resource">[^<]+<span aria-hidden="true">→</span></a>`,
  );
  const sidebarLink = buildPressSidebarLink(person, lang, assetPrefix);
  if (sidebarLink && getPressItemsForPerson(person.slug).length) {
    if (sidebarRe.test(html)) {
      html = html.replace(sidebarRe, sidebarLink);
    } else if (!html.includes(`counsel=${person.slug}#press`)) {
      html = html.replace(contactBtnRe, `$1${sidebarLink}`);
    }
  }

  html = patchProfilePress(html, person, lang, assetPrefix);
  fs.writeFileSync(filePath, html);
  console.log(`Patched ${relPath}`);
}

for (const person of people) {
  patchFile(`people/${person.slug}/index.html`, person, 'en');
  patchFile(`ms/people/${person.slug}/index.html`, person, 'ms');
}

console.log('Done.');
