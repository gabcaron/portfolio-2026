import Prismic from '@prismicio/client'

export const initApi = (event) => {
    const config = useRuntimeConfig()

    if (!config.prismicEndpoint || !/^https?:\/\//.test(config.prismicEndpoint)) {
        throw createError({
            statusCode: 500,
            statusMessage: 'PRISMIC_ENDPOINT manquant ou invalide : ajoutez-le dans le fichier .env (ex. https://votre-repo.cdn.prismic.io/api/v2)'
        })
    }

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
