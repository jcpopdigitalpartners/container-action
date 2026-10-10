import { defineConfig } from 'astro/config';
const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY || '').split('/');
const projectPages = Boolean(owner && repository && repository !== `${owner}.github.io`);
export default defineConfig({
  output: 'static',
  site: process.env.ASTRO_SITE || (owner ? `https://${owner}.github.io` : 'https://example.github.io'),
  base: process.env.ASTRO_BASE || (process.env.GITHUB_ACTIONS === 'true' && projectPages ? `/${repository}/` : '/'),
  trailingSlash: 'always',
});
