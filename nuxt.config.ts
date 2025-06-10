import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
        },
      },
    },
    renderer: {
      anchorLinks: false,
    },
  },
  runtimeConfig: {
    mongoUri: '',
    public: {
      cdnUrl: '',
    },
  }, compatibilityDate: '2025-05-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  debug: true,
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
    },
  },
});
