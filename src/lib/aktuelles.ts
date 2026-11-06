import { baustelle, baustelleAktiv } from './enso';
import { heute } from './termine';

// Kacheln für „Aktuelles“ (Startseite und /aktuelles/). Nur Einträge mit aktiv() === true erscheinen.
// ton: 'warnung' (gelb, z. B. Baustelle) oder 'info' (Ziegelton)
// Abgelaufene Meldungen (aktiv() === false) erscheinen automatisch im Rückblick (/aktuelles/rueckblick/);
// datum (JJJJ-MM-TT) bestimmt dort die Reihenfolge.
export interface Meldung { marke: string; titel: string; text: string; href: string; linkText: string; ton: 'warnung' | 'info'; aktiv: () => boolean; datum?: string }

// Die Tante-Enso-Kachel wurde am 06.11.2026 auf Wunsch des Betreibers entfernt (Infos weiter unter /tante-enso/).
export const meldungen: Meldung[] = [
  {
    marke: 'Baustelle',
    titel: 'Ortsdurchfahrt voll gesperrt',
    text: baustelle.text.replace(/^Ortsdurchfahrt voll gesperrt \((.*?)\)\. /, 'Vom $1. '),
    href: 'ortsdurchfahrt/',
    linkText: 'Umleitungen und Infos',
    ton: 'warnung',
    aktiv: baustelleAktiv,
    datum: baustelle.bis ?? undefined,
  },
  {
    marke: 'Neues Buch',
    titel: '„Saellemoa … – So war’s einmal …“',
    text: 'Pünktlich zum ersten Advent erscheint das neue Buch des Arbeitskreises Dorfgeschichte: über 260 Seiten Geschichte und Geschichten aus Stockhausen. Buchvorstellung am Samstag, 28. November, um 14 Uhr „i Schmidds Soal“ (Lenny’s im Saal).',
    href: 'vereine/arbeitskreis-dorfgeschichte/#saellemoa',
    linkText: 'Mehr zum Buch',
    ton: 'info',
    aktiv: () => heute() <= '2026-11-28',
    datum: '2026-11-28',
  },
];

export const aktuelleMeldungen = () => meldungen.filter((m) => m.aktiv());
export const abgelaufeneMeldungen = () => meldungen.filter((m) => !m.aktiv());
