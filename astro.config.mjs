import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  trailingSlash: 'never',
  build: { format: 'file' },
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  })
});
