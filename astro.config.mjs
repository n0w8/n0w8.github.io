// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Trage hier später deine echte Domain ein – wichtig für Sitemap & Canonical-URLs (SEO)
export default defineConfig({
  site: 'https://nordweg.example.com',
  server: { port: Number(process.env.PORT) || 4321, host: true },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
