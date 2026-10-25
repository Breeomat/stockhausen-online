import type { ImageMetadata } from 'astro';
import erntedank2026 from '../assets/fotos/erntedank-2026-stall.jpg';
import kirmes2026 from '../assets/fotos/kirmes-2026-gruppe.jpg';
import { abgelaufeneMeldungen } from './aktuelles';

// Rückblick (/aktuelles/rueckblick/): Berichte mit Fotos und abgelaufene Meldungen aus „Aktuelles“.
// Neue Berichte als eigene Seite unter src/pages/aktuelles/<name>/ anlegen und hier eintragen.
export interface Rueckblick { titel: string; datum?: string; marke?: string; text: string; href: string; bild?: { src: ImageMetadata; alt: string } }

export const rueckblicke: Rueckblick[] = [
  {
    titel: 'Stockhäuser Kirmes 2026',
    datum: '2026-10-24',
    text: 'Drei Tage Blasmusik, Livebands und Tradition in der sehr gut besuchten Altfellhalle – vom Aufspielen bis zum Fackelumzug.',
    href: 'aktuelles/kirmes-2026/',
    bild: { src: kirmes2026, alt: 'Gruppenfoto der Kirmesburschen und Kirmesmädchen 2026' },
  },
  {
    titel: 'Erntedank im Stall',
    datum: '2026-10-18',
    text: 'Ein Stall voller Menschen und eine Maus, die die Predigt hält: Erntedankgottesdienst mit dem Kindergarten Storchennest und Kartoffelfeuer.',
    href: 'aktuelles/erntedank-2026/',
    bild: { src: erntedank2026, alt: 'Voll besetzter Stall beim Erntedankgottesdienst' },
  },
];

// Alles für den Rückblick, neueste zuerst; eine abgelaufene Meldung, die schon als Bericht drinsteht, nur einmal
export function alleRueckblicke(): Rueckblick[] {
  const berichte = new Set(rueckblicke.map((r) => r.href));
  const alteMeldungen = abgelaufeneMeldungen()
    .filter((m) => !berichte.has(m.href))
    .map((m) => ({ titel: m.titel, datum: m.datum, marke: m.marke, text: m.text, href: m.href }));
  return [...rueckblicke, ...alteMeldungen].sort((a, b) => (b.datum ?? '').localeCompare(a.datum ?? ''));
}
