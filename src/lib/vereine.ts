import { kommendeTermine } from './termine';
import feuerwehrFoto from '../assets/fotos/feuerwehr-einsatzabteilung.jpg';
import svWappen from '../assets/fotos/sv-stockhausen-wappen.png';

// Vereine mit eigener Seite. Weitere Vereine erscheinen automatisch, sobald sie Termine eingetragen haben.
export const vereinsseiten = [
  {
    name: 'Freiwillige Feuerwehr Stockhausen e.V.',
    kurz: 'Feuerwehr',
    seit: 'seit 1874',
    text: '57 Aktive, 183 Mitglieder und 150 Jahre Geschichte – von der Spritzenmannschaft bis zum LF 10.',
    href: 'vereine/feuerwehr/',
    bild: { src: feuerwehrFoto, nachweis: 'Foto: Christian Heuser' },
  },
  {
    name: 'SV Stockhausen e.V.',
    kurz: 'SV Stockhausen',
    seit: 'seit 1946',
    text: 'Fußball, Leichtathletik, Tischtennis, Volleyball, Gymnastik und eine Theatergruppe – Sport und Kultur für Jung und Alt.',
    href: 'vereine/sv-stockhausen/',
    wappen: svWappen,
  },
];

const hatSeite = (name: string) => vereinsseiten.some((v) => name.includes(v.kurz));

// Vereine mit kommenden Terminen, die (noch) keine eigene Seite haben
export async function weitereVereine(): Promise<string[]> {
  const namen = (await kommendeTermine()).flatMap((t) => (t.data.verein ? [t.data.verein] : []));
  return [...new Set(namen)].filter((n) => !hatSeite(n)).sort((a, b) => a.localeCompare(b, 'de'));
}
