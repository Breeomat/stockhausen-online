import { heute } from './termine';

// Anteilsaktion fürs Lädchen; nach Ablauf der Frist verschwinden die Hinweise automatisch
export const aktion = {
  ziel: 400, // Teilhaberschaften (Personen); mehrere Anteile einer Person zählen einfach
  preis: 100,
  stand: 453,
  standText: '14. Oktober 2026',
  naechsterStandText: '21. Oktober',
  praemie: 500, // € Dorfsponsoringprämie je weitere 100 Teilhaber
  frist: '2026-10-21',
  fristText: 'Mittwoch, 21. Oktober',
  link: 'https://www.tanteenso.de/content/teilhaberschaft',
  standort: 'https://www.tanteenso.de/content/tanteenso/standorte/stockhausen',
};

export const aktionLaeuft = () => heute() <= aktion.frist;

// Baustellen-Hinweis: Lädchen und Metzgerei bleiben erreichbar. Ende noch offen –
// bei bekanntem Datum `bis` setzen (JJJJ-MM-TT), dann verschwindet der Hinweis danach von selbst.
export const baustelle = {
  text: 'Trotz Baustelle erreichbar: Tante Enso und Metzgerei Günther sind weiterhin für euch da.',
  bis: null as string | null,
};
export const baustelleAktiv = () => baustelle.bis === null || heute() <= baustelle.bis;
