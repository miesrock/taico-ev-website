// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://taicoev.com',
  trailingSlash: 'always',
  redirects: {
    '/applications': '/',
    '/applications/roadside-ev-rescue': '/solutions/mobile-ev-charger-roadside-rescue/',
    '/applications/on-demand-charging': '/solutions/charge-on-demand/',
    '/applications/ac-output-e-generator': '/solutions/ac-output-e-generator/',
    '/applications/engineering-power-supply': '/solutions/temporary-engineering-power/',
    '/applications/pv-storage-charger': '/solutions/pv-storage-charger/',
    '/applications/pv-ess-charging-station': '/solutions/pv-ess-charging/',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/404/') && !page.includes('/preview/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/docs/**', '**/assets/**', '**/.venv/**'],
      },
    },
  },
});
