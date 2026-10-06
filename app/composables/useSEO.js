// SEO par page : titre, description, Open Graph et URL canonique.
// Les "key" évitent les doublons avec les valeurs par défaut de nuxt.config.ts.
export function useSEO({ title, description, image, path = '' }) {
  const baseUrl = 'https://www.gabincaron.com'
  const url = `${baseUrl}${path === '/' ? '' : path}`
  // Image de partage : celle de la page, sinon celle de Prismic > meta (chargée par app.vue)
  const { data: layout } = useNuxtData('layout')
  const ogImage = computed(() => image || layout.value?.meta?.data?.image?.url || '')

  useHead({
    title,
    meta: [
      { key: 'description', name: 'description', content: description },

      // Open Graph
      { key: 'og:title', property: 'og:title', content: title },
      { key: 'og:description', property: 'og:description', content: description },
      { key: 'og:image', property: 'og:image', content: ogImage },
      { key: 'og:url', property: 'og:url', content: url },
      { key: 'og:type', property: 'og:type', content: 'website' }
    ],
    link: [
      { key: 'canonical', rel: 'canonical', href: url }
    ]
  })
}
