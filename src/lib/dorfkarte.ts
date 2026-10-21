import { getCollection } from 'astro:content';
import daten from './dorfkarte-daten.json';

// Dorfkarte (/dorf/karte/). Grundkarte und Adresskoordinaten erzeugt scripts/dorfkarte.py aus OpenStreetMap.
// Betriebe aus „Wer macht was“ erscheinen automatisch, wenn ihre Adresse in OSM eingetragen ist.
// Weitere Orte stehen unten in `orte` (Koordinaten aus OSM, lat/lon). Fehlt ein Ort in OSM: in `fehlend` eintragen.
export const rahmen = daten.rahmen;
const adressen = daten.adressen as Record<string, [number, number]>;

export const projiziere = (lat: number, lon: number): [number, number] => [
  ((lon - rahmen.west) / (rahmen.ost - rahmen.west)) * rahmen.breite,
  ((rahmen.nord - lat) / (rahmen.nord - rahmen.sued)) * rahmen.hoehe,
];

export type Gruppe = 'treffpunkt' | 'kirche' | 'familie' | 'bus' | 'betrieb';
export const gruppenNamen: Record<Gruppe, string> = {
  treffpunkt: 'Treffpunkte und Vereine',
  kirche: 'Kirche und Geschichte',
  familie: 'Kinder und Familie',
  bus: 'Bushaltestellen',
  betrieb: 'Betriebe und Einrichtungen',
};

// id: auch Anker (#ort-…) für Links aus den Terminen; namen: Ortsangaben in termine.yaml, die auf diesen Ort zeigen
// bei: id eines anderen Orts/Verzeichniseintrags, dessen Marke mitbenutzt wird (z. B. angebaute Gebäude)
// pfeil: Hinweispfeil von der Marke aus auf einen Ort außerhalb der Karte (dx/dy in Kartenpunkten)
export interface Pfeil { text: string; dx: number; dy: number }
interface Ort { id: string; name: string; gruppe: Gruppe; lat: number; lon: number; zusatz?: string; href?: string; namen?: string[]; bei?: string; pfeil?: Pfeil }
export const orte: Ort[] = [
  { id: 'feuerwehrhaus', name: 'Feuerwehrhaus', gruppe: 'treffpunkt', lat: 50.562767, lon: 9.446901, zusatz: 'Steinweg 3', href: 'vereine/feuerwehr/', namen: ['Feuerwehrhaus'] },
  { id: 'sportlerheim', name: 'Sportlerheim', gruppe: 'treffpunkt', lat: 50.561492, lon: 9.451413, zusatz: 'an die Altfellhalle angebaut', href: 'vereine/sv-stockhausen/', namen: ['Sportlerheim'], bei: 'altfellhalle' },
  { id: 'sportplatz', name: 'Sportplatz', gruppe: 'treffpunkt', lat: 50.561455, lon: 9.45212, zusatz: 'Rasenplatz mit Laufbahn', href: 'vereine/sv-stockhausen/', namen: ['Sportplatz', 'Abfahrt am Sportplatz'] },
  { id: 'gefrierhaus', name: 'Gefrierhaus', gruppe: 'treffpunkt', lat: 50.562209, lon: 9.448704, zusatz: 'Altefeldstraße 10', href: 'vereine/gefriergemeinschaft/', namen: ['Gefrierhaus'] },
  { id: 'schuetzenhaus', name: 'Schützenhaus', gruppe: 'treffpunkt', lat: 50.56569, lon: 9.44053, zusatz: 'am Weinberg', href: 'vereine/schuetzenverein/', namen: ['Schützenhaus'] },
  { id: 'kirche', name: 'Evangelische Kirche', gruppe: 'kirche', lat: 50.56427, lon: 9.445357, zusatz: 'Am Bockelberg 4', href: 'vereine/kirchengemeinde/', namen: ['Kirche'] },
  { id: 'schloss', name: 'Schloss Stockhausen', gruppe: 'kirche', lat: 50.563582, lon: 9.444021, zusatz: 'Müser Straße 1', href: 'dorf/' },
  { id: 'friedhof', name: 'Friedhof', gruppe: 'kirche', lat: 50.56536, lon: 9.44649 },
  { id: 'riedesel-kapelle', name: 'Riedesel-Kapelle', gruppe: 'kirche', lat: 50.561508, lon: 9.434697, zusatz: 'mit Familienfriedhof; weiter im Wäldchen liegt die Conrads-Ruhe', href: 'dorf/', pfeil: { text: 'Conrads-Ruhe', dx: -78, dy: 26 } },
  { id: 'spielplatz', name: 'Spielplatz', gruppe: 'familie', lat: 50.5621818, lon: 9.4490361 },
  { id: 'spielplatz-campus', name: 'Spielplatz', gruppe: 'familie', lat: 50.5617507, lon: 9.4414777, zusatz: 'beim Campus am Park' },
  { id: 'schule', name: 'Siegfried-Pickert-Schule', gruppe: 'familie', lat: 50.561977, lon: 9.44071, zusatz: 'Am Campus 1' },
  { id: 'bus-ortsmitte', name: 'Haltestelle „Stockhausen Ortsmitte“', gruppe: 'bus', lat: 50.5626677, lon: 9.4463971 },
  { id: 'bus-kindergarten', name: 'Haltestelle „Kindergarten“', gruppe: 'bus', lat: 50.5603635, lon: 9.4486121 },
];

// Orte, die (noch) nicht in OpenStreetMap stehen – erscheinen in der Liste mit Hinweis
export const fehlend: { name: string; gruppe: Gruppe }[] = [];

// Verzeichniseinträge, die auf der Karte nicht unter „Betriebe“ stehen
const gruppeVerzeichnis: Record<string, Gruppe> = { altfellhalle: 'treffpunkt', 'kindergarten-storchennest': 'familie', kirchengemeinde: 'kirche' };
// Ortsangaben in termine.yaml → Verzeichnis-id (für Orte aus „Wer macht was“)
const ortsnamenVerzeichnis: Record<string, string> = { altfellhalle: 'altfellhalle', 'lädchen': 'laedchen-fuer-alles', lennys: 'lennys' };

export interface Eintrag { id: string; name: string; gruppe: Gruppe; zusatz?: string; href?: string }
export interface Marke { nr: number; x: number; y: number; gruppe: Gruppe; eintraege: Eintrag[]; pfeil?: Pfeil }

export const adresseAus = (a: string) => a.split(',').map((s) => s.trim()).find((s) => s in adressen || s.replace(/(\d+)[–-]\d+$/, '$1') in adressen);

export async function marken(): Promise<Marke[]> {
  const verzeichnis = (await getCollection('verzeichnis')).sort((a, b) => a.data.name.localeCompare(b.data.name, 'de'));
  const punkte: { x: number; y: number; eintrag: Eintrag; bei?: string; pfeil?: Pfeil }[] = [
    ...orte.map((o) => {
      const [x, y] = projiziere(o.lat, o.lon);
      return { x, y, pfeil: o.pfeil, bei: o.bei && `ort-${o.bei}`, eintrag: { id: `ort-${o.id}`, name: o.name, gruppe: o.gruppe, zusatz: o.zusatz, href: o.href } };
    }),
    ...verzeichnis.flatMap(({ id, data: e }) => {
      const a = e.adresse && adresseAus(e.adresse);
      if (!a) return [];
      const [x, y] = adressen[a] ?? adressen[a.replace(/(\d+)[–-]\d+$/, '$1')];
      return [{ x, y, eintrag: { id: `ort-${id}`, name: e.name, gruppe: gruppeVerzeichnis[id] ?? 'betrieb', zusatz: a, href: e.seite ?? `wer-macht-was/#eintrag-${id}` } }];
    }),
  ];
  for (const p of punkte) {
    const ziel = p.bei && punkte.find((q) => q.eintrag.id === p.bei);
    if (ziel) { p.x = ziel.x; p.y = ziel.y; }
  }
  // Einträge an derselben Stelle (z. B. zwei Betriebe im selben Haus) teilen sich eine Marke
  const liste: Marke[] = [];
  for (const p of punkte) {
    const da = liste.find((m) => Math.hypot(m.x - p.x, m.y - p.y) < 4);
    if (da) da.eintraege.push(p.eintrag);
    else liste.push({ nr: 0, x: p.x, y: p.y, gruppe: p.eintrag.gruppe, eintraege: [p.eintrag], pfeil: p.pfeil });
  }
  // Nah beieinander liegende Marken etwas auseinanderschieben, damit sich die Nummern nicht verdecken
  const abstand = 24;
  for (let runde = 0; runde < 30; runde++) {
    for (const a of liste) for (const b of liste) {
      if (a === b) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      if (d >= abstand) continue;
      const s = (abstand - d) / 2;
      a.x -= (dx / d) * s; a.y -= (dy / d) * s; b.x += (dx / d) * s; b.y += (dy / d) * s;
    }
  }
  const reihenfolge = Object.keys(gruppenNamen) as Gruppe[];
  liste.sort((a, b) => reihenfolge.indexOf(a.gruppe) - reihenfolge.indexOf(b.gruppe));
  liste.forEach((m, i) => (m.nr = i + 1));
  return liste;
}

// Ortsangabe aus einem Termin → Anker auf der Karte (oder undefined)
export const kartenAnker = (ort?: string) => {
  if (!ort) return undefined;
  const klein = ort.trim().toLowerCase();
  const o = orte.find((o) => o.namen?.some((n) => n.toLowerCase() === klein));
  if (o) return `ort-${o.id}`;
  return ortsnamenVerzeichnis[klein] ? `ort-${ortsnamenVerzeichnis[klein]}` : undefined;
};
