import Prismic from '@prismicio/client'
import { initApi } from '../utils/prismic'
import { slugify } from '../utils/slugify'

// Valeurs affichées quand un champ "case study" est vide dans Prismic
const DEFAULTS = {
  type: 'Project',
  client: '—',
  summary: '',
  focus: '—',
  tagline: '',
  challenge: '',
  approach: '',
  outcome: ''
}

const clean = value => (typeof value === 'string' ? value.trim() : value)

// N'accepte que les liens http(s) : bloque "javascript:…" ou toute autre URL exotique
const safeUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url.trim()) ? url.trim() : null)

// "Terre d'Opale Habitat" -> { start: "Terre d'Opale", last: "Habitat" }
function splitTitle(title = '') {
  const words = title.trim().split(' ')
  const last = words.length > 1 ? words.pop() : ''
  return { start: words.join(' '), last }
}

export default defineEventHandler(async (event) => {
  const api = await initApi(event)

  const response = await api.query(
    Prismic.Predicates.at('document.type', 'project'),
    { orderings: '[my.project.year]', pageSize: 100 }
  )

  const projects = response.results
    .map(({ id, data }) => {
      const extra = { titleSplit: splitTitle(data.name) }
      Object.keys(DEFAULTS).forEach(key => {
        extra[key] = clean(data[key]) || DEFAULTS[key]
      })

      return {
        id,
        uid: slugify(data.name) || id,
        title: data.name,
        category: data.category,
        year: data.year,
        description: data.description,
        tech: data.tags?.map(t => t.tag).filter(Boolean) || [],
        link: safeUrl(data.link),
        image: data.image?.url,
        extra
      }
    })
    // Du plus ancien au plus récent (year peut être un texte côté Prismic)
    .sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))

  return { projects }
})
