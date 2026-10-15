export const url = (pfad = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${pfad.replace(/^\//, '')}`;

export const navigation = [
  { href: '', label: 'Start' },
  { href: 'termine/', label: 'Termine' },
  { href: 'vereine/', label: 'Vereine' },
  { href: 'plakate/', label: 'Plakatwand' },
  { href: 'tante-enso/', label: 'Tante Enso' },
  { href: 'dorf/', label: 'Unser Dorf' },
];
