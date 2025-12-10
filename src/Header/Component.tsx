import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSiteSettings } from '@/utilities/getSiteSettings'

import type { Header } from '@/payload-types'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const headerData: Header = await getCachedGlobal('header', 1)()
  const siteSettings = await getSiteSettings()

  const categories = await payload.find({
    collection: 'categories',
    limit: 30,
    pagination: false,
    select: {
      title: true,
      slug: true,
    },
  })

  const navItems = categories.docs.map((cat) => ({
    label: cat.title,
    href: `/posts?category=${encodeURIComponent(cat.slug)}`,
  }))

  return <HeaderClient data={headerData} items={navItems} menuItemsCount={siteSettings.menuItemsCount} />
}
