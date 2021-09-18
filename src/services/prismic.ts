import Prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(
    process.env.PRISMIC_ENDPOINT,
    {
      req, // request (server side)
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  )

  return prismic
}
