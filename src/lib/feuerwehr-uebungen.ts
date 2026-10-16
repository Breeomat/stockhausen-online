import { heute } from './termine';

// Übungsdienste der Feuerwehr – übernommen aus dem Google-Kalender „FFW“ (Stand 16.10.2026).
// Nur auf der Feuerwehrseite, nicht im allgemeinen Kalender (regelmäßiger Übungsbetrieb). Vergangene fallen weg.
export const uebungen = [
  { datum: '2026-10-18', beginn: '10:00', ende: '12:00', titel: 'Kates Zugübung' },
  { datum: '2026-10-20', beginn: '19:30', ende: '21:30', titel: 'Gruppenübung – Löscheinsatz' },
  { datum: '2026-11-05', beginn: '19:30', ende: '21:30', titel: 'Gruppenübung – Objektkunde' },
  { datum: '2026-11-24', beginn: '19:30', ende: '21:30', titel: 'Gruppenübung – Löscheinsatz' },
  { datum: '2026-12-17', beginn: '19:30', ende: '21:30', titel: 'Gruppenübung – Wasserförderung' },
];

export const kommendeUebungen = () => uebungen.filter((u) => u.datum >= heute());
