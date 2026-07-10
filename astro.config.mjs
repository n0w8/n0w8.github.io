// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Aktuell GitHub Pages (Root-Domain n0w8.github.io). Sobald deine eigene Domain
// da ist: hier auf 'https://deine-domain.com' ändern (wichtig für Sitemap/SEO).
export default defineConfig({
  site: 'https://n0w8.github.io',
  server: { port: Number(process.env.PORT) || 4321, host: true },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
