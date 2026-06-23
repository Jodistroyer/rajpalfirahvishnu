/**
 * Generate js/media-rights-log.js from press-data.js and clippings-data.js
 * Run: node scripts/generate-rights-log.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function parsePressItems(src) {
  const block = src.match(/export const PRESS_ITEMS = \[([\s\S]*?)\];/)?.[1];
  if (!block) throw new Error('PRESS_ITEMS not found');

  const items = [];
  const re = /\{\s*id:\s*'([^']+)'([\s\S]*?)\n  \},/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const body = m[0];
    const get = key => body.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] || '';
    const youtubeId = get('youtubeId');
    const thumb = get('thumb');
    let imageSource = 'publisher-og-preview';
    let imageAsset = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : thumb;
    let rightsHolder = get('publisher');

    if (youtubeId) {
      imageSource = 'youtube-thumbnail';
      rightsHolder = 'YouTube / original uploader';
    } else if (thumb.includes('fallback-')) {
      imageSource = 'firm-created-fallback';
      rightsHolder = 'Rajpal Firah & Vishnu';
    } else if (/tiktok-/.test(thumb) && !thumb.includes('fallback')) {
      imageSource = 'tiktok-oembed-preview';
      rightsHolder = 'TikTok / original uploader';
    } else if (thumb.includes('facebook-vasakhi')) {
      rightsHolder = 'Facebook / original uploader';
    }

    items.push({
      id: m[1],
      title: get('title'),
      publisher: get('publisher'),
      sourceUrl: get('url'),
      imageAsset,
      imageSource,
      rightsHolder,
      use: 'Press index thumbnail; link-out to original source',
      added: '2026-06-23',
    });
  }
  return items;
}

function parseClippings(src) {
  const block = src.match(/export const CLIPPINGS = \[([\s\S]*?)\];/)?.[1];
  if (!block) throw new Error('CLIPPINGS not found');

  const items = [];
  const re = /\{\s*file:\s*'([^']+)'([\s\S]*?)\n  \},/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const body = m[0];
    const get = key => body.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] || '';
    const file = m[1];
    const publisher = inferPublisher(get('description'), file);
    items.push({
      id: file.replace(/\.[^.]+$/, ''),
      file,
      imageAsset: `assets/media/newspaper-clippings/${file}`,
      publisher,
      dateLabel: get('dateLabel'),
      imageSource: 'firm-archive-scan',
      rightsHolder: publisher || 'Respective newspaper publisher',
      use: 'Reference archive of press coverage featuring Datuk Rajpal Singh',
      added: '2026-06-23',
    });
  }
  return items;
}

function inferPublisher(description, file) {
  const text = `${description} ${file}`.toLowerCase();
  const map = [
    ['New Straits Times', /new straits times|\bnst\b/],
    ['The Star', /the star|\bstar\b/],
    ['Malay Mail', /malay mail/],
    ['Berita Harian', /berita harian|\bbharian\b|\bbh-/],
    ['Utusan Malaysia', /utusan/],
    ['Sinar Harian', /sinar harian/],
    ['Sin Chew Daily', /sin chew/],
    ['China Press', /china press/],
    ['Kosmo', /kosmo/],
    ['Harian Metro', /harian metro/],
    ['Malaysia Gazette', /malaysia gazette/],
    ['The Sun', /the sun/],
    ['Nanyang Siang Pau', /nanyang/],
  ];
  for (const [name, re] of map) {
    if (re.test(text)) return name;
  }
  return 'Respective newspaper publisher';
}

const pressSrc = fs.readFileSync(path.join(root, 'js/press-data.js'), 'utf8');
const clippingsSrc = fs.readFileSync(path.join(root, 'js/clippings-data.js'), 'utf8');
const pressItems = parsePressItems(pressSrc);
const clippingsItems = parseClippings(clippingsSrc);

const out = `/**
 * Media image rights log — press thumbnails and newspaper clippings.
 * Regenerate: node scripts/generate-rights-log.mjs
 */

export const MEDIA_RIGHTS_META = {
  lastUpdated: '2026-06-23',
  maintainer: 'Rajpal Firah & Vishnu',
  pressDisclaimer:
    'Press thumbnails are shown for reference only. Images and articles remain the property of their respective publishers and platforms. Each card links to the original source where available.',
  clippingsDisclaimer:
    'Newspaper clippings are archived scans shown for reference only. Layout, photographs, and text remain the property of the respective publishers. Captions identify the source publication and date where known.',
};

/** @typedef {'publisher-og-preview' | 'youtube-thumbnail' | 'tiktok-oembed-preview' | 'firm-created-fallback' | 'firm-archive-scan'} ImageSource */

/**
 * @typedef {Object} PressRightsEntry
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} sourceUrl
 * @property {string} imageAsset
 * @property {ImageSource} imageSource
 * @property {string} rightsHolder
 * @property {string} use
 * @property {string} added ISO date
 */

/** @type {PressRightsEntry[]} */
export const PRESS_IMAGE_RIGHTS = ${JSON.stringify(pressItems, null, 2)};

/**
 * @typedef {Object} ClippingRightsEntry
 * @property {string} id
 * @property {string} file
 * @property {string} imageAsset
 * @property {string} publisher
 * @property {string} dateLabel
 * @property {ImageSource} imageSource
 * @property {string} rightsHolder
 * @property {string} use
 * @property {string} added
 */

/** @type {ClippingRightsEntry[]} */
export const CLIPPINGS_IMAGE_RIGHTS = ${JSON.stringify(clippingsItems, null, 2)};
`;

fs.writeFileSync(path.join(root, 'js/media-rights-log.js'), out);
console.log(`Wrote ${pressItems.length} press entries and ${clippingsItems.length} clipping entries.`);
