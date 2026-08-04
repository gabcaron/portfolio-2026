export function useSEO({ title, description, image, path = '' }) {
  const baseUrl = 'https://gabincaron.com'
  const defaultImage = image || ''

  useHead({
    title,
    meta: [
      { name: 'description', content: description },

      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: defaultImage },
      { property: 'og:url', content: `${baseUrl}${path}` },
      { property: 'og:type', content: 'website' },

      // Twitter
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: defaultImage }
    ],
    link: [
      { rel: 'canonical', href: `${baseUrl}${path}` }
    ]
  })
}