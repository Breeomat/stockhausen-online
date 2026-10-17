import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Eigene Domain: stockhausen-online.de (GitHub Pages, Custom Domain; DNS siehe CLAUDE.md)
// Sitemap (sitemap-index.xml) für Suchmaschinen, Verweis in public/robots.txt
export default defineConfig({
  site: 'https://stockhausen-online.de',
  base: '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
