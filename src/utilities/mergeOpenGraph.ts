import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { getSiteName } from './getSiteName'

export const mergeOpenGraph = async (
  og?: Metadata['openGraph'],
): Promise<Metadata['openGraph']> => {
  const siteName = await getSiteName()

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: 'An open-source website built with Payload and Next.js.',
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName,
    title: siteName,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
