# Nordweg — Live gehen & Autopilot aktivieren

## Schritt 1 — Code auf GitHub

Das Projekt ist bereits ein Git-Repository (initialer Commit vorhanden). Nur noch zu GitHub pushen:

```bash
# Auf github.com ein neues, leeres Repo anlegen (z. B. "nordweg"), dann:
git remote add origin https://github.com/<DEIN-NAME>/nordweg.git
git branch -M main
git push -u origin main
```

## Schritt 2 — Hosting verbinden (empfohlen: Netlify)

1. Auf [netlify.com](https://netlify.com) einloggen → **Add new site → Import from GitHub** → das `nordweg`-Repo wählen.
2. Netlify liest `netlify.toml` automatisch (Build: `npm run build`, Ausgabe: `dist`). Nur bestätigen.
3. **Deploy** klicken. Nach ~1 Min ist die Seite live unter `dein-name.netlify.app`.
4. Eigene Domain: **Domain settings → Add custom domain**.

> Alternativen mit identischer Config: **Cloudflare Pages** oder **Vercel** (Build `npm run build`, Output `dist`).

## Schritt 3 — Domain in die Config eintragen

In `astro.config.mjs` `site:` auf deine echte Domain setzen (wichtig für Sitemap, Canonical, hreflang) und pushen.

## Schritt 4 — Autopilot aktivieren

Sobald das Repo auf GitHub liegt, läuft der tägliche Loop (siehe `pipeline/README.md`) als geplante Cloud-Routine:

- **Voll-Autopilot:** Routine läuft täglich → Autor + Reviewer + Bild → `git push` → Netlify deployt automatisch. Kein manueller Eingriff.
- Der Reviewer-Agent ist das Qualitäts-Gate; nur bestandene Artikel werden gepusht.

**Ab jetzt aktualisiert sich die Seite jeden Tag von selbst.** Neue Themen: einfach in `content/topics-backlog.json` ergänzen.

## Wichtig vor dem ersten Live-Push

- `astro.config.mjs` → echte Domain
- `public/robots.txt` & Sitemap-URL → echte Domain
- Optional: Google Search Console + GA4 einrichten (Tracking ab Tag 1)
