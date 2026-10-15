// Prueft, ob JEDER Artikel der Kategorie "Rezepte" ein gueltiges
// schema.org/Recipe-Markup traegt.
//
// Warum es das gibt (15.10.2026): Das Recipe-Markup steht handgeschrieben in den
// Artikeldateien, nicht in der Vorlage. Dadurch fehlte es bei 14 von 66 Rezepten -
// ausgerechnet auch bei /en/blog/viking-honey-cake/, der meistbesuchten Seite des
// ganzen Blogs (134 von 902 Aufrufen in 30 Tagen). Ohne dieses Markup erkennt
// Google die Seite gar nicht als Rezept: keine Sterne, keine Zubereitungszeit,
// kein Vorschaubild in der Suche.
//
// Aufruf: node scripts/check-recipes.mjs [--strict]
// Ohne --strict wird nur gewarnt (Exit 0), mit --strict ist ein Fehlen ein Fehler.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const strict = process.argv.includes('--strict');
const PFLICHT = ['name', 'image', 'recipeIngredient', 'recipeInstructions'];

const probleme = [];
let rezepte = 0;

for (const lang of ['de', 'en']) {
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
    if (!/^category:\s*"Rezepte"/m.test(md)) continue;
    rezepte++;
    const rel = `${lang}/${f}`;

    const bloecke = [...md.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    let recipe = null;
    for (const b of bloecke) {
      try {
        const j = JSON.parse(b[1]);
        if (j['@type'] === 'Recipe') { recipe = j; break; }
      } catch (err) {
        probleme.push(`${rel}: JSON-LD ist kein gueltiges JSON (${err.message})`);
      }
    }
    if (!recipe) { probleme.push(`${rel}: KEIN Recipe-Markup`); continue; }
    const fehlt = PFLICHT.filter((k) => !recipe[k] || (Array.isArray(recipe[k]) && !recipe[k].length));
    if (fehlt.length) probleme.push(`${rel}: Recipe-Markup unvollstaendig (${fehlt.join(', ')})`);
  }
}

console.log(`Rezeptartikel geprueft: ${rezepte}`);
if (!probleme.length) {
  console.log('Alle Rezepte tragen gueltiges Recipe-Markup.');
  process.exit(0);
}
console.log(`\n${probleme.length} Problem(e):`);
for (const p of probleme) console.log('  - ' + p);
process.exit(strict ? 1 : 0);
