'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { Suspense, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { SearchIcon, X } from 'lucide-react'

interface HeaderClientProps {
  data: Header
  items: { label: string; href: string }[]
  menuItemsCount: number
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, items, menuItemsCount }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const isHome = pathname === '/'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    } else {
      router.push('/search')
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="relative z-30 border-b border-gray-200 bg-white text-black">
      <div className="container relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <>
                <span className="block w-5 border-t border-black" />
                <span className="block w-5 border-t border-black mt-1" />
                <span className="block w-5 border-t border-black mt-1" />
              </>
            )}
          </button>

          {isHome ? (
            <div className="shrink-0 absolute left-1/2 -translate-x-1/2 sm:static sm:left-auto sm:translate-x-0">
              <Logo loading="eager" priority="high" className="h-[40px] w-auto" />
            </div>
          ) : (
            <Link
              href="/"
              className="shrink-0 absolute left-1/2 -translate-x-1/2 sm:static sm:left-auto sm:translate-x-0"
            >
              <Logo loading="eager" priority="high" className="h-[40px] w-auto" />
            </Link>
          )}
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <Suspense fallback={<div className="flex items-center gap-2 text-sm" />}>
            <HeaderNav
              data={data}
              items={items}
              variant="desktop"
              menuItemsCount={menuItemsCount}
            />
          </Suspense>
        </div>

        <div className="hidden min-[450px]:flex items-center gap-2 text-black">
          <Link
            href="/search"
            className="flex items-center justify-center rounded-full border border-gray-300 p-2 hover:bg-gray-200 transition-colors"
          >
            <span className="sr-only">Search</span>
            <SearchIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-200 transition-colors"
            aria-label="Войти"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Мобильное полноэкранное меню */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-20 border-t border-gray-200 overflow-y-auto">
          <div className="container py-4 flex flex-col gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5 text-gray-500" />
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Search BF News..."
                  aria-label="Поиск"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Suspense fallback={<div className="flex flex-col items-start gap-2" />}>
              <HeaderNav
                data={data}
                items={items}
                variant="mobile"
                menuItemsCount={menuItemsCount}
                onLinkClick={() => setIsMenuOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  )
}
