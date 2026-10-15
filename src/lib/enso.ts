import { heute } from './termine';

// Anteilsaktion fürs Lädchen; nach Ablauf der Frist verschwinden die Hinweise automatisch
export const aktion = {
  ziel: 400,
  preis: 100,
  stand: 222,
  frist: '2026-10-21',
  fristText: 'Mittwoch, 21. Oktober',
  link: 'https://www.tanteenso.de/content/teilhaberschaft',
};

export const aktionLaeuft = () => heute() <= aktion.frist;
