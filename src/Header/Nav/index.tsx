'use client'

import clsx from 'clsx'
import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type MenuItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

type HeaderNavProps = {
  data: HeaderType
  menuItems: MenuItem[]
  variant?: 'desktop' | 'mobile'
  onLinkClick?: () => void
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  menuItems,
  variant = 'desktop',
  onLinkClick,
}) => {
  const adminNavItems: { label: string; href: string }[] =
    data?.navItems
      ?.map(({ link }) => ({
        label: link.label || '',
        href:
          link.type === 'reference' &&
          typeof link.reference?.value === 'object' &&
          link.reference.value.slug
            ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
            : link.url || '',
      }))
      .filter((item) => Boolean(item.label) && Boolean(item.href)) || []

  const navItems: MenuItem[] = [
    ...menuItems,
    ...(adminNavItems.length > 0
      ? [
          {
            label: 'More',
            href: '',
            children: adminNavItems,
          },
        ]
      : []),
  ]
  const pathname = usePathname()

  // Check if we're on a category page
  const isCategoryPage = pathname?.startsWith('/categories/')
  const currentCategorySlug = isCategoryPage ? pathname.split('/categories/')[1] : null

  // Extract category slug from href
  const getCategorySlug = (href: string) => {
    if (!href) return null
    if (href.startsWith('/categories/')) {
      return decodeURIComponent(href.replace('/categories/', ''))
    }
    const match = href.match(/[?&]category=([^&]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  return (
    <nav
      className={clsx(
        'flex gap-2 text-sm',
        variant === 'mobile' && 'flex-col items-start gap-4 w-full',
        variant === 'desktop' && 'items-center justify-center flex-wrap',
      )}
    >
      {navItems.map((item, i) => {
        const categorySlug = getCategorySlug(item.href)
        const isChildActive = item.children?.some((child) => pathname === child.href) ?? false
        const isActive =
          (item.href &&
            (pathname === item.href || (isCategoryPage && categorySlug === currentCategorySlug))) ||
          isChildActive

        const hasChildren = item.children && item.children.length > 0

        // Desktop dropdown menu
        if (variant === 'desktop' && hasChildren) {
          const parentLink = item.href ? (
            <CMSLink
              appearance="inline"
              url={item.href}
              label={`${item.label} ▾`}
              className={clsx(
                'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors',
                isActive
                  ? 'bg-gray-200 text-black'
                  : 'text-black hover:bg-gray-200 hover:text-black',
              )}
            />
          ) : (
            <button
              type="button"
              className={clsx(
                'whitespace-nowrap rounded-full px-3 py-1 font-semibold transition-colors',
                isActive
                  ? 'bg-gray-200 text-black'
                  : 'text-black hover:bg-gray-200 hover:text-black',
              )}
            >
              {item.label} ▾
            </button>
          )

          return (
            <div key={i} className="relative group">
              {parentLink}
              <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full">
                {/* Invisible hover bridge to cover the gap */}
                <div className="absolute left-0 -top-2 h-2 w-full bg-transparent" />
                {/* Menu panel with visible gap */}
                <div className="mt-2 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg z-50 py-1">
                  {item.children?.map((child) => {
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
            </div>
          )
        }

        // Regular menu item (desktop without children or mobile)
        const linkContent = item.href ? (
          <CMSLink
            appearance="inline"
            url={item.href}
            label={item.label}
            className={clsx(
              variant === 'desktop' && 'whitespace-nowrap',
              'rounded-full px-3 py-1 font-semibold transition-colors',
              variant === 'mobile' && 'w-full text-left',
              isActive ? 'bg-gray-200 text-black' : 'text-black hover:bg-gray-200 hover:text-black',
            )}
          />
        ) : (
          <span
            className={clsx(
              variant === 'desktop' && 'whitespace-nowrap',
              'rounded-full px-3 py-1 font-semibold transition-colors inline-flex items-center',
              variant === 'mobile' && 'w-full text-left',
              isActive ? 'bg-gray-200 text-black' : 'text-black hover:bg-gray-200 hover:text-black',
            )}
          >
            {item.label}
          </span>
        )

        // Mobile with children - show as expandable
        if (variant === 'mobile' && hasChildren) {
          return (
            <div key={i} className="w-full mb-2">
              <div className="w-full text-left">{linkContent}</div>
              {item.children && item.children.length > 0 && (
                <div className="ml-4 mt-1 flex flex-col gap-1 w-full">
                  {item.children.map((child) => {
                    const childSlug = getCategorySlug(child.href)
                    const isChildActive =
                      (child.href && pathname === child.href) ||
                      (isCategoryPage && childSlug === currentCategorySlug)
                    return (
                      <div key={child.href} onClick={onLinkClick} className="w-full text-left">
                        <CMSLink
                          appearance="inline"
                          url={child.href}
                          label={child.label}
                          className={clsx(
                            'block px-3 py-1 font-semibold rounded-md w-full text-left transition-colors',
                            isChildActive
                              ? 'bg-gray-200 text-black'
                              : 'text-black hover:bg-gray-200 hover:text-black',
                          )}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }

        // Wrap in div with onClick for mobile variant to close menu on link click
        if (variant === 'mobile' && onLinkClick) {
          return (
            <div key={i} onClick={onLinkClick} className="w-full text-left mb-2">
              {linkContent}
            </div>
          )
        }

        return <React.Fragment key={i}>{linkContent}</React.Fragment>
      })}
    </nav>
  )
}
