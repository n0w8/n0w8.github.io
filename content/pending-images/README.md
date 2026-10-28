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

**Erneut bestaetigt am 2026-10-24** (Cloud-Backup-Lauf, Queue-Stand 8/60): Block besteht
weiterhin unveraendert. Getestet per curl gegen `commons.wikimedia.org`, `upload.wikimedia.org`,
`commons.m.wikimedia.org`, `en.wikipedia.org` und `api.wikimedia.org` - jedes Mal 403
"connect_rejected" am Egress-Proxy. Zum Vergleich: `github.com` liefert im selben Lauf ein
normales `200 Connection Established`, d.h. der Proxy selbst funktioniert, nur Wikimedia ist
per Policy gesperrt. Es wurde daher bewusst KEIN neuer Artikel in `content/queue/` oder hier
abgelegt (die 5 bestehenden Entwuerfe unten sind inhaltlich unveraendert) und auch kein
Ersatzbild (KI-generiert oder von einer anderen Quelle als Wikimedia Commons) verwendet, da
das ausdruecklich nicht erlaubt ist. Ohne eine Anpassung der Allowed Domains bleibt dieser
Weg fuer JEDES Thema mit `imagePolicy: real-photo` blockiert, nicht nur fuer die 5 hier
gelisteten.

**Erneut bestaetigt am 2026-10-26** (Cloud-Backup-Lauf, Queue-Stand 6/60, also unter dem
20er-Schwellenwert und unter der High-Priority-Schwelle von 10): Block besteht unveraendert.
Getestet per curl gegen `commons.wikimedia.org` (403 "connect_rejected" am Egress-Proxy) und
gegen `ntfy.sh` (ebenfalls 403 "connect_rejected" - selbst der Push-Benachrichtigungskanal
dieses Agenten ist aktuell gesperrt). `__agentproxy/status` zeigt den Host explizit unter
`recentRelayFailures`. Es wurden auch dieses Mal weder neue Artikel noch Ersatzbilder erzeugt;
die 5 fertigen Entwuerfe unten sind inhaltlich unveraendert. Die Netzwerk-Policy muss in den
Environment-Einstellungen angepasst werden (Allowed Domains: commons.wikimedia.org,
upload.wikimedia.org), sonst bleibt dieser Weg bei jedem weiteren Lauf blockiert.

**Erneut bestaetigt am 2026-10-27** (Cloud-Backup-Lauf, Queue-Stand 5/60, damit erstmals
unter der High-Priority-Schwelle von 10): Block besteht weiterhin unveraendert. Getestet per
curl gegen `commons.wikimedia.org` (403 "connect_rejected" am Egress-Proxy, bestaetigt auch
durch `__agentproxy/status` unter `recentRelayFailures`) und gegen `upload.wikimedia.org`
(ebenfalls 403). Auch der ntfy.sh-Benachrichtigungskanal ist weiterhin gesperrt (403). Es
wurden daher erneut weder neue Artikel noch Ersatzbilder erzeugt; die 5 fertigen Entwuerfe
unten sind inhaltlich unveraendert. Die Vorratskammer sinkt bei jedem Lauf weiter, ohne dass
der Cloud-Backup-Agent sie fuellen kann, solange die Allowed Domains nicht angepasst werden.

**Erneut bestaetigt am 2026-10-28** (Cloud-Backup-Lauf, Queue-Stand 5/60, unter der
High-Priority-Schwelle von 10, unveraendert seit dem letzten Lauf): Block besteht weiterhin.
Getestet per curl gegen `commons.wikimedia.org` (403 "connect_rejected" am Egress-Proxy,
bestaetigt per `__agentproxy/status` unter `recentRelayFailures`) und gegen `ntfy.sh`
(ebenfalls 403 "connect_rejected" - auch der Push-Kanal dieses Agenten bleibt gesperrt,
daher konnte keine ntfy-Meldung versendet werden). Es wurden erneut weder neue Artikel noch
Ersatzbilder erzeugt; die 5 fertigen Entwuerfe unten sind inhaltlich unveraendert. Dies ist
der fuenfte aufeinanderfolgende Lauf (16., 24., 26., 27., 28.10.2026) mit identischem Befund.
Ohne eine Anpassung der Allowed Domains (commons.wikimedia.org, upload.wikimedia.org,
ntfy.sh) in den Environment-Einstellungen bleibt die Vorratskammer bei jedem weiteren
Cloud-Backup-Lauf unveraendert bei 5/60, da dieser Agent gemaess Vorgabe ausschliesslich
echte Wikimedia-Fotos verwenden darf und keine Ersatzquelle nutzen darf.

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
