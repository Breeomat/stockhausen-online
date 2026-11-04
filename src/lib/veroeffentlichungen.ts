// Veröffentlichungen des Ortsbeirats (Rundschreiben des Ortsvorstehers), neueste zuerst.
// Je Veröffentlichung eine Seite unter src/pages/ortsbeirat/veroeffentlichungen/<JJJJ-MM-TT-name>/ und ein Eintrag hier.
export interface Veroeffentlichung { datum: string; betreff: string; href: string; kurz: string }

export const veroeffentlichungen: Veroeffentlichung[] = [
  {
    datum: '2026-11-03',
    betreff: '„Saellemoa … – So war’s einmal …“ – Buchvorstellung am 28. November 2026',
    href: 'ortsbeirat/veroeffentlichungen/2026-11-03-buchvorstellung/',
    kurz: 'Das neue Buch über Stockhausen erscheint zum ersten Advent – Buchvorstellung „i Schmidds Soal“. Dazu: die neue Webseite und Termine im Dorf.',
  },
];

export const datumText = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
