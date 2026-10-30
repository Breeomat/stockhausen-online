// „Stand der Angaben“ je Seite (Pfad ohne Basis, mit Schrägstrich am Ende → JJJJ-MM).
// Erscheint unten auf der Seite. Nach dem Prüfen einer Seite das Datum hier aktualisieren.
// Seiten, deren Stand älter als ein Jahr ist, zeigt `veralteteSeiten()` (für die jährliche Durchsicht).
export const stand: Record<string, string> = {
  'vereine/arbeitskreis-dorfgeschichte/': '2026-10',
  'vereine/feuerwehr/': '2026-10',
  'vereine/gefriergemeinschaft/': '2026-10',
  'vereine/gesangverein/': '2026-10',
  'vereine/kirchengemeinde/': '2026-10',
  'vereine/kirmesburschen/': '2026-10',
  'vereine/obst-und-gartenbauverein/': '2026-10',
  'vereine/posaunenchor/': '2026-10',
  'vereine/schlepperfreunde/': '2026-10',
  'vereine/schuetzenverein/': '2026-10',
  'vereine/sv-stockhausen/': '2026-10',
  'wer-macht-was/': '2026-10',
  'wer-macht-was/desert-oak/': '2026-10',
  'neu-im-dorf/': '2026-10',
  'ortsbeirat/': '2026-10',
  'dorf/': '2026-10',
  'dorf/gemeinschaft-altenschlirf/': '2026-10',
  'dorf/karte/': '2026-10',
  'dorf/karte/drohnenflug/': '2026-10',
  'dorf/suehnekreuz-stickelstein/': '2026-10',
  'dorf/saba-weg/': '2026-10',
  'tante-enso/': '2026-10',
  'ortsdurchfahrt/': '2026-10',
};

export const standText = (jjjjmm: string) =>
  new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(new Date(`${jjjjmm}-15T12:00:00`));

export const veralteteSeiten = (heute: string) => {
  const grenze = `${Number(heute.slice(0, 4)) - 1}${heute.slice(4, 7)}`;
  return Object.entries(stand).filter(([, d]) => d <= grenze).map(([pfad]) => pfad);
};
