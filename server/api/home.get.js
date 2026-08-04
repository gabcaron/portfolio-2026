import { initApi } from "../utils/prismic"

export default defineEventHandler(async (event) => {
    const api = await initApi(event)
    const home = await api.getSingle('home')

    return { home }
})