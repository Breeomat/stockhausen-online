// Strukturierte Daten (schema.org, JSON-LD) für Suchmaschinen
import type { Termin } from './termine';

const site = 'https://stockhausen-online.de';
const ort = { '@type': 'Place', name: 'Stockhausen', address: { '@type': 'PostalAddress', postalCode: '36358', addressLocality: 'Herbstein-Stockhausen', addressRegion: 'Hessen', addressCountry: 'DE' } };

// Bekannte Veranstaltungsorte mit Anschrift
const orte: Record<string, string> = { Altfellhalle: 'Bleichstraße 19' };

// Zeitzonen-Versatz für Europe/Berlin am jeweiligen Tag (+01:00 bzw. +02:00)
const versatz = (iso: string) => {
  const teil = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Berlin', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${iso}T12:00:00Z`)).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00';
  return teil.replace('GMT', '') || '+00:00';
};
const zeitpunkt = (datum: string, uhrzeit?: string) => (uhrzeit ? `${datum}T${uhrzeit}:00${versatz(datum)}` : datum);

export const webseite = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: 'Stockhausen', url: `${site}/`, inLanguage: 'de' },
    { ...ort, url: `${site}/`, description: 'Ortsteil der Stadt Herbstein im Vogelsbergkreis, Hessen.', containedInPlace: { '@type': 'City', name: 'Herbstein' } },
  ],
};

export function veranstaltungen(termine: Termin[], plakatBild: (id?: string) => string | undefined) {
  return {
    '@context': 'https://schema.org',
    '@graph': termine.map((t) => {
      const d = t.data;
      const strasse = d.ort ? orte[d.ort] : undefined;
      const bild = plakatBild(d.plakat);
      return {
        '@type': 'Event',
        name: d.titel,
        startDate: zeitpunkt(d.datum, d.beginn),
        endDate: d.bis ? zeitpunkt(d.bis, d.ende) : d.ende ? zeitpunkt(d.datum, d.ende) : undefined,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { ...ort, name: d.ort ? `${d.ort}, Stockhausen` : 'Stockhausen', address: { ...ort.address, streetAddress: strasse } },
        organizer: d.verein ? { '@type': 'Organization', name: d.verein } : undefined,
        description: d.text,
        image: bild ? [bild] : undefined,
        url: `${site}/termine/`,
      };
    }),
  };
}

export function vereine(liste: { name: string; href: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': liste.map((v) => ({ '@type': 'Organization', name: v.name, description: v.text, url: `${site}/${v.href}`, location: ort })),
  };
}
