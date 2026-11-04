import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mokshaengine.com',
  output: 'static',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'vesper', wrap: false },
  },
});
