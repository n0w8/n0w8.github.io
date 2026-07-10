# Pinterest-Autopilot — Bereitschaftsplan

Status: **wartet auf Pinterest Trial-Freigabe.** App "Domsgard Content Planner",
App-ID `1587474`, Konto `domsgard` (Pinterest) / `n0w8` (GitHub). Business-Account
mit ~470k monatlichen Aufrufen, ~6 Monate keine neuen Pins.

## Prinzip (wie der Blog)
Pins werden über eine Vorratskammer + GitHub Actions veröffentlicht → 7 Pins/Tag,
auch bei ausgeschaltetem PC, 0 € laufende Kosten. NIE direkt auf Spotify verlinken —
immer auf den passenden **Blog-Artikel** (dort Player + Spotify/YouTube + später Merch).

## Board-Strategie (Pinterest = Suchmaschine, Keyword-Namen)
- „Nordische Mythologie" → Artikel category "Mythologie"
- „Wikinger Runen & Symbole" → "Runen & Symbole"
- „Wikinger Geschichte" → "Geschichte"
- „Wikinger Krieger & Schlachten" → "Krieger & Schlachten"
- „Leben der Wikinger" → "Alltag & Kultur"

## Hochfahren (Ramp — Konto war 6 Monate inaktiv, kein Spam-Muster erzeugen!)
- Woche 1–2: **7 Pins/Tag** · Woche 3–4: **10/Tag** · ab Monat 2: **15/Tag**, WENN die
  Verteilung gesund bleibt (Impressions je Pin nicht einbrechen). Nie schlagartig hochziehen.
- Mix pro Tag: ~70 % Content-Pins (Klick-Versprechen → Artikel), ~20 % Video-Pins mit Sound
  (Shorts-Zweitverwertung → Musik direkt im Feed, 0 Klick-Hürden), ~10 % Produkt-/Merch-Pins.

## Content-Pins: das Klick-Rezept (statt reiner Ästhetik-Pins)
Alte Pins = schöne Bilder ohne Klickgrund (3,9k Saves, aber nur 181 Klicks/Monat!). Neue Regel:
Jeder Pin verspricht eine ANTWORT, die es nur hinter dem Klick gibt:
- Titel-Overlays wie "10 Viking Symbols and Their Real Meanings", "Norse Gods Family Tree
  Explained", "Viking Names and Their Meanings", "How Did a Viking Get Into Valhalla?"
- Auf dem Bild: Zahl/Frage/Versprechen + dezenter CTA ("Read the full chronicle →").
- Beschreibung: 2–4 Sätze mit Keywords + Handlungsaufforderung + Artikel-Link.
- Zu jedem Pin-Winkel existiert (oder entsteht) der passende Artikel im Backlog.

## Merch-Pins (Spreadshirt, später eigener Shop)
- KI-Shirt-Designs (kräftige, einfache Motive: Runen, Valknut, Raben, "Skål", Mjölnir) →
  Spreadshirt-Upload (macht der User) → Pin zeigt Wikinger-Charakter, der das Shirt TRÄGT
  (KI-Mockup) + CTA + Shop-Link. Max ~10 % des Pin-Mixes, sonst wirkt das Konto werblich.

## Pro Pin
- Bild: `node scripts/lib/make-pin.mjs <hero.jpg> "<Titel>" <out.jpg>` (1000x1500, gebrandet).
  Gleicher Hero + anderer Titel = frischer Pin → ein Hero reicht für mehrere Pins.
- Titel: Keyword-stark, neugierig machend.
- Beschreibung: 2-4 Sätze mit Keywords + 3-5 Hashtags (#Wikinger #NordischeMythologie ...).
- Link: die Blog-Artikel-URL (DE-Board → /blog/..., ggf. EN-Board → /en/blog/...).
- Board: nach Artikel-Kategorie (siehe oben).

## Alt-Pin-Umstellung (bestehende ~Spotify-Pins)
Per API die vorhandenen Pins auslesen, bei denen der Ziel-Link direkt auf Spotify zeigt →
Link auf den thematisch passenden Blog-Artikel umschreiben. SCHRITTWEISE (~25/Tag),
damit Pinterest keine Spam-Welle erkennt.

## Aktivierung (sobald "Geheimer Schlüssel" NICHT mehr "ausstehend")
1. App-Secret + Access-Token in `pinterest-zugang.txt` (Desktop) ablegen — NICHT in den Chat.
2. Redirect-URI in der App: `http://localhost:8085/callback` (einmalig eintragen).
3. Einmaliger OAuth-Flow (Scope u.a. `pins:write`, `boards:read`) → Refresh-Token holen.
4. Refresh-Token als GitHub-Secret hinterlegen (Tresor, nicht im Code).
5. `content/pins-queue/` + `scripts/publish-pin.mjs` + `.github/workflows/daily-pins.yml`
   analog zum Artikel-System bauen (7 Pins/Tag). Vorrats-Agent füllt die Pin-Kammer.
6. Alt-Pins schrittweise umstellen (s.o.).

## Bereits fertig
- Pin-Bild-Generator `scripts/lib/make-pin.mjs` (getestet).
- Datenschutzseite `/datenschutz` (Pflichtfeld der Pinterest-App).
