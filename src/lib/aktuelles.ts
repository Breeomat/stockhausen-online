import { aktion, aktionLaeuft, baustelle, baustelleAktiv } from './enso';

// Kacheln für „Aktuelles“ (Startseite und /aktuelles/). Nur Einträge mit aktiv() === true erscheinen.
// ton: 'warnung' (gelb, z. B. Baustelle) oder 'info' (Ziegelton)
export interface Meldung { marke: string; titel: string; text: string; href: string; linkText: string; ton: 'warnung' | 'info'; aktiv: () => boolean }

export const meldungen: Meldung[] = [
  {
    marke: 'Baustelle',
    titel: 'Ortsdurchfahrt voll gesperrt',
    text: baustelle.text.replace(/^Ortsdurchfahrt voll gesperrt \((.*?)\)\. /, 'Vom $1. '),
    href: 'ortsdurchfahrt/',
    linkText: 'Umleitungen und Infos',
    ton: 'warnung',
    aktiv: baustelleAktiv,
  },
  {
    marke: 'Tante Enso',
    titel: 'Das Lädchen wird ein Tante-Enso-Laden',
    text: `${aktion.stand} Teilhaber – das Ziel von ${aktion.ziel} ist erreicht. Das Lädchen in der Welzgasse wird ein Tante-Enso-Laden, Betreiber bleibt die Gemeinschaft Altenschlirf.${aktionLaeuft() ? ` Mitmachen geht noch bis ${aktion.fristText}.` : ''}`,
    href: 'tante-enso/',
    linkText: 'Stand und Infos',
    ton: 'info',
    aktiv: () => true,
  },
];

export const aktuelleMeldungen = () => meldungen.filter((m) => m.aktiv());
