// nuxt.config.ts
import glsl from 'vite-plugin-glsl'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],

  css: ['~/assets/styles/index.scss'],

  vite: {
    plugins: [glsl()],
    optimizeDeps: {
      include: ['lodash/map', 'normalize-wheel']
    }
  },

  runtimeConfig: {
    prismicEndpoint: process.env.PRISMIC_ENDPOINT,
    prismicAccessToken: process.env.PRISMIC_ACCESS_TOKEN,
    public: {
      googleAnalytics: process.env.GOOGLE_ANALYTICS
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'author', content: 'Gabin Caron' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Gabin Caron' },
        { key: 'og:type', property: 'og:type', content: 'website' }
      ],
      link: [
        // Typo des pages Projects / Case study
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500&family=Noto+Serif+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap' },
        // Favicon boussole : SVG pour les navigateurs récents, .ico en secours
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  }
})