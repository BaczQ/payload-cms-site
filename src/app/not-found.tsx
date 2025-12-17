import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'

import FrontendNotFound from './(frontend)/not-found'

export const metadata: Metadata = {
  title: 'Страница не найдена (404)',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <FrontendNotFound />
      </main>
      <Footer />
    </div>
  )
}
