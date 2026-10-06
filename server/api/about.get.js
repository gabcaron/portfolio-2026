import { initApi } from '../utils/prismic'

export default defineEventHandler(async (event) => {
  const api = await initApi(event)

  const about = await api.getSingle('about')

  return { about }
})