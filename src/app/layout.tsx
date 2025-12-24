import type { Metadata } from 'next'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { getServerSideURL } from '@/utilities/getURL'
import { ChunkLoadErrorHandler } from '@/components/ChunkLoadErrorHandler'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <ChunkLoadErrorHandler />
        {children}
      </body>
    </html>
  )
}
