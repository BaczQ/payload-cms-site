'use client'

import clsx from 'clsx'
import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type HeaderNavProps = {
  data: HeaderType
  items: { label: string; href: string }[]
  variant?: 'desktop' | 'mobile'
  menuItemsCount: number
  onLinkClick?: () => void
  searchParams?: ReturnType<typeof useSearchParams>
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  items,
  variant = 'desktop',
  menuItemsCount,
  onLinkClick,
  searchParams: searchParamsProp,
}) => {
  const fallbackNav =
    data?.navItems?.map(({ link }) => ({
      label: link.label || '',
      href:
        link.type === 'reference' &&
        typeof link.reference?.value === 'object' &&
        link.reference.value.slug
          ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
          : link.url || '',
    })) || []

  const navItems = items.length > 0 ? items : fallbackNav
  const pathname = usePathname()
  const searchParamsFromHook = useSearchParams()
  const searchParams = searchParamsProp || searchParamsFromHook
  const maxPrimary = menuItemsCount

  const primary = variant === 'desktop' ? navItems.slice(0, maxPrimary) : navItems
  const secondary = variant === 'desktop' ? navItems.slice(maxPrimary) : []

  // Функция для проверки активности категории
  const isCategoryActive = (href: string) => {
    if (!href) return false

    // Проверяем точное совпадение pathname
    if (pathname === href) return true

    // Проверяем, если это ссылка на категорию вида /posts?category=slug
    if (href.startsWith('/posts?category=')) {
      const categoryParam = searchParams.get('category')
      // Парсим category из href
      const hrefMatch = href.match(/[?&]category=([^&]+)/)
      const hrefCategory = hrefMatch ? decodeURIComponent(hrefMatch[1]) : null

      // Проверяем, что мы на странице /posts и категории совпадают
      if (
        pathname === '/posts' &&
        categoryParam &&
        hrefCategory &&
        categoryParam === hrefCategory
      ) {
        return true
      }
    }

    return false
  }

  return (
    <nav
      className={clsx(
        'flex items-center gap-2 text-sm',
        variant === 'mobile' && 'flex-col items-start gap-2',
        variant === 'desktop' && 'justify-center flex-wrap',
      )}
    >
      {primary.map(({ href, label }, i) => {
        const isActive = isCategoryActive(href || '')

        const linkContent = (
          <CMSLink
            key={i}
            appearance="inline"
            url={href}
            label={label}
            className={clsx(
              'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors',
              isActive ? 'bg-gray-200 text-black' : 'text-black hover:bg-gray-200 hover:text-black',
            )}
          />
        )

        // В мобильном меню оборачиваем ссылку для обработки клика
        if (variant === 'mobile' && onLinkClick) {
          return (
            <div key={i} onClick={onLinkClick}>
              {linkContent}
            </div>
          )
        }

        return linkContent
      })}

      {variant === 'desktop' && secondary.length > 0 && (
        <div className="relative group">
          <button
            type="button"
            className="whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors text-black hover:bg-gray-200 hover:text-black"
          >
            More ▾
          </button>
          <div className="pointer-events-auto invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg z-50 py-1">
            {secondary.map(({ href, label }) => {
              const isActive = isCategoryActive(href || '')
              return (
                <CMSLink
                  key={href}
                  appearance="inline"
                  url={href}
                  label={label}
                  className={clsx(
                    'block px-3 py-1 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-gray-200 text-black font-semibold'
                      : 'text-black hover:text-black hover:bg-gray-100',
                  )}
                />
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
