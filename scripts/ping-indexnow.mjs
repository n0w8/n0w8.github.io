// Meldet die heute veroeffentlichten Adressen bei IndexNow an.
// IndexNow wird von Bing, Yandex, Seznam und Naver ausgewertet - eine Meldung
// an api.indexnow.org erreicht alle gleichzeitig. Google beteiligt sich NICHT
// daran; dort uebernimmt die Search Console diese Aufgabe.
//
// Der Nachweis, dass wir die Domain besitzen, liegt als Textdatei im Webspace:
// https://blog.nordwaldrecords.com/<key>.txt enthaelt genau den Schluessel.
// Die Datei wird aus public/ mit deployt - der Schluessel wird hier direkt aus
// dem Dateinamen gelesen, damit beides nie auseinanderlaufen kann.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const HOST = 'blog.nordwaldrecords.com';
const BASE = `https://${HOST}`;

// --- Schluessel aus public/<32 Hex-Zeichen>.txt lesen ---
const publicDir = path.resolve('public');
const keyFile = (await readdir(publicDir)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.log('Kein IndexNow-Schluessel in public/ gefunden - uebersprungen.');
  process.exit(0);
}
const key = keyFile.replace(/\.txt$/, '');

// --- Heute veroeffentlichte Artikel finden ---
const today = new Date().toISOString().slice(0, 10);
const urls = new Set([`${BASE}/`, `${BASE}/blog/`, `${BASE}/en/blog/`]);

for (const [lang, prefix] of [
  ['de', '/blog/'],
  ['en', '/en/blog/'],
]) {
  const dir = path.resolve('src/content/blog', lang);
  let dateien = [];
  try {
    dateien = await readdir(dir);
  } catch {
    continue;
  }
  for (const f of dateien) {
    if (!/\.mdx?$/.test(f)) continue;
    const md = await readFile(path.join(dir, f), 'utf8');
    if (!new RegExp(`^pubDate:\\s*${today}`, 'm').test(md)) continue;
    urls.add(`${BASE}${prefix}${f.replace(/\.mdx?$/, '')}/`);
  }
}

if (urls.size <= 3) {
  console.log('Heute kein neuer Artikel - melde nur die Uebersichtsseiten.');
}

const body = { host: HOST, key, keyLocation: `${BASE}/${keyFile}`, urlList: [...urls] };
console.log(`Melde ${body.urlList.length} Adressen an IndexNow:`);
for (const u of body.urlList) console.log('  ' + u);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// 200 = angenommen, 202 = angenommen aber Schluessel wird noch geprueft.
// Beides ist in Ordnung. Alles andere nur melden, nicht den Lauf abbrechen.
console.log(`IndexNow-Antwort: HTTP ${res.status}`);
if (res.status !== 200 && res.status !== 202) {
  console.log('Hinweis: ' + (await res.text()).slice(0, 300));
}
