import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	debug: true,
	runtimeConfig: {
		mongoUri: '',
		public: {
			cdnUrl: '',
		}
	},
	colorMode: {
		preference: 'light', // default value of $colorMode.preference
		fallback: 'light', // fallback value if not system preference found
		storage: 'localStorage', // or 'sessionStorage' or 'cookie'
		storageKey: 'nuxt-color-mode'
	},
	modules: [
		'@nuxt/content',
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/scripts',
		'@nuxt/ui'
	],
	eslint: {
		config: {
			stylistic: true // <---
		}
	},
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [
			tailwindcss()
		]
	},
	content: {
		build: {
			markdown: {
				highlight: {
					theme: 'github-light',
				}
			},
		},
		renderer: {
			anchorLinks: false
		}
	}
});
