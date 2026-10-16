# Fertige Artikel, blockiert durch fehlendes Hero-Bild

Diese Ordner enthalten vollstaendig recherchierte und geschriebene DE+EN-Artikel-Paare,
die NICHT in `content/queue/` liegen, weil ihnen das Pflicht-Hero-Bild fehlt.

## Warum hier und nicht in content/queue/

`scripts/publish-from-queue.mjs` veroeffentlicht blind den ersten (alphabetisch kleinsten)
Ordner aus `content/queue/` und prueft NICHT, ob `public/images/<translationKey>.jpg`
existiert. Ein unvollstaendiger Eintrag in `content/queue/` wuerde also frueher oder
spaeter live gehen - mit einem kaputten Bildpfad. Deshalb liegen diese Entwuerfe hier,
ausserhalb des Veroeffentlichungs-Workflows, bis sie fertig sind.

## Warum das Bild fehlt

Cloud-Backup-Lauf vom 2026-10-16: Dieses Sandbox-Environment blockiert per Netzwerk-Policy
ALLE Wikimedia-Hosts (commons.wikimedia.org, upload.wikimedia.org, auch en.wikipedia.org).
Bestaetigt per curl (403 "connect_rejected" am Egress-Proxy) und durch vier unabhaengige
Agenten-Laeufe, die alle denselben Fehler meldeten. `scripts/lib/set-hero-image.mjs` nutzt
intern dieselbe Commons-API und scheitert deshalb ebenfalls.

**Fix:** Umgebungs-Einstellungen (Titelleiste -> Environment-Menue -> Edit -> Network access)
-> `commons.wikimedia.org` und `upload.wikimedia.org` zu den Allowed Domains hinzufuegen
(oder Netzwerkzugriff grosszuegiger stellen).

## Wie man einen Eintrag fertigstellt

Sobald Netzwerkzugriff besteht:

```
node scripts/lib/set-hero-image.mjs <translationKey> "<category>" "<keyword>"
```

(Gibt `SOURCE=wikimedia CREDIT=...` aus und legt `public/images/<translationKey>.jpg` an.)
Credit-Zeile danach kursiv im Artikel ergaenzen, falls ein Inline-Bild gewuenscht ist.
Danach den Ordner nach `content/queue/<naechste-freie-nnn>-<translationKey>/` verschieben
und den Backlog-Eintrag in `content/topics-backlog.json` auf `status: "done"` setzen.

## Bereits recherchiert und geschrieben (nur Bild fehlt)

- `lindholm-hoje` - Lindholm Hoeje, Graeberfeld der Schiffssetzungen (Daenemark)
- `ladby-ship` - Das Ladby-Schiff, Daenemarks einziges Schiffsgrab. Konkreter Bildkandidat
  bereits identifiziert: "Ladbyskibet.jpg" (Malene Thyssen, CC BY-SA), via Wikimedia Commons.
- `kaupang` - Kaupang, Norwegens erste Handelsstadt der Wikingerzeit
- `hoen-hoard` - Der Hoen-Schatz, Norwegens groesster Wikinger-Goldfund
- `sigtuna` - Sigtuna, Koenigsstadt am Maelaren

Jeder Ordner enthaelt `de.md`, `en.md` und `slugs.json`, alle bereits selbst-geprueft
(Wortzahl, Frontmatter, interne Links, keine langen Striche, Musik-Embed).
