import { kommendeTermine } from './termine';
import feuerwehrFoto from '../assets/fotos/feuerwehr-einsatzabteilung.jpg';
import svWappen from '../assets/fotos/sv-stockhausen-wappen.png';
import sportplatzFoto from '../assets/fotos/sv-sportplatz-luftbild.jpg';
import kircheFoto from '../assets/fotos/stockhausen-kirche.jpg';
import schlossFoto from '../assets/fotos/stockhausen-schloss.jpg';
import luftbildFoto from '../assets/fotos/stockhausen-luftbild.jpg';
import chorFoto from '../assets/fotos/posaunenchor.jpg';

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
    bild: { src: chorFoto, nachweis: 'Foto: Marc Ahne', position: '50% 40%' },
  },
  {
    name: 'Arbeitskreis Dorfgeschichte Stockhausen',
    kurz: 'Dorfgeschichte',
    seit: 'Heimatforschung',
    text: 'Ortschronik, Bildarchiv und Hofgeschichten – das Gedächtnis des Dorfes. Alte Fotos und Geschichten sind willkommen.',
    href: 'vereine/arbeitskreis-dorfgeschichte/',
    bild: { src: schlossFoto, nachweis: 'Foto: Marc Ahne', position: '50% 40%' },
  },
  {
    name: 'Schützenverein Stockhausen',
    kurz: 'Schützenverein',
    seit: 'Schützenbezirk 25 Vogelsberg',
    text: 'Luftgewehr, Auflage und Kleinkaliber – vom Jungschützen bis zur Seniorenmannschaft. Schnupperschießen möglich.',
    href: 'vereine/schuetzenverein/',
  },
  {
    name: 'Gefriergemeinschaft Stockhausen',
    kurz: 'Gefrier',
    seit: 'seit 1963',
    text: 'Gemeinsame Gefrierfächer und Kühlraum im Gefrierhaus – seit über 60 Jahren in Betrieb.',
    href: 'vereine/gefriergemeinschaft/',
  },
];

// Hintergrundbilder für Vereine ohne eigene Seite (Teil des Vereinsnamens → Bild)
const weitereBilder = [
  { teil: 'Kirchengemeinde', bild: { src: luftbildFoto, nachweis: 'Foto: Marc Ahne', position: '50% 50%' } },
];
export const bildFuer = (name: string) => weitereBilder.find((b) => name.includes(b.teil))?.bild;

const hatSeite = (name: string) => vereinsseiten.some((v) => name.includes(v.kurz));

// Vereine mit kommenden Terminen, die (noch) keine eigene Seite haben
export async function weitereVereine(): Promise<string[]> {
  const namen = (await kommendeTermine()).flatMap((t) => (t.data.verein ? [t.data.verein] : []));
  return [...new Set(namen)].filter((n) => !hatSeite(n)).sort((a, b) => a.localeCompare(b, 'de'));
}
