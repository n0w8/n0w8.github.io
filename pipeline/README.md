# Nordweg — Autopilot-Pipeline

Täglicher, autonomer Ablauf, der einen neuen zweisprachigen Artikel schreibt, prüft, bebildert und veröffentlicht.

## Der tägliche Loop

```
1. THEMA      → nächstes "todo" aus content/topics-backlog.json
2. AUTOR      → schreibt DE + EN Artikel (pipeline/author-agent.md)
3. BILD       → generiert Hero-Bild via Higgsfield (nano_banana_pro, 2K, fotorealistisch)
                → nach public/images/<translationKey>.jpg (auf 1600px optimiert)
4. REVIEWER   → Qualitäts-Gate (pipeline/reviewer-agent.md); FAIL → zurück an Autor
5. BUILD      → npm run build (muss fehlerfrei sein)
6. PUBLISH    → git add/commit/push → Host (Netlify/Vercel/Cloudflare) baut & deployt automatisch
7. BACKLOG    → Thema auf "done" setzen
```

## Bildgenerierung (Schritt 3)

Modell: `nano_banana_pro`, `aspect_ratio: "16:9"`, `resolution: "2k"`.
Prompt-Formel für konsistenten Look:
> „Photorealistic cinematic film still of \<Motiv\>, \<Stimmung\>, dramatic lighting, shot on cinema camera, hyperrealistic detail, film grain, no text"

Danach herunterladen und mit `sharp` auf 1600px Breite / JPEG q82 optimieren
(Vorlage: `scripts/fetch-images.mjs`).

## Frequenz

Empfohlen: **1 Artikel/Tag** in der Aufbauphase (Monat 1–3), danach 3–4/Woche + Aktualisierung alter Artikel.
Der Backlog enthält aktuell 20 vorbereitete Themen — läuft also ~3 Wochen ohne Nachschub.
Neue Themen einfach unten in `topics-backlog.json` anhängen.

## Auslösung

Als geplante Cloud-Routine (Cron) täglich, z. B. 06:00. Die Routine führt genau diesen Loop aus.
Siehe `DEPLOY.md` für die Einrichtung (GitHub + Host verbinden).
