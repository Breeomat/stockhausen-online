import { kommendeTermine } from './termine';
import feuerwehrFoto from '../assets/fotos/feuerwehr-einsatzabteilung.jpg';
import svWappen from '../assets/fotos/sv-stockhausen-wappen.png';
import sportplatzFoto from '../assets/fotos/sv-sportplatz-luftbild.jpg';
import kircheFoto from '../assets/fotos/stockhausen-kirche.jpg';
import schlossFoto from '../assets/fotos/stockhausen-schloss.jpg';
import luftbildFoto from '../assets/fotos/stockhausen-luftbild.jpg';

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
    bild: { src: sportplatzFoto, nachweis: 'Foto: Marc Ahne' },
  },
  {
    name: 'Ev. Posaunenchor Stockhausen',
    kurz: 'Posaunenchor',
    seit: 'seit 1905',
    text: 'Blechbläsermusik in Gottesdiensten, bei Ständchen und Dorffesten – von Barock bis Pop. Nachwuchs ist willkommen.',
    href: 'vereine/posaunenchor/',
    bild: { src: kircheFoto, nachweis: 'Foto: Marc Ahne', position: '50% 45%' },
  },
];

// Hintergrundbilder für Vereine ohne eigene Seite (Teil des Vereinsnamens → Bild)
const weitereBilder = [
  { teil: 'Kirchengemeinde', bild: { src: luftbildFoto, nachweis: 'Foto: Marc Ahne', position: '50% 50%' } },
  { teil: 'Dorfgeschichte', bild: { src: schlossFoto, nachweis: 'Foto: Marc Ahne', position: '50% 40%' } },
];
export const bildFuer = (name: string) => weitereBilder.find((b) => name.includes(b.teil))?.bild;

const hatSeite = (name: string) => vereinsseiten.some((v) => name.includes(v.kurz));

// Vereine mit kommenden Terminen, die (noch) keine eigene Seite haben
export async function weitereVereine(): Promise<string[]> {
  const namen = (await kommendeTermine()).flatMap((t) => (t.data.verein ? [t.data.verein] : []));
  return [...new Set(namen)].filter((n) => !hatSeite(n)).sort((a, b) => a.localeCompare(b, 'de'));
}
