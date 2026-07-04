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
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return `/en${clean === '/' ? '' : clean}`;
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
  return localizedPath(`/blog/${stripLangFromSlug(entry.slug)}`, lang);
}

/** Datum in der jeweiligen Sprache formatieren. */
export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
