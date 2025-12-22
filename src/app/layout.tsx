import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import localFont from 'next/font/local'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { getServerSideURL } from '@/utilities/getURL'
import { ChunkLoadErrorHandler } from '@/components/ChunkLoadErrorHandler'

const notoSansDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/RLpWK4fy6r6tOBEJg0IAKzqdFZVZxpMkXJMhnB9XjO1o90LEVcsiGqOZ-j-ox74.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: '../../public/fonts/RLpUK4fy6r6tOBEJg0IAKzqdFZVZxrktbnDB5UzBIup9PwAcHvsuEKK7_x-o175xdA.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-sans',
})

const robotoCondensed = localFont({
  src: [
    {
      path: '../../public/fonts/ieVl2ZhZI2eCN5jzbjEETS9weq8-19y7DRs5.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: '../../public/fonts/ieVj2ZhZI2eCN5jzbjEETS9weq8-19eLAQM9UvI.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-mono',
})

const gloock = localFont({
  src: [
    {
      path: '../../public/fonts/Iurb6YFw84WUY4NJhRakNrc.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  display: 'swap',
  variable: '--font-heading',
})

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
      className={cn(notoSansDisplay.variable, robotoCondensed.variable, gloock.variable)}
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
