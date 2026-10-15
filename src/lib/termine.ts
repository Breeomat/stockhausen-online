import { getCollection, type CollectionEntry } from 'astro:content';

export type Termin = CollectionEntry<'termine'>;

const zeitzone = 'Europe/Berlin';

export function heute(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: zeitzone }).format(new Date());
}

export const letzterTag = (t: Termin) => t.data.bis ?? t.data.datum;

export async function kommendeTermine(): Promise<Termin[]> {
  const stichtag = heute();
  return (await getCollection('termine'))
    .filter((t) => letzterTag(t) >= stichtag)
    .sort((a, b) => (a.data.datum + (a.data.beginn ?? '')).localeCompare(b.data.datum + (b.data.beginn ?? '')));
}

const alsDatum = (iso: string) => new Date(`${iso}T12:00:00`);

export const wochentagKurz = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(alsDatum(iso)).replace('.', '');
export const tag = (iso: string) => String(Number(iso.slice(8, 10)));
export const monatKurz = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(alsDatum(iso)).replace('.', '');
export const monatLang = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(alsDatum(iso));
export const datumLang = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(alsDatum(iso));

export function zeitraum(t: Termin): string {
  const { beginn, ende, bis } = t.data;
  const teile: string[] = [];
  if (bis) teile.push(`bis ${new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' }).format(alsDatum(bis))}`);
  if (beginn) teile.push(ende ? `${beginn}–${ende} Uhr` : `ab ${beginn} Uhr`);
  return teile.join(' · ');
}

export function gruppiertNachMonat(termine: Termin[]): [string, Termin[]][] {
  const gruppen = new Map<string, Termin[]>();
  for (const t of termine) {
    const schluessel = t.data.datum.slice(0, 7);
    gruppen.set(schluessel, [...(gruppen.get(schluessel) ?? []), t]);
  }
  return [...gruppen.entries()].map(([monat, liste]) => [monatLang(`${monat}-01`), liste]);
}
