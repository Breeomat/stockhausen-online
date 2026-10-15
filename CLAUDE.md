# stockhausen-online

Dorfseite für 36358 Herbstein-Stockhausen. Astro 5, statisch, Hosting über GitHub Pages
(Workflow `.github/workflows/deploy.yml`, baut bei jedem Push auf `main` und täglich nachts neu).

## Inhalte pflegen
- Termine: `src/content/termine.yaml` (Felder siehe Kommentar in der Datei). Vergangene Termine fallen automatisch weg.
- Plakate: Bild nach `src/assets/plakate/`, Eintrag in `src/content/plakate.yaml`. Nach `gueltig_bis` → Archiv.
- Bilder/Plakate liefert der Betreiber über Google Drive (Ordner „Stockhausen-Webseite/Eingang“).
- Nichts erfinden. Fehlende Angaben als `<span class="fehlt">[fehlt: …]</span>` markieren.
- Personenfotos nur Gruppen oder mit Einwilligung.

## Technik
- Links immer über `url()` aus `src/lib/site.ts` (Basis-Pfad).
- Farben/Schriften: Tokens in `src/styles/global.css`, Schriften lokal (Fontsource), keine externen Dienste.
- Vor dem Push: `npm run build` muss fehlerfrei laufen.

## Domain-Umstellung (noch offen)
`astro.config.mjs`: `site: 'https://stockhausen-online.de'`, `base: '/'`; Datei `public/CNAME` mit `stockhausen-online.de`.
