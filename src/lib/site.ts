export const url = (pfad = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${pfad.replace(/^\//, '')}`;

export const navigation = [
  { href: '', label: 'Start' },
  { href: 'termine/', label: 'Termine' },
  { href: 'vereine/', label: 'Vereine' },
  { href: 'wer-macht-was/', label: 'Wer macht was' },
  { href: 'plakate/', label: 'Plakatwand' },
  { href: 'aktuelles/', label: 'Aktuelles' },
  { href: 'dorf/', label: 'Unser Dorf' },
  { href: 'ortsbeirat/', label: 'Ortsbeirat' },
];
