// Gratis-Hero-Bild für den Autopilot — KEIN Bezahldienst nötig.
// Reihenfolge: 1) Wikimedia Commons (gratis, echte Fotos, mit Quellenangabe)
//              2) Fallback: lokale Bild-Bibliothek (public/images/library/<kategorie>/)
// Ergebnis immer: public/images/<translationKey>.jpg (1600px, optimiert) — kann NIE fehlschlagen,
// solange die Bibliothek existiert.
//
// Aufruf:  node scripts/lib/set-hero-image.mjs <translationKey> "<category>" "<keyword>"
// Ausgabe: eine Zeile, z.B.  SOURCE=wikimedia CREDIT=Foo (CC BY-SA 4.0)
//                       oder  SOURCE=library
import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const [, , key, category = '', keyword = ''] = process.argv;
if (!key) { console.error('Usage: set-hero-image.mjs <translationKey> "<category>" "<keyword>"'); process.exit(1); }

const OUT = path.resolve('public/images', `${key}.jpg`);
const LIB = path.resolve('public/images/library');

// Blog-Kategorie -> Bibliotheks-Ordner
const folderFor = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('mytholog')) return 'mythologie';
  if (c.includes('krieger') || c.includes('schlacht')) return 'schlachten';
  if (c.includes('runen')) return 'runen';
  if (c.includes('alltag') || c.includes('kultur')) return 'alltag';
  if (c.includes('geschichte')) return 'geschichte';
  return 'geschichte';
};

const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function optimizeTo(buf, out) {
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
}

async function tryWikimedia(kw) {
  if (!kw) return null;
  const api = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrsearch: kw,
    gsrnamespace: '6', gsrlimit: '12', prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600',
  });
  const res = await fetch(api, { headers: { 'User-Agent': 'NordwegBlog/1.0 (viking blog autopilot)' } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {});
  // bevorzugt Querformat-JPEG/PNG mit ausreichender Breite
  const cands = pages
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i && /image\/(jpeg|png)/.test(i.mime || '') && (i.thumbwidth || i.width) >= 1000
                 && (i.thumbheight ? i.thumbwidth >= i.thumbheight : true));
  for (const info of cands) {
    try {
      const url = info.thumburl || info.url;
      const r = await fetch(url, { headers: { 'User-Agent': 'NordwegBlog/1.0 (viking blog autopilot)' } });
      if (!r.ok) continue;
      await optimizeTo(Buffer.from(await r.arrayBuffer()), OUT);
      const meta = info.extmetadata || {};
      const author = stripHtml(meta.Artist?.value) || 'Wikimedia Commons';
      const license = stripHtml(meta.LicenseShortName?.value) || 'Wikimedia Commons';
      return `${author} (${license}), via Wikimedia Commons`;
    } catch { /* nächster Kandidat */ }
  }
  return null;
}

async function useLibrary(cat) {
  const dir = path.join(LIB, folderFor(cat));
  if (!existsSync(dir)) throw new Error(`Bibliothek-Ordner fehlt: ${dir}`);
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (!files.length) throw new Error(`Keine Bilder in ${dir}`);
  const pick = files[Math.floor(Math.random() * files.length)];
  // Bibliotheksbilder sind bereits optimiert -> einfach kopieren
  await mkdir(path.dirname(OUT), { recursive: true });
  await copyFile(path.join(dir, pick), OUT);
  return pick;
}

(async () => {
  try {
    const credit = await tryWikimedia(keyword);
    if (credit) { console.log(`SOURCE=wikimedia CREDIT=${credit}`); return; }
  } catch { /* auf Bibliothek zurückfallen */ }
  const pick = await useLibrary(category);
  console.log(`SOURCE=library FILE=${pick}`);
})().catch((e) => { console.error('IMAGE-FAIL:', e.message); process.exit(1); });
