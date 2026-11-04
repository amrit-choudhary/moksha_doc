import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: 'vesper', wrap: false },
  },
});
