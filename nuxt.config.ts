// nuxt.config.ts
import glsl from 'vite-plugin-glsl'

const isProd = process.env.NODE_ENV === 'production'

// En-têtes de sécurité envoyés avec chaque page
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Isole la fenêtre des pop-ups ouvertes depuis le site (liens target="_blank")
  'Cross-Origin-Opener-Policy': 'same-origin',
  // 'unsafe-inline' pour les scripts : nécessaire au payload que Nuxt insère dans la page
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob: https://images.prismic.io",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
}

export default defineNuxtConfig({
  // Fige le comportement de Nitro/Nuxt à cette date (évite l'avertissement au démarrage)
  compatibilityDate: '2026-10-06',

  modules: ['@pinia/nuxt'],

  css: ['~/assets/styles/index.scss'],

  vite: {
    plugins: [glsl()],
    // Pré-bundle des dépendances pour éviter les rechargements de page en dev
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'gsap',
        'lodash/map', // CJS
        'normalize-wheel', // CJS
        'ogl'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          // quietDeps : masque les avertissements des paquets (include-media)
          quietDeps: true,
          // @import : migration vers @use à faire plus tard, on masque l'avertissement en attendant
          silenceDeprecations: ['import']
        }
      }
    }
  },

  // Uniquement en production : en dev, Vite a besoin d'eval / websocket, et le cache gênerait les tests Prismic
  routeRules: isProd
    ? {
        '/**': { headers: securityHeaders },
        // Cache 10 min : moins d'appels à Prismic, et protège contre les rafales de requêtes
        '/api/**': { swr: 600 },
        '/sitemap.xml': { swr: 3600 }
      }
    : {},

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
        { key: 'robots', name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Gabin Caron' },
        { key: 'og:type', property: 'og:type', content: 'website' },
        // Aperçu en grande image quand le lien est partagé sur X (reprend les balises Open Graph)
        { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        // Précharge les 2 polices affichées dès l'arrivée (preloader + accueil), cf. Lighthouse
        { rel: 'preload', href: '/fonts/noto-sans-300.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/noto-serif-display-300-italic.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        // Favicon boussole : SVG pour les navigateurs récents, .ico en secours
        // ?v=2 : force Safari iOS / Vercel à oublier l'ancienne icône Nuxt en cache (incrémenter si l'icône change)
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' },
        { rel: 'icon', href: '/favicon.ico?v=2', sizes: '48x48' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=2' }
      ]
    }
  }
})