import { initApi } from '../utils/prismic'

export default defineEventHandler(async (event) => {
  const api = await initApi(event)

  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    meta,
    navigation,
    preloader
  }
})