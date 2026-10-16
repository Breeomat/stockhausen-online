# stockhausen-online

Dorfseite für 36358 Herbstein-Stockhausen. Astro 5, statisch, Hosting über GitHub Pages
(Workflow `.github/workflows/deploy.yml`, baut bei jedem Push auf `main` und täglich nachts neu).

## Inhalte pflegen
- Termine: `src/content/termine.yaml` (Felder siehe Kommentar in der Datei). Vergangene Termine fallen automatisch weg.
- Plakate: Bild nach `src/assets/plakate/`, Eintrag in `src/content/plakate.yaml`. Nach `gueltig_bis` → Archiv.
- Bilder/Plakate liefert der Betreiber über Google Drive, Ordner „Stockhausen-Webseite“:
  - „Plakate“ (Ordner-ID 16d65tlcJ2OzsJkx36GuNBOwnsk6SqfCc)
  - „Fotos und Sonstiges“ (Ordner-ID 1gykGhG4TPb4o3Ep1tVcJaSTgClbFIT1Z)
  Nach dem Einbau Bilder für das Web verkleinern (max. ca. 1600 px, JPG).
- Nichts erfinden. Fehlende Angaben als `<span class="fehlt">[fehlt: …]</span>` markieren.
- Personenfotos nur Gruppen oder mit Einwilligung.
- Kurse und regelmäßige Angebote (z. B. Gymnastik donnerstags): KEINE Einzeltermine im Kalender, nur ein Hinweis auf der
  Vereinsseite (Zeit, Ort, Ansprechperson). Ein Plakat dazu einmal auf die Plakatwand (`gueltig_bis` = Kursende).
- Orte: „Mehrzweckhalle“, „Turnhalle“ und „DGH Stockhausen“ meinen die Altfellhalle (Bleichstraße 19, am Sportplatz). In Terminen immer „Altfellhalle“ schreiben.
- Neue Plakate: Eine geplante Aufgabe prüft täglich um ca. 20 Uhr den Drive-Ordner „Plakate“, liest neue Dateien ein
  (Bild verkleinern, Eintrag in `plakate.yaml` und `termine.yaml`) und veröffentlicht direkt.
  Verarbeitete Dateien stehen in `src/content/plakate-eingelesen.txt` – nur Dateien, deren ID dort fehlt, sind neu.

## Technik
- Links immer über `url()` aus `src/lib/site.ts` (Basis-Pfad).
- Farben/Schriften: Tokens in `src/styles/global.css`, Schriften lokal (Fontsource), keine externen Dienste.
- Vor dem Push: `npm run build` muss fehlerfrei laufen.

## Domain
Die Seite läuft unter https://stockhausen-online.de (`astro.config.mjs`: `site`, `base: '/'`; `public/CNAME`).
GitHub Pages → Settings → Pages → Custom domain `stockhausen-online.de`, „Enforce HTTPS“ an.
DNS beim Domain-Anbieter: A-Records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153;
AAAA 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153; `www` als CNAME auf `breeomat.github.io`.
