import { heute } from './termine';

// Anteilsaktion fürs Lädchen; nach Ablauf der Frist verschwinden die Hinweise automatisch
export const aktion = {
  ziel: 400, // Teilhaberschaften (Personen); mehrere Anteile einer Person zählen einfach
  preis: 100,
  stand: 474, // Tante Enso aktualisiert die Zahl nicht mehr, weil das Ziel erreicht ist
  standText: '21. Oktober 2026',
  praemie: 500, // € Dorfsponsoringprämie je weitere 100 Teilhaber
  frist: '2026-10-21',
  fristText: 'Mittwoch, 21. Oktober',
  link: 'https://www.tanteenso.de/content/teilhaberschaft',
  standort: 'https://www.tanteenso.de/content/tanteenso/standorte/stockhausen/neuigkeiten', // die frühere Standortseite gibt es nicht mehr
  // neuestes Standort-Update von Tante Enso (Inhalte auf /tante-enso/ im Kasten „Neues von Tante Enso“)
  update: { titel: 'Update 3', datumText: '9. November 2026', link: 'https://www.tanteenso.de/content/blog/2026/11/im-hintergrund-ist-tante-enso-das-passiert-bei-euch-vor-ort' },
  vorheriges: { titel: 'Update 2', datumText: '22. Oktober 2026', link: 'https://www.tanteenso.de/content/tanteenso/standorte/stockhausen/neuigkeiten/update-2' },
  neuigkeiten: 'https://www.tanteenso.de/content/tanteenso/standorte/stockhausen/neuigkeiten',
};

export const aktionLaeuft = () => heute() <= aktion.frist;

// Baustellen-Hinweis: Lädchen und Metzgerei bleiben erreichbar. Ende noch offen –
// bei bekanntem Datum `bis` setzen (JJJJ-MM-TT), dann verschwindet der Hinweis danach von selbst.
export const baustelle = {
  text: 'Ortsdurchfahrt voll gesperrt (Ortseingang aus Richtung Schadges bis „Am Weinberg“). Tante Enso und Metzgerei Günther sind trotzdem erreichbar.',
  bis: null as string | null,
};
export const baustelleAktiv = () => baustelle.bis === null || heute() <= baustelle.bis;
