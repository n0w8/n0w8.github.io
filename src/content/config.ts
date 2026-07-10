import { defineCollection, z } from 'astro:content';

// Ein Blog-Artikel. Deutsche Artikel liegen in blog/de/, englische in blog/en/.
// Beide Sprachversionen teilen denselben `translationKey`, damit der
// Sprachumschalter das jeweilige Gegenstück findet.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(), // Meta-Description für Google (150-160 Zeichen)
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.enum(['Geschichte', 'Mythologie', 'Runen & Symbole', 'Alltag & Kultur', 'Krieger & Schlachten', 'Rezepte']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Die Nordweg-Redaktion'),
    // Verbindet DE- und EN-Version desselben Artikels
    translationKey: z.string(),
    // Verknüpfter Artist (Backlink-Ziel + Musik-Embed). Details in src/data/artists.ts
    artistKey: z.enum(['domsgard', 'eldruna']).optional(),
    trackTitle: z.string().optional(), // optionale Beschriftung ("Stimmung: episch")
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
