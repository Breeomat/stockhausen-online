import { defineConfig } from 'astro/config';

// Eigene Domain: stockhausen-online.de (GitHub Pages, Custom Domain; DNS siehe CLAUDE.md)
export default defineConfig({
  site: 'https://stockhausen-online.de',
  base: '/',
  trailingSlash: 'always',
});
