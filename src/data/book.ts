// Zentrale Daten zum Kochbuch "Viking Feast" (Amazon KDP).
// WICHTIG: Sobald das Buch live ist, hier NUR die amazonUrl-Felder befuellen -
// die Kaufbox unter allen Rezept-Artikeln schaltet dann automatisch von
// "Erscheint in Kuerze" auf den Kauf-Button um.

export const book = {
  de: {
    title: 'Viking Feast',
    subtitle: 'Das große Wikinger-Kochbuch - über 140 Rezepte der Nordmänner',
    cover: '/images/buch/viking-feast-cover-de.jpg',
    // z.B. https://www.amazon.de/dp/XXXXXXXXXX
    amazonUrl: '',
  },
  en: {
    title: 'Viking Feast',
    subtitle: 'The Great Viking Cookbook - Over 140 Norse Recipes',
    cover: '/images/buch/viking-feast-cover-en.jpg',
    // z.B. https://www.amazon.com/dp/XXXXXXXXXX
    amazonUrl: '',
  },
} as const;
