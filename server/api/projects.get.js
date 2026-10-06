import Prismic from '@prismicio/client'
import { initApi } from '../utils/prismic'

// "Terre d'Opale Habitat" -> "terredopalehabitat" : sans accent, sans espace, lettres uniquement
const slugify = (title = '') =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()

export default defineEventHandler(async (event) => {
  const api = await initApi(event)

  const response = await api.query(
    Prismic.Predicates.at('document.type', 'project'),
    { orderings: '[my.project.year]', pageSize: 100 }
  )

  const projects = response.results
    .map(doc => ({
      id: doc.id,
      uid: slugify(doc.data.name) || doc.id,
      title: doc.data.name,
      category: doc.data.category,
      year: doc.data.year,
      description: doc.data.description,
      tech: doc.data.tags?.map(t => t.tag).filter(Boolean) || [],
      link: doc.data.link,
      image: doc.data.image?.url,
      // Champs du case study
      type: doc.data.type,
      client: doc.data.client,
      summary: doc.data.summary,
      focus: doc.data.focus,
      tagline: doc.data.tagline,
      challenge: doc.data.challenge,
      approach: doc.data.approach,
      outcome: doc.data.outcome
    }))
    // Du plus ancien au plus récent (year peut être un texte côté Prismic)
    .sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))

  return { projects }
})
