#!/usr/bin/env node
// „Was steht heute an?“ – kurze Tagesnotiz auf der Startseite (übernommen von ahne.de, scripts/logbuch.mjs).
// Läuft nachts in GitHub Actions vor dem Build (deploy.yml), nicht beim Besuch der Seite.
// Holt das Wetter (Open-Meteo, ohne Schlüssel) und die Termine der nächsten 7 Tage (eigener Kalender termine.ics
// der veröffentlichten Seite), lässt Claude daraus einen kurzen Text schreiben und speichert ihn in src/data/tagesnotiz.json.
// Ohne ANTHROPIC_API_KEY oder bei Fehlern bleibt die Datei unverändert (die Startseite zeigt die Notiz nur, wenn sie von heute ist).
//
//   ANTHROPIC_API_KEY=… node scripts/tagesnotiz.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

const ZIEL = new URL('../src/data/tagesnotiz.json', import.meta.url);
const ORT = { lat: 50.5615, lon: 9.4445 };
const heute = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date()); // JJJJ-MM-TT

// WMO-Wettercodes (Open-Meteo) in Worte
const WETTER = {
  0: 'klar', 1: 'überwiegend klar', 2: 'teils bewölkt', 3: 'bedeckt', 45: 'Nebel', 48: 'Nebel mit Reif',
  51: 'leichter Nieselregen', 53: 'Nieselregen', 55: 'starker Nieselregen', 56: 'gefrierender Nieselregen', 57: 'gefrierender Nieselregen',
  61: 'leichter Regen', 63: 'Regen', 65: 'starker Regen', 66: 'gefrierender Regen', 67: 'gefrierender Regen',
  71: 'leichter Schneefall', 73: 'Schneefall', 75: 'starker Schneefall', 77: 'Schneegriesel',
  80: 'leichte Regenschauer', 81: 'Regenschauer', 82: 'heftige Regenschauer', 85: 'Schneeschauer', 86: 'starke Schneeschauer',
  95: 'Gewitter', 96: 'Gewitter mit Hagel', 99: 'Gewitter mit starkem Hagel',
};

async function wetterHolen() {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: ORT.lat, longitude: ORT.lon, timezone: 'Europe/Berlin', forecast_days: '1',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset',
  });
  const d = (await (await fetch(url)).json()).daily;
  return {
    lage: WETTER[d.weather_code[0]] ?? 'unbekannt',
    hoechst: Math.round(d.temperature_2m_max[0]),
    tiefst: Math.round(d.temperature_2m_min[0]),
    niederschlag_mm: d.precipitation_sum[0],
    wind_kmh: Math.round(d.wind_speed_10m_max[0]),
    sonnenaufgang: d.sunrise[0].slice(11),
    sonnenuntergang: d.sunset[0].slice(11),
  };
}

// Termine der nächsten 7 Tage aus dem eigenen Kalender (einfacher ICS-Leser)
async function termineHolen() {
  const ics = (await (await fetch('https://stockhausen-online.de/termine.ics')).text()).replace(/\r?\n[ \t]/g, '');
  const bis = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10).replaceAll('-', '');
  const von = heute.replaceAll('-', '');
  return ics.split('BEGIN:VEVENT').slice(1).map((ev) => {
    const feld = (n) => ev.match(new RegExp(`^${n}[^:]*:(.*)$`, 'm'))?.[1]?.replace(/\\,/g, ',').replace(/\\n/g, ' ').trim();
    const start = feld('DTSTART') ?? '';
    return { tag: start.slice(0, 8), uhrzeit: start.length > 8 ? `${start.slice(9, 11)}:${start.slice(11, 13)}` : undefined, titel: feld('SUMMARY'), ort: feld('LOCATION') };
  }).filter((t) => t.titel && t.tag >= von && t.tag <= bis)
    .sort((a, b) => a.tag.localeCompare(b.tag))
    .slice(0, 6)
    .map((t) => ({ ...t, tag: `${t.tag.slice(0, 4)}-${t.tag.slice(4, 6)}-${t.tag.slice(6, 8)}` }));
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('Tagesnotiz: kein ANTHROPIC_API_KEY – übersprungen.');
    return;
  }
  const [wetter, termine] = await Promise.all([wetterHolen(), termineHolen().catch(() => [])]);
  const client = new Anthropic();
  const antwort = await client.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 1000,
    system:
      'Du schreibst für stockhausen-online.de, die Dorfseite von Stockhausen (Ortsteil von Herbstein im Vogelsberg, ' +
      'Hessen), eine kurze Tagesnotiz unter der Überschrift „Was steht heute an?“: zuerst das Wetter des Tages in einem ' +
      'Satz, dann die anstehenden Termine im Dorf. Ton: sachlich, freundlich, normal, keine Witze. Verwende nur die ' +
      'gelieferten Daten. Erfinde keine Ereignisse, Personen, Orte oder Zahlen. Gibt es keine Termine, schreibe, dass in ' +
      'den nächsten Tagen nichts im Kalender steht. Nenne höchstens drei Termine mit Wochentag. 2 bis 4 Sätze. ' +
      'Kein Markdown, keine Emojis, kein Datum am Anfang (das zeigt die Seite selbst). Antworte nur mit der Notiz.',
    messages: [{ role: 'user', content: JSON.stringify({ datum: heute, wetter, termine_naechste_7_tage: termine }) }],
  });
  const text = antwort.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
  if (antwort.stop_reason !== 'end_turn' || !text) {
    console.log(`Tagesnotiz: kein Eintrag (stop_reason: ${antwort.stop_reason}).`);
    return;
  }
  mkdirSync(new URL('.', ZIEL), { recursive: true });
  writeFileSync(ZIEL, JSON.stringify({ datum: heute, text, wetter, termine, erzeugt: new Date().toISOString() }, null, 1) + '\n');
  console.log(`Tagesnotiz für ${heute} geschrieben.`);
}

main().catch((fehler) => {
  // Eine fehlende Tagesnotiz darf die Veröffentlichung nicht verhindern
  console.error('Tagesnotiz: Fehler –', fehler instanceof Anthropic.APIError ? `${fehler.status} ${fehler.message}` : fehler.message);
});
