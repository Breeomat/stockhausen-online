import type { ImageMetadata } from 'astro';
import { kommendeTermine } from './termine';
import feuerwehrFoto from '../assets/fotos/feuerwehr-einsatzabteilung.jpg';
import svWappen from '../assets/fotos/sv-stockhausen-wappen.png';
import schuetzenWappen from '../assets/fotos/schuetzenverein-wappen.png';
import sportplatzFoto from '../assets/fotos/sv-sportplatz-luftbild.jpg';
import kircheFoto from '../assets/fotos/stockhausen-kirche.jpg';
import schlossFoto from '../assets/fotos/stockhausen-schloss.jpg';
import chorFoto from '../assets/fotos/posaunenchor.jpg';
import gefrierFoto from '../assets/fotos/gefrierhaus-fest.jpg';
import maibaumFoto from '../assets/fotos/ogv-maibaum.jpg';
import kirchgemeindeFoto from '../assets/fotos/kirche-stockhausen-aussen.jpg';
import kirmesFoto from '../assets/fotos/kirmesburschen-gruppe.jpg';
import schuetzenFoto from '../assets/fotos/schuetzenhaus-luftbild.jpg';
import schlepperFoto from '../assets/fotos/schlepperfreunde.jpg';
import desertOakFoto from '../assets/fotos/desert-oak-band.jpg';
import gesangFoto from '../assets/fotos/gesangverein-daemmerschoppen.jpg';

// Vereine mit eigener Seite. Weitere Vereine erscheinen automatisch, sobald sie Termine eingetragen haben.
// Reihenfolge: alphabetisch nach Name
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
    name: 'Sportverein Stockhausen 1946 e. V.',
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
    name: 'KK Schützenverein 1926/68 e.V. Stockhausen',
    kurz: 'Schützenverein',
    seit: 'seit 1926/68 · Schützenbezirk 25 Vogelsberg',
    text: 'Luftgewehr, Auflage, Kleinkaliber und Bogen – vom Jungschützen bis zur Seniorenmannschaft. Schnupperschießen möglich.',
    href: 'vereine/schuetzenverein/',
    wappen: schuetzenWappen,
    bild: { src: schuetzenFoto, nachweis: 'Foto: Marc Ahne', position: '50% 40%' },
  },
  {
    name: 'Schlepperfreunde Stockhausen',
    kurz: 'Schlepperfreunde',
    seit: 'Oldtimer-Traktoren',
    text: 'Lanz Bulldog, Hanomag, Deutz und Co.: Liebhaber historischer Landtechnik, die ihre Schlepper pflegen und bei Ausfahrten und Festen zeigen.',
    href: 'vereine/schlepperfreunde/',
    bild: { src: schlepperFoto, nachweis: 'Foto: Marc Ahne', position: '50% 60%' },
  },
  {
    name: 'Gefriergemeinschaft Stockhausen e. V.',
    kurz: 'Gefrier',
    seit: 'seit 1963',
    text: 'Gemeinsame Gefrierfächer und Kühlraum im Gefrierhaus – seit über 60 Jahren in Betrieb.',
    href: 'vereine/gefriergemeinschaft/',
    bild: { src: gefrierFoto, nachweis: 'Foto: Marc Ahne', position: '50% 55%' },
  },
  {
    name: 'Obst- und Gartenbauverein Stockhausen 1889',
    kurz: 'Gartenbau',
    seit: 'seit 1889',
    text: 'Streuobstwiesen, Baumschnittkurse, Keltern im Herbst und ein grünes Dorfbild.',
    href: 'vereine/obst-und-gartenbauverein/',
    bild: { src: maibaumFoto, nachweis: 'Foto: Marc Ahne', position: '50% 30%' },
  },
  {
    name: 'Desert Oak',
    kurz: 'Desert Oak',
    seit: 'Rockband · seit über 20 Jahren',
    text: 'Cover- und Rockband aus Stockhausen: von AC/DC bis Westernhagen, live auf Kirmes, Stadtfesten und Rocknächten.',
    href: 'vereine/desert-oak/',
    bild: { src: desertOakFoto, nachweis: 'Foto: Desert Oak', position: '50% 30%' },
  },
  {
    name: 'Gesangverein „Germania“ Stockhausen',
    kurz: 'Gesangverein',
    seit: 'seit 1894',
    text: 'Gemischter Chor und Männerchor unter Chorleiter Kai Mertin – die CD des Männerchors gibt es beim Verein.',
    href: 'vereine/gesangverein/',
    bild: { src: gesangFoto, nachweis: 'Foto: Instagram', position: '50% 85%' },
  },
  {
    name: 'Kirmesburschen Stockhausen',
    kurz: 'Kirmes',
    seit: 'seit 1849',
    text: 'Die Stockhäuser Kirmes am letzten Oktoberwochenende: Dorfabend, Frühschoppen, Kinderkirmes und Fackelumzug in der Altfellhalle.',
    href: 'vereine/kirmesburschen/',
    bild: { src: kirmesFoto, nachweis: 'Foto: Kirmesburschen Stockhausen', position: '50% 45%' },
  },
  {
    name: 'Ev. Kirchengemeinde Stockhausen-Rixfeld',
    kurz: 'Kirchengemeinde',
    seit: 'EKHN · Dekanat Vogelsberg',
    text: 'Zwei Kirchen, ein Gemeindeleben: Gottesdienste in Stockhausen und Rixfeld, Kirchenmusik, Kinder-, Frauen- und Seniorenarbeit.',
    href: 'vereine/kirchengemeinde/',
    bild: { src: kirchgemeindeFoto, nachweis: 'Foto: Ev. Kirchengemeinde Stockhausen-Rixfeld', position: '50% 30%' },
  },
].sort((a, b) => a.name.localeCompare(b.name, 'de'));

// Hintergrundbilder für Vereine ohne eigene Seite (Teil des Vereinsnamens → Bild)
const weitereBilder: { teil: string; bild: { src: ImageMetadata; nachweis: string; position?: string } }[] = [];
export const bildFuer = (name: string) => weitereBilder.find((b) => name.includes(b.teil))?.bild;

// Einrichtungen mit eigener Seite außerhalb der Vereine (z. B. unter „Unser Dorf“)
const andereSeiten = ['Altenschlirf'];
const hatSeite = (name: string) => vereinsseiten.some((v) => name.includes(v.kurz)) || andereSeiten.some((k) => name.includes(k));

// Vereine mit kommenden Terminen, die (noch) keine eigene Seite haben
export async function weitereVereine(): Promise<string[]> {
  const namen = (await kommendeTermine()).flatMap((t) => (t.data.verein ? [t.data.verein] : []));
  return [...new Set(namen)].filter((n) => !hatSeite(n)).sort((a, b) => a.localeCompare(b, 'de'));
}
