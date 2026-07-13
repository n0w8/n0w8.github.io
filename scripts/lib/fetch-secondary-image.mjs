// Zusätzliches Wikimedia-Bild für den Artikeltext (Hero kommt aus set-hero-image.mjs).
// Aufruf:  node scripts/lib/fetch-secondary-image.mjs <translationKey> "<keyword>" [suffix]
// Ausgabe: public/images/<translationKey><suffix|-2>.jpg, z.B. SOURCE=wikimedia CREDIT=...
import sharp from 'sharp';
const [,, key, keyword, suffix] = process.argv;
const OUT = `public/images/${key}${suffix||'-2'}.jpg`;
const api = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
  action: 'query', format: 'json', generator: 'search', gsrsearch: keyword,
  gsrnamespace: '6', gsrlimit: '12', prop: 'imageinfo',
  iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1400',
});
const res = await fetch(api, { headers: { 'User-Agent': 'NordwegBlog/1.0' } });
const data = await res.json();
const pages = Object.values(data?.query?.pages ?? {});
const cands = pages.map(p => p.imageinfo?.[0]).filter(i => i && /image\/(jpeg|png)/.test(i.mime||'') && (i.thumbwidth||i.width) >= 800);
if (!cands.length) { console.error('NONE FOUND for', keyword); process.exit(1); }
for (const info of cands) {
  try {
    const url = info.thumburl || info.url;
    const r = await fetch(url, { headers: { 'User-Agent': 'NordwegBlog/1.0' } });
    if (!r.ok) continue;
    await sharp(Buffer.from(await r.arrayBuffer())).resize({width:1200, withoutEnlargement:true}).jpeg({quality:80, mozjpeg:true}).toFile(OUT);
    const meta = info.extmetadata || {};
    const strip = s => (s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
    const author = strip(meta.Artist?.value) || 'Wikimedia Commons';
    const license = strip(meta.LicenseShortName?.value) || 'Wikimedia Commons';
    console.log(`SOURCE=wikimedia CREDIT=${author} (${license}), via Wikimedia Commons`);
    process.exit(0);
  } catch(e) { /* try next */ }
}
console.error('ALL CANDIDATES FAILED for', keyword);
process.exit(1);
