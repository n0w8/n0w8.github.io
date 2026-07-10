// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Live-Adresse: blog.nordwaldrecords.com (easyname-Webspace, Deploy via FTP-Action).
// Steuert Sitemap, Canonical-URLs und hreflang — bei Domain-Wechsel hier ändern.
export default defineConfig({
  site: 'https://blog.nordwaldrecords.com',
  server: { port: Number(process.env.PORT) || 4321, host: true },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
