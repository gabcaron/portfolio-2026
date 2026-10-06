import Prismic from '@prismicio/client'
import { initApi } from '../utils/prismic'
import { slugify } from '../utils/slugify'

const BASE_URL = 'https://www.gabincaron.com'

// Pages fixes du site
const STATIC_PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/projects', priority: '0.9' },
  { path: '/about', priority: '0.8' },
  { path: '/legal', priority: '0.2' }
]

// Sitemap généré à la volée : pages fixes + un case study par projet Prismic
export default defineEventHandler(async (event) => {
  let projects = []

  try {
    const api = await initApi(event)
    const response = await api.query(
      Prismic.Predicates.at('document.type', 'project'),
      { pageSize: 100 }
    )
    projects = response.results
      .map(doc => ({
        slug: slugify(doc.data.name),
        lastmod: doc.last_publication_date
      }))
      .filter(p => p.slug)
  } catch (e) {
    console.warn('[sitemap] Projets Prismic indisponibles :', e.message)
  }

  const urls = [
    ...STATIC_PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <priority>${p.priority}</priority>
  </url>`),
    ...projects.map(p => `  <url>
    <loc>${BASE_URL}/projects/${p.slug}</loc>${p.lastmod ? `
    <lastmod>${new Date(p.lastmod).toISOString()}</lastmod>` : ''}
    <priority>0.7</priority>
  </url>`)
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
})
