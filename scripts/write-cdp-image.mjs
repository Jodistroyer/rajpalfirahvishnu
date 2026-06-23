import fs from 'fs';

const cdpPath = process.argv[2];
const outPath = process.argv[3];
const j = JSON.parse(fs.readFileSync(cdpPath, 'utf8'));
const v = j.result?.value ?? j.result?.result?.value;
if (!v?.full) throw new Error('No image data in CDP response');
const buf = Buffer.from(v.full, 'base64');
fs.writeFileSync(outPath, buf);
console.log(`Wrote ${buf.length} bytes (${v.type}) -> ${outPath}`);
