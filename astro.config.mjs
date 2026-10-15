import { defineConfig } from 'astro/config';

// Solange die Domain noch nicht umgestellt ist, läuft die Seite unter
// breeomat.github.io/stockhausen-online. Nach der DNS-Umstellung:
// site: 'https://stockhausen-online.de', base: '/' und public/CNAME anlegen.
export default defineConfig({
  site: 'https://breeomat.github.io',
  base: '/stockhausen-online',
  trailingSlash: 'always',
});
