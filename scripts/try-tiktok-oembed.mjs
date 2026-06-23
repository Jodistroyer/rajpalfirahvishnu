/** Try TikTok oembed thumbnails */
const items = [
  ['tiktok-utusan-kk', 'https://www.tiktok.com/@utusanonline/video/7350574657910721800'],
  ['tiktok-hmetromy', 'https://www.tiktok.com/@hmetromy/video/7520509764229532944'],
];

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../assets/media/press');

for (const [id, url] of items) {
  try {
    const api = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(15000) });
    const data = await res.json();
    if (!data.thumbnail_url) throw new Error('no thumbnail');
    const img = await fetch(data.thumbnail_url);
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(outDir, `${id}.jpg`), buf);
    console.log(id, 'ok', buf.length);
  } catch (e) {
    console.log(id, 'fail', e.message);
  }
}
