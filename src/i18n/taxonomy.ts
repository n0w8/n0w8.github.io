import { categoryLabels, type Lang } from './ui';

/**
 * Slug fuer Kategorie- und Themen-URLs.
 * Umlaute werden aufgeloest, "&" und Leerzeichen zu Bindestrichen.
 * "Runen & Symbole" -> "runen-symbole", "Krieger & Schlachten" -> "krieger-schlachten"
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Basis-Pfad der Kategorie-Hubs je Sprache. */
export const catBase = (lang: Lang) => (lang === 'de' ? '/blog/kategorie' : '/en/blog/category');
/** Basis-Pfad der Themen-Hubs je Sprache. */
export const tagBase = (lang: Lang) => (lang === 'de' ? '/blog/thema' : '/en/blog/topic');

/**
 * Slug einer Kategorie IN DER JEWEILIGEN SPRACHE.
 * Die Kategorie ist im Frontmatter immer deutsch gespeichert ("Rezepte"), die
 * englische Adresse muss aber /en/blog/category/recipes/ lauten und nicht
 * /en/blog/category/rezepte/ - sonst steht in der URL, dem wichtigsten
 * Ranking-Signal einer Hub-Seite, das falsche Keyword.
 */
export const catSlug = (category: string, lang: Lang) =>
  slugify(categoryLabels[category]?.[lang] ?? category);

export const catUrl = (category: string, lang: Lang) => `${catBase(lang)}/${catSlug(category, lang)}/`;
export const tagUrl = (tag: string, lang: Lang) => `${tagBase(lang)}/${slugify(tag)}/`;

/**
 * Eigener Einleitungstext pro Kategorie-Hub.
 * WICHTIG: bewusst ausformuliert und je Kategorie unterschiedlich. Hub-Seiten
 * mit identischem Platzhaltertext wertet Google als Duplikat ab - erst ein
 * eigener Text macht die Seite zu einem Ranking-Ziel fuer das Oberthema.
 */
export const catText: Record<string, Record<Lang, { title: string; description: string; lede: string }>> = {
  Geschichte: {
    de: {
      title: 'Wikinger-Geschichte: Zeitalter, Feldzuege und Reiche',
      description:
        'Die Geschichte der Wikinger von 793 bis 1066: Raubzuege, Handelswege, Koenige und Reiche - belegt aus Chroniken und archaeologischen Funden.',
      lede:
        'Hier geht es um das, was wirklich passiert ist: die 273 Jahre zwischen dem Ueberfall auf Lindisfarne und der Schlacht von Stamford Bridge. Feldzuege, Handelsrouten bis Bagdad, Siedlungen auf Island und Groenland, und die Koenige, die daraus Reiche gemacht haben. Jeder Artikel nennt seine Quellen.',
    },
    en: {
      title: 'Viking History: Age, Campaigns and Kingdoms',
      description:
        'Viking history from 793 to 1066: raids, trade routes, kings and kingdoms - documented from chronicles and archaeological finds.',
      lede:
        'This is about what actually happened: the 273 years between the raid on Lindisfarne and the Battle of Stamford Bridge. Campaigns, trade routes reaching Baghdad, settlements in Iceland and Greenland, and the kings who turned all of it into kingdoms. Every article names its sources.',
    },
  },
  Mythologie: {
    de: {
      title: 'Nordische Mythologie: Goetter, Welten und Mythen',
      description:
        'Nordische Mythologie verstaendlich erklaert: Odin, Thor, Loki, Yggdrasil, die neun Welten und Ragnaroek - nach Edda und Snorri, nicht nach Hollywood.',
      lede:
        'Odin, Thor, Loki, Freyja, die neun Welten, Ragnaroek. Wir lesen dafuer die Quellen selbst: Liederedda, Snorris Prosaedda, Skaldendichtung. Wo Serien und Filme etwas dazuerfunden haben, sagen wir es - und erzaehlen, warum die echte Version meist die bessere Geschichte ist.',
    },
    en: {
      title: 'Norse Mythology: Gods, Worlds and Myths',
      description:
        'Norse mythology explained clearly: Odin, Thor, Loki, Yggdrasil, the nine worlds and Ragnarok - based on the Eddas, not on Hollywood.',
      lede:
        "Odin, Thor, Loki, Freyja, the nine worlds, Ragnarok. We go to the sources themselves: the Poetic Edda, Snorri's Prose Edda, skaldic verse. Where shows and films invented something, we say so - and tell you why the real version is usually the better story.",
    },
  },
  'Runen & Symbole': {
    de: {
      title: 'Runen und Wikinger-Symbole: Bedeutung und Herkunft',
      description:
        'Runen und nordische Symbole mit belegter Bedeutung: Aelteres Futhark, Valknut, Vegvisir, Thors Hammer - inklusive Hinweis, welche Zeichen erst spaeter erfunden wurden.',
      lede:
        'Das Aeltere Futhark, der Valknut, Thors Hammer, Vegvisir, Aegishjalmur. Wir erklaeren, was die Zeichen bedeuten, wo sie wirklich gefunden wurden - und bei welchen beliebten "Wikinger-Symbolen" die Belege erst aus dem 17. Jahrhundert oder sogar aus dem Internet stammen.',
    },
    en: {
      title: 'Runes and Viking Symbols: Meaning and Origin',
      description:
        "Runes and Norse symbols with documented meaning: Elder Futhark, Valknut, Vegvisir, Thor's hammer - including which signs were invented much later.",
      lede:
        "The Elder Futhark, the Valknut, Thor's hammer, Vegvisir, Aegishjalmur. We explain what the signs mean and where they were actually found - and which popular \"Viking symbols\" only show up in 17th-century manuscripts, or on the internet.",
    },
  },
  'Alltag & Kultur': {
    de: {
      title: 'Alltag der Wikinger: Leben, Haus und Gesellschaft',
      description:
        'Wie die Wikinger wirklich gelebt haben: Langhaus, Kleidung, Hygiene, Recht, Thing, Rolle der Frauen, Handwerk und Handel - aus Funden rekonstruiert.',
      lede:
        'Zwischen den Raubzuegen lag ein Leben: Langhaeuser, Thing-Versammlungen, Erbrecht, Kleidung, Koerperpflege, Spiele, Handwerk. Dieser Pfad rekonstruiert den Alltag aus Grabfunden, Siedlungsbefunden und Rechtstexten - und raeumt dabei mit einigen zaehen Klischees auf.',
    },
    en: {
      title: 'Viking Daily Life: Home, Society and Culture',
      description:
        'How Vikings really lived: longhouses, clothing, hygiene, law, the thing assembly, the role of women, crafts and trade - reconstructed from finds.',
      lede:
        'Between the raids there was a life: longhouses, thing assemblies, inheritance law, clothing, grooming, games, crafts. This path reconstructs daily life from grave goods, settlement evidence and legal texts - and clears away a few stubborn cliches along the way.',
    },
  },
  'Krieger & Schlachten': {
    de: {
      title: 'Wikinger-Krieger und Schlachten: Waffen und Taktik',
      description:
        'Wikinger im Kampf: Waffen, Schildwall, Berserker, beruehmte Schlachten und Schiffe - was Archaeologie und Chroniken belegen, und was Mythos ist.',
      lede:
        'Schwert, Axt, Speer, Schildwall. Hier geht es um die Kriegsfuehrung der Nordmaenner: wie sie wirklich gekaempft haben, was ein Berserker war und was nicht, welche Schlachten den Verlauf aenderten - und warum keiner dieser Krieger jemals einen Hoernerhelm getragen hat.',
    },
    en: {
      title: 'Viking Warriors and Battles: Weapons and Tactics',
      description:
        'Vikings in combat: weapons, the shield wall, berserkers, famous battles and ships - what archaeology and chronicles prove, and what is myth.',
      lede:
        'Sword, axe, spear, shield wall. This is about how the Northmen actually fought: what a berserker was and was not, which battles changed the course of events - and why not one of these warriors ever wore a horned helmet.',
    },
  },
  Rezepte: {
    de: {
      title: 'Wikinger-Rezepte: Originalgetreu nachkochen',
      description:
        'Wikinger-Rezepte zum Nachkochen: Fladenbrot, Eintopf, Honigkuchen, Met und mehr - historisch recherchiert und fuer die heutige Kueche angepasst.',
      lede:
        'Gerste, Hafer, Fisch, Wild, Honig, Beeren, Bier. Diese Rezepte stammen aus der Vorratskammer der Wikingerzeit und sind fuer eine normale Kueche ausgearbeitet: klare Mengen, nachvollziehbare Schritte, dazu die Herkunft der Zutaten. Gekocht, fotografiert und geschmeckt haben wir alle selbst.',
    },
    en: {
      title: 'Viking Recipes: Cook the Age of the Northmen',
      description:
        'Viking recipes you can actually cook: flatbread, stew, honey cake, mead and more - historically researched and adapted for a modern kitchen.',
      lede:
        'Barley, oats, fish, game, honey, berries, ale. These recipes come out of the Viking Age pantry and are written for a normal kitchen: clear quantities, steps that work, plus where each ingredient comes from. We cooked, photographed and tasted every one of them.',
    },
  },
};

/** Text fuer eine Themen-Seite (Tag). Wird aus dem Tag-Namen gebildet. */
export function tagText(tag: string, lang: Lang, anzahl: number) {
  if (lang === 'en') {
    return {
      title: `${tag}: all articles`,
      description: `Every Nordweg article on ${tag} - ${anzahl} researched pieces on Viking history, myth and daily life.`,
      lede: `${anzahl} articles in the Nordweg archive deal with ${tag}. Collected here so you can follow the thread instead of searching for it.`,
    };
  }
  return {
    title: `${tag}: alle Artikel`,
    description: `Alle Nordweg-Artikel zu ${tag} - ${anzahl} recherchierte Beitraege zu Geschichte, Mythologie und Alltag der Wikinger.`,
    lede: `${anzahl} Artikel im Nordweg-Archiv drehen sich um ${tag}. Hier gesammelt, damit du dem Thema folgen kannst, statt es zu suchen.`,
  };
}

/** Ab wie vielen Artikeln ein Tag eine eigene Seite bekommt (gegen duenne Seiten). */
export const TAG_SCHWELLE = 3;
