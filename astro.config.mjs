// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Live-Adresse: blog.nordwaldrecords.com (easyname-Webspace, Deploy via FTP-Action).
// Steuert Sitemap, Canonical-URLs und hreflang - bei Domain-Wechsel hier ändern.
const SITE = 'https://blog.nordwaldrecords.com';

/**
 * Letztes Änderungsdatum je Artikel-Adresse für die Sitemap.
 *
 * Warum: Ohne lastmod muss Google jede der rund 200 Adressen selbst erneut
 * abholen, um zu sehen, ob sich etwas geändert hat. Mit einem ECHTEN Datum
 * crawlt Google gezielt - neue Artikel werden schneller aufgenommen, alte
 * nicht unnötig neu geladen. Ein pauschales "heute" für alle Seiten wäre
 * schädlich: Google erkennt das und ignoriert das Feld dann komplett.
 *
 * Gelesen wird das Frontmatter direkt von der Platte (updatedDate, sonst
 * pubDate), weil in astro.config kein Zugriff auf astro:content möglich ist.
 */
function artikelDaten() {
  const map = new Map();
  for (const [lang, prefix] of [
    ['de', '/blog/'],
    ['en', '/en/blog/'],
  ]) {
    const dir = path.resolve('src/content/blog', lang);
    let dateien = [];
    try {
      dateien = readdirSync(dir);
    } catch {
      continue;
    }
    for (const f of dateien) {
      if (!/\.mdx?$/.test(f)) continue;
      const md = readFileSync(path.join(dir, f), 'utf8').slice(0, 1500);
      const upd = md.match(/^updatedDate:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
      const pub = md.match(/^pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
      const datum = upd?.[1] ?? pub?.[1];
      if (!datum) continue;
      map.set(`${SITE}${prefix}${f.replace(/\.mdx?$/, '')}/`, new Date(`${datum}T09:00:00Z`));
    }
  }
  return map;
}

const daten = artikelDaten();
// Neuester Artikel = Stand der Übersichts- und Kategorie-Seiten
const neuester = [...daten.values()].sort((a, b) => b - a)[0] ?? new Date();

export default defineConfig({
  site: SITE,
  server: { port: Number(process.env.PORT) || 4321, host: true },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const artikel = daten.get(item.url);
        if (artikel) {
          item.lastmod = artikel.toISOString();
          item.changefreq = 'monthly';
          item.priority = 0.8;
          return item;
        }
        // Übersichts-, Kategorie- und Themen-Seiten ändern sich mit jedem
        // neuen Artikel, also täglich bis wöchentlich.
        const istListe = /\/(blog|kategorie|category|thema|topic)\//.test(item.url) || /\/blog\/$/.test(item.url);
        item.lastmod = neuester.toISOString();
        item.changefreq = istListe ? 'weekly' : 'monthly';
        // Beide Startseiten gleich hoch: der groesste Teil der Besucher kommt
        // ueber die englischen Seiten (Pinterest/US), /en/ ist also kein
        // Nebeneingang (Analytics 30 Tage, 4.10.2026).
        const istStart = item.url === `${SITE}/` || item.url === `${SITE}/en/`;
        item.priority = istStart ? 1.0 : istListe ? 0.7 : 0.5;
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
