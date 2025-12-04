// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  // Your custom configs here
  ignores: [
    '.data/',
    '.output/',
    '.nuxt/',
    '.node_modules/',
    'public/',
  ],
});
