'use client'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

type FooterClientProps = {
  navItems: Footer['navItems']
}

export const FooterClient: React.FC<FooterClientProps> = ({ navItems }) => {
  const social = ['Facebook', 'X', 'Instagram', 'YouTube', 'LinkedIn']
  const year = new Date().getFullYear()
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <footer className="mt-12 border-t bg-black text-gray-300">
      <div className="container py-8 space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
          {isHome ? (
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" loading="lazy" priority="low" />
            </div>
          ) : (
            <Link className="flex items-center gap-2" href="/">
              <Logo className="h-8 w-auto" loading="lazy" priority="low" />
            </Link>
          )}

          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-wide">
            {(navItems || []).map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  className="text-gray-300 hover:text-white transition-colors"
                  appearance="inline"
                />
              )
            })}
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wide">
            {social.map((item) => (
              <button
                key={item}
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 text-[11px] text-gray-500 flex flex-col sm:flex-row gap-2 justify-center sm:justify-between items-center">
          <span>© {year} BF News</span>
          <span>Built with Payload &amp; Next.js</span>
        </div>
      </div>
    </footer>
  )
}
