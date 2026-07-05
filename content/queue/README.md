# Artikel-Warteschlange (die „Vorratskammer")

Hier liegen fertig geschriebene und geprüfte Artikel-Paare, die noch NICHT veröffentlicht sind.
GitHub Actions (`.github/workflows/daily-publish.yml`) veröffentlicht **täglich ~06:00 genau einen**
Eintrag — auch wenn der PC aus ist. Kostenlos, ohne KI, ohne API.

## Format pro Eintrag

```
content/queue/<nnn>-<translationKey>/
  de.md        # fertiger DE-Artikel inkl. komplettem Frontmatter
  en.md        # fertiger EN-Artikel (identischer translationKey)
  slugs.json   # {"translationKey": "...", "slug_de": "...", "slug_en": "..."}
```

Regeln:
- `<nnn>` = dreistellige laufende Nummer → bestimmt die Veröffentlichungs-Reihenfolge.
- `pubDate` im Frontmatter ist nur ein Platzhalter — wird beim Veröffentlichen automatisch
  auf das echte Datum gesetzt.
- Das Hero-Bild muss beim Einreihen bereits unter `public/images/<translationKey>.jpg` liegen
  (gratis erzeugen: `node scripts/lib/set-hero-image.mjs <key> "<Kategorie>" "<keyword_en>"`).
- Befüllt wird die Queue vom lokalen Vorrats-Agenten (geplante Aufgabe „nordweg-autopilot").
  Ziel-Füllstand: **60 Artikel** (~2 Monate Puffer bei PC-aus).
