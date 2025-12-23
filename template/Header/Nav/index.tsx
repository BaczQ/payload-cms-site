'use client'

import clsx from 'clsx'
import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

type HeaderNavProps = {
  data: HeaderType
  items: NavItem[]
  variant?: 'desktop' | 'mobile'
  menuItemsCount: number
  onLinkClick?: () => void
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  items,
  variant = 'desktop',
  menuItemsCount,
  onLinkClick,
}) => {
  const fallbackNav: NavItem[] =
    data?.navItems?.map(({ link }) => ({
      label: link.label || '',
      href:
        link.type === 'reference' &&
        typeof link.reference?.value === 'object' &&
        link.reference.value.slug
          ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
          : link.url || '',
      children: undefined,
    })) || []

  const navItems = items.length > 0 ? items : fallbackNav
  const pathname = usePathname()
  const maxPrimary = menuItemsCount

  const primary = variant === 'desktop' ? navItems.slice(0, maxPrimary) : navItems
  const secondary = variant === 'desktop' ? navItems.slice(maxPrimary) : []

  // Check if we're on a category page (new format: /categories/[slug])
  const isCategoryPage = pathname?.startsWith('/categories/')
  const currentCategorySlug = isCategoryPage ? pathname.split('/categories/')[1] : null

  // Extract category slug from href (supports both old and new formats for backward compatibility)
  const getCategorySlug = (href: string) => {
    if (!href) return null
    // New format: /categories/slug
    if (href.startsWith('/categories/')) {
      return decodeURIComponent(href.replace('/categories/', ''))
    }
    // Old format: /posts?category=slug (for backward compatibility)
    const match = href.match(/[?&]category=([^&]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  // Check if any item in secondary matches current category
  const hasActiveSecondary =
    isCategoryPage && currentCategorySlug
      ? secondary.some((item) => {
          const categorySlug = getCategorySlug(item.href)
          return categorySlug === currentCategorySlug
        })
      : false

  return (
    <nav
      className={clsx(
        'nav_font nav_font flex items-center gap-2 text-sm',
        variant === 'mobile' && 'flex-col items-start gap-2',
        variant === 'desktop' && 'justify-center',
      )}
    >
      {primary.map(({ href, label, children }, i) => {
        const categorySlug = getCategorySlug(href)
        const isActive =
          href && (pathname === href || (isCategoryPage && categorySlug === currentCategorySlug))

        const hasChildren = children && children.length > 0

        // For items with children, show dropdown menu
        if (hasChildren && variant === 'desktop') {
          return (
            <div key={i} className="relative group flex-shrink-0 pb-4 group-hover:z-50">
              <CMSLink
                appearance="inline"
                url={href}
                label={`${label} ▾`}
                className={clsx(
                  'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors',
                  isActive
                    ? 'bg-gray-200 text-black'
                    : 'text-black hover:bg-gray-200 hover:text-black',
                )}
              />
              {/* Невидимая область между кнопкой и подменю для поддержания hover */}
              <div className="absolute left-0 top-full w-full h-1 pointer-events-none group-hover:pointer-events-auto" />
              <div className="pointer-events-auto invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg z-50 py-1">
                {children.map((child) => {
                  const childSlug = getCategorySlug(child.href)
                  const isChildActive =
                    (child.href && pathname === child.href) ||
                    (isCategoryPage && childSlug === currentCategorySlug)
                  return (
                    <CMSLink
                      key={child.href}
                      appearance="inline"
                      url={child.href}
                      label={child.label}
                      className={clsx(
                        'block px-3 py-1 text-sm font-medium rounded-md',
                        isChildActive
                          ? 'bg-gray-200 text-black font-semibold'
                          : 'text-black hover:text-black hover:bg-gray-100',
                      )}
                    />
                  )
                })}
              </div>
              {/* Невидимая область под подменю для поддержания hover */}
              <div className="absolute left-0 top-full mt-1 min-w-[200px] h-4 pointer-events-none group-hover:pointer-events-auto" />
            </div>
          )
        }

        // For items without children or mobile variant, show regular link
        const linkContent = (
          <CMSLink
            appearance="inline"
            url={href}
            label={label}
            className={clsx(
              'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors flex-shrink-0',
              isActive ? 'bg-gray-200 text-black' : 'text-black hover:bg-gray-200 hover:text-black',
            )}
          />
        )

        // Wrap in div with onClick for mobile variant to close menu on link click
        if (variant === 'mobile' && onLinkClick) {
          return (
            <div key={i} onClick={onLinkClick}>
              {linkContent}
            </div>
          )
        }

        return <React.Fragment key={i}>{linkContent}</React.Fragment>
      })}

      {variant === 'desktop' && secondary.length > 0 && (
        <div className="relative group flex-shrink-0 pb-4 group-hover:z-50">
          <button
            type="button"
            className={clsx(
              'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors',
              hasActiveSecondary
                ? 'bg-gray-200 text-black'
                : 'text-black hover:bg-gray-200 hover:text-black',
            )}
          >
            More ▾
          </button>
          {/* Невидимая область между кнопкой и подменю для поддержания hover */}
          <div className="absolute left-0 top-full w-full h-1 pointer-events-none group-hover:pointer-events-auto" />
          <div className="pointer-events-auto invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg z-50 py-1">
            {secondary.map(({ href, label, children }) => {
              const categorySlug = getCategorySlug(href)
              const isActive =
                (href && pathname === href) ||
                (isCategoryPage && categorySlug === currentCategorySlug)
              const hasChildren = children && children.length > 0

              // For items with children, show nested dropdown
              if (hasChildren) {
                return (
                  <div key={href} className="relative group/nested group-hover/nested:z-50">
                    <CMSLink
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
                    <div className="pointer-events-auto invisible opacity-0 group-hover/nested:visible group-hover/nested:opacity-100 transition-opacity absolute left-full top-0 ml-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg z-50 py-1">
                      {children.map((child) => {
                        const childSlug = getCategorySlug(child.href)
                        const isChildActive =
                          (child.href && pathname === child.href) ||
                          (isCategoryPage && childSlug === currentCategorySlug)
                        return (
                          <CMSLink
                            key={child.href}
                            appearance="inline"
                            url={child.href}
                            label={child.label}
                            className={clsx(
                              'block px-3 py-1 text-sm font-medium rounded-md',
                              isChildActive
                                ? 'bg-gray-200 text-black font-semibold'
                                : 'text-black hover:text-black hover:bg-gray-100',
                            )}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              }

              // Regular item without children
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
          {/* Невидимая область под подменю для поддержания hover */}
          <div className="absolute left-0 top-full mt-1 min-w-[200px] h-4 pointer-events-none group-hover:pointer-events-auto" />
        </div>
      )}
    </nav>
  )
}
