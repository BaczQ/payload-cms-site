import Link from 'next/link'
import type { Metadata } from 'next'
import React from 'react'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Страница не найдена (404)',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="prose max-w-none">
          <h1 className="mb-2">404</h1>
          <p className="mb-6 text-muted-foreground">
            Похоже, такой страницы не существует. Возможно, ссылка устарела или в адресе есть
            опечатка.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="default">
            <Link href="/">На главную</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/search">Поиск</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/posts">Все публикации</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
