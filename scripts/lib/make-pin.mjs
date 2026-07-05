// Erzeugt ein Pinterest-Pin-Bild (1000x1500, 2:3) aus einem Artikel-Hero:
// Bild oben, dunkler Verlauf unten, Titel-Text + Nordweg-Branding.
// Aufruf: node scripts/lib/make-pin.mjs <bild.jpg> "<Titel>" <ausgabe.jpg>
import sharp from 'sharp';

const [, , src, title, out] = process.argv;
if (!src || !title || !out) {
  console.error('Usage: make-pin.mjs <image> "<title>" <out.jpg>');
  process.exit(1);
}

// simple Wort-Umbruch für den Titel
function wrap(text, max = 19) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lines = wrap(title);
const fontSize = lines.length >= 4 ? 64 : lines.length === 3 ? 72 : 80;
const lineH = fontSize * 1.18;
const textBlockY = 1500 - 170 - lines.length * lineH;

const textSvg = lines
  .map((l, i) => `<text x="500" y="${Math.round(textBlockY + (i + 1) * lineH)}" text-anchor="middle"
     font-family="Georgia, 'Palatino Linotype', serif" font-weight="bold" font-size="${fontSize}"
     fill="#e8ddc4">${esc(l)}</text>`)
  .join('\n');

const overlay = `<svg width="1000" height="1500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#0c0b09" stop-opacity="0"/>
      <stop offset="0.62" stop-color="#0c0b09" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0c0b09" stop-opacity="0.97"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0b09" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0c0b09" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1500" fill="url(#g)"/>
  <rect width="1000" height="220" fill="url(#top)"/>
  <text x="500" y="86" text-anchor="middle" font-family="Georgia, serif" font-weight="bold"
        font-size="34" letter-spacing="14" fill="#c9a25a">N O R D W E G</text>
  ${textSvg}
  <rect x="430" y="${Math.round(textBlockY - 26)}" width="140" height="3" fill="#c9a25a"/>
  <text x="500" y="1436" text-anchor="middle" font-family="Georgia, serif"
        font-size="30" letter-spacing="3" fill="#9a8f78">ᛟ  Die Chronik der Wikinger  ᛟ</text>
</svg>`;

await sharp(src)
  .resize(1000, 1500, { fit: 'cover', position: 'attention' })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(out);

console.log(`PIN OK: ${out}`);
