import Prismic from '@prismicio/client'
import { initApi } from '../utils/prismic'

export default defineEventHandler(async (event) => {
  const api = await initApi(event)

  const response = await api.query(
    Prismic.Predicates.at('document.type', 'project'),
    { orderings: '[my.project.year desc]' }
  )

  const projects = response.results.map(doc => ({
    id: doc.id,
    title: doc.data.name,
    category: doc.data.category,
    year: doc.data.year,
    description: doc.data.description,
    tech: doc.data.tags?.map(t => t.tag).filter(Boolean) || [],
    link: doc.data.link,
    image: doc.data.image?.url
  }))

  return { projects }
})