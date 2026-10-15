import { ui, defaultLang, categoryLabels, type Lang } from './ui';
import { getCollection, type CollectionEntry } from 'astro:content';

/** Sprache aus der URL ableiten (/en/... → 'en', sonst Default 'de'). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en') return 'en';
  return defaultLang;
}

/** Übersetzungsfunktion für die aktuelle Sprache. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['de']): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Kategorie-Wert (immer deutsch gespeichert) in die Anzeigesprache übersetzen. */
export function localizeCategory(category: string, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category;
}

/** Pfad für eine Sprache erzeugen: ('/blog', 'en') → '/en/blog'. */
export function localizedPath(path: string, lang: Lang): string {
  let clean = path.startsWith('/') ? path : `/${path}`;
  // Immer MIT abschliessendem Schraegstrich (15.10.2026).
  // Vorher lieferte diese Funktion /blog, /artists, /en/blog usw. - und der
  // Webserver beantwortete JEDEN dieser Links mit einer 301-Weiterleitung auf
  // dieselbe Adresse mit Schraegstrich. Das betraf die gesamte Navigation:
  // Kopfzeile, Fusszeile, Breadcrumbs und jeden Artikel-Link. In der Search
  // Console stehen deshalb 62 Seiten unter "Seite mit Weiterleitung".
  // Dateien (z. B. /rss.xml) bleiben unberuehrt.
  const istDatei = /\.[a-z0-9]{2,5}$/i.test(clean);
  if (!istDatei && !clean.endsWith('/')) clean += '/';
  if (lang === defaultLang) return clean;
  return `/en${clean === '/' ? '/' : clean}`;
}

/** Slug ohne Sprach-Präfix: 'de/das-langschiff' → 'das-langschiff'. */
export function stripLangFromSlug(slug: string): string {
  return slug.replace(/^(de|en)\//, '');
}

/** Alle veröffentlichten Artikel einer Sprache, neueste zuerst. */
export async function getPostsByLang(lang: Lang): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ id, data }) => {
    return id.startsWith(`${lang}/`) && !data.draft;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** URL zum Artikel (ohne Sprach-Ordner im Slug). */
export function postUrl(entry: CollectionEntry<'blog'>, lang: Lang): string {
  // Der abschliessende Schraegstrich MUSS mit (ergaenzt 15.10.2026).
  // Ohne ihn zeigte JEDER interne Artikel-Link auf /blog/<slug>, der Webserver
  // antwortete darauf mit einer 301-Weiterleitung auf /blog/<slug>/ - und erst
  // die lieferte die Seite. Canonical und Sitemap nannten durchgaengig die
  // Variante MIT Schraegstrich. Folgen, in der Search Console sichtbar:
  // 62 Seiten unter "Seite mit Weiterleitung", jeder Klick ein unnoetiger
  // Umweg, und Google verbrennt Crawl-Zeit auf Adressen, die es gar nicht
  // indexieren will. Zusaetzlich trug die Weiterleitung auf diesem Webspace
  // den Port im Ziel (...nordwaldrecords.com:443/...).
  return localizedPath(`/blog/${stripLangFromSlug(entry.slug)}/`, lang);
}

/** Datum in der jeweiligen Sprache formatieren. */
export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
