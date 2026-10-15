import type { Termin } from './termine';

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Berlin',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

const kompakt = (iso: string) => iso.replaceAll('-', '');
const zeit = (hhmm: string) => `${hhmm.replace(':', '')}00`;
const escape = (text: string) => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

function folgetag(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Zeilen nach RFC 5545 auf 75 Oktette falten
function falten(zeile: string): string {
  const bytes = new TextEncoder().encode(zeile);
  if (bytes.length <= 75) return zeile;
  const teile: string[] = [];
  let aktuell = '';
  for (const zeichen of zeile) {
    const grenze = teile.length === 0 ? 75 : 74;
    if (new TextEncoder().encode(aktuell + zeichen).length > grenze) {
      teile.push(aktuell);
      aktuell = '';
    }
    aktuell += zeichen;
  }
  teile.push(aktuell);
  return teile.join('\r\n ');
}

function ereignis(t: Termin, seite: string): string[] {
  const { titel, datum, bis, beginn, ende, ort, verein, text } = t.data;
  const zeilen = ['BEGIN:VEVENT', `UID:${t.id}@stockhausen-online.de`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`];
  if (beginn) {
    zeilen.push(`DTSTART;TZID=Europe/Berlin:${kompakt(datum)}T${zeit(beginn)}`);
    zeilen.push(`DTEND;TZID=Europe/Berlin:${kompakt(bis ?? datum)}T${zeit(ende ?? beginn)}`);
  } else {
    zeilen.push(`DTSTART;VALUE=DATE:${kompakt(datum)}`);
    zeilen.push(`DTEND;VALUE=DATE:${kompakt(folgetag(bis ?? datum))}`);
  }
  zeilen.push(`SUMMARY:${escape(titel)}`);
  if (ort) zeilen.push(`LOCATION:${escape(`${ort}, Stockhausen, 36358 Herbstein`)}`);
  zeilen.push(`DESCRIPTION:${escape([text, `Veranstalter: ${verein}`].filter(Boolean).join('\n'))}`);
  zeilen.push(`URL:${seite}`);
  zeilen.push('END:VEVENT');
  return zeilen;
}

export function kalender(termine: Termin[], seite: string): string {
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//stockhausen-online.de//Termine//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Stockhausen – Termine',
    'X-WR-TIMEZONE:Europe/Berlin',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    ...VTIMEZONE,
    ...termine.flatMap((t) => ereignis(t, seite)),
    'END:VCALENDAR',
  ];
  return zeilen.map(falten).join('\r\n') + '\r\n';
}
