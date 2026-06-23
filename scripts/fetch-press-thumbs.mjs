/**
 * Fetch og:image for press items and save to assets/media/press/
 * Run: node scripts/fetch-press-thumbs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets/media/press');
const dataSrc = fs.readFileSync(path.join(root, 'js/press-data.js'), 'utf8');
const itemsBlock = dataSrc.match(/export const PRESS_ITEMS = \[([\s\S]*?)\];/);
if (!itemsBlock) throw new Error('PRESS_ITEMS not found');

/** @type {{ id: string, url: string, publisher: string, thumb?: string, youtubeId?: string }[]} */
const items = [];
const blockRe = /\{\s*id:\s*'([^']+)'[\s\S]*?\n  \},/g;
let m;
while ((m = blockRe.exec(itemsBlock[1])) !== null) {
  const block = m[0];
  if (!block.includes('url:')) continue;
  items.push({
    id: m[1],
    url: /url:\s*'([^']+)'/.exec(block)?.[1] || '',
    publisher: /publisher:\s*'([^']+)'/.exec(block)?.[1] || '',
    thumb: /thumb:\s*'([^']+)'/.exec(block)?.[1],
    youtubeId: /youtubeId:\s*'([^']+)'/.exec(block)?.[1],
  });
}

function extractOgImage(html) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const hit = html.match(re);
    if (hit?.[1]) return hit[1].replace(/&amp;/g, '&');
  }
  return null;
}

function extFromContent(contentType, imageUrl) {
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('gif')) return '.gif';
  try {
    const p = new URL(imageUrl).pathname.toLowerCase();
    if (p.endsWith('.png')) return '.png';
    if (p.endsWith('.webp')) return '.webp';
  } catch { /* ignore */ }
  return '.jpg';
}

async function fetchOgImage(pageUrl) {
  const res = await fetch(pageUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const og = extractOgImage(html);
  if (!og) throw new Error('No og:image');
  return new URL(og, pageUrl).href;
}

async function downloadImage(imageUrl, destBase) {
  const res = await fetch(imageUrl, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RFVPressBot/1.0)' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error('Image too small');
  const ext = extFromContent(res.headers.get('content-type') || '', imageUrl);
  const dest = destBase + ext;
  fs.writeFileSync(dest, buf);
  return `assets/media/press/${path.basename(dest)}`;
}

/** @type {Record<string, string|null>} */
const results = {};

for (const item of items) {
  if (item.youtubeId || item.thumb) {
    results[item.id] = item.thumb || `youtube:${item.youtubeId}`;
    continue;
  }

  const destBase = path.join(outDir, item.id);
  const existing = ['.jpg', '.jpeg', '.png', '.webp'].find(ext => fs.existsSync(destBase + ext));
  if (existing) {
    results[item.id] = `assets/media/press/${item.id}${existing}`;
    console.log('exists', item.id);
    continue;
  }

  try {
    process.stdout.write(`fetching ${item.id}... `);
    const ogUrl = await fetchOgImage(item.url);
    const thumbPath = await downloadImage(ogUrl, destBase);
    results[item.id] = thumbPath;
    console.log('ok');
  } catch (err) {
    console.log('fail:', err.message);
    results[item.id] = null;
  }
}

fs.writeFileSync(path.join(outDir, 'thumb-map.json'), JSON.stringify(results, null, 2));
console.log('\nDone. Missing:', Object.entries(results).filter(([, v]) => !v).map(([k]) => k));
