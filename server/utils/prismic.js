import Prismic from '@prismicio/client'

export const initApi = (event) => {
    const config = useRuntimeConfig()

    return Prismic.client(config.prismicEndpoint, {
        accessToken: config.prismicAccessToken,
        req: event.node.req
    })
}

export const HandleLinkResolver = (doc) => {
    if (doc.type === 'product') return `/detail/${doc.slug}`
    if (doc.type === 'collections') return '/collections'
    if (doc.type === 'about') return '/about'
    return '/'
}