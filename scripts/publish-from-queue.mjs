// Veröffentlicht GENAU EINEN Artikel aus der Warteschlange (content/queue/).
// Läuft täglich in GitHub Actions (gratis, PC kann aus sein) — braucht KEIN KI-Modell.
// Queue-Eintrag: content/queue/<nnn>-<key>/{de.md, en.md, slugs.json}
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const QUEUE = path.resolve('content/queue');
const dry = process.argv.includes('--dry-run');

const entries = existsSync(QUEUE)
  ? (await readdir(QUEUE, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  : [];

if (!entries.length) {
  console.log('QUEUE_EMPTY — nichts zu veröffentlichen.');
  process.exit(0);
}

const item = entries[0];
const dir = path.join(QUEUE, item);
const slugs = JSON.parse(await readFile(path.join(dir, 'slugs.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

async function place(srcName, destRel) {
  let md = await readFile(path.join(dir, srcName), 'utf8');
  // Platzhalter-Datum durch echtes Veröffentlichungsdatum ersetzen
  md = md.replace(/^pubDate:.*$/m, `pubDate: ${today}`);
  if (dry) { console.log(`[dry] ${srcName} -> ${destRel}`); return; }
  const dest = path.resolve(destRel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, md);
}

await place('de.md', `src/content/blog/de/${slugs.slug_de}.md`);
await place('en.md', `src/content/blog/en/${slugs.slug_en}.md`);
if (!dry) await rm(dir, { recursive: true });

console.log(`PUBLISHED ${item} (pubDate=${today}) — verbleibend in Queue: ${entries.length - 1}`);
