// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://taicoev.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/docs/**', '**/assets/**', '**/.venv/**'],
      },
    },
  },
});
