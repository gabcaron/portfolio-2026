import Prismic from '@prismicio/client'

export const initApi = (event) => {
    const config = useRuntimeConfig()

    if (!config.prismicEndpoint || !/^https?:\/\//.test(config.prismicEndpoint)) {
        // Détail technique uniquement dans les logs serveur, jamais envoyé au visiteur
        console.error('[Prismic] PRISMIC_ENDPOINT manquant ou invalide : vérifiez le fichier .env')
        throw createError({
            statusCode: 503,
            statusMessage: 'Service Unavailable'
        })
    }

    return Prismic.client(config.prismicEndpoint, {
        accessToken: config.prismicAccessToken,
        req: event.node.req
    })
}
