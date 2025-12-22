import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { ErrorHandler } from '@/components/ErrorHandler'
import FontLoaderFrontend from '@/components/FontLoaderFrontend'
import FontStylesFrontend from '@/components/FontStylesFrontend'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { fontVariables } from '@/lib/fonts'
import { draftMode } from 'next/headers'
import { cn } from '@/utilities/ui'

import './globals.css'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <>
      <InitTheme />
      <FontLoaderFrontend />
      <FontStylesFrontend />
      <ErrorHandler />
      <Providers>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <div className={cn('min-h-dvh flex flex-col', fontVariables)}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </Providers>
    </>
  )
}
