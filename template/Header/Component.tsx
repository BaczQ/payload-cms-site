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
    depth: 1, // Load parent relationships
    select: {
      id: true,
      title: true,
      slug: true,
      parent: true,
    },
  })

  // Separate parent and child categories
  const parentCategories = categories.docs.filter(
    (cat) =>
      !cat.parent || cat.parent === null || (typeof cat.parent === 'object' && cat.parent === null),
  )
  const childCategories = categories.docs.filter(
    (cat) =>
      cat.parent && typeof cat.parent === 'object' && cat.parent !== null && 'slug' in cat.parent,
  )

  // Get parent IDs for filtering
  const parentIds = new Set(parentCategories.map((cat) => cat.id))

  // Group children by parent slug
  const childrenByParent = new Map<string, typeof childCategories>()
  childCategories.forEach((child) => {
    if (child.parent && typeof child.parent === 'object' && child.parent !== null) {
      const parent = child.parent as any
      const parentSlug = parent?.slug

      if (parentSlug && typeof parentSlug === 'string' && child.slug && child.id !== parent?.id) {
        if (!childrenByParent.has(parentSlug)) {
          childrenByParent.set(parentSlug, [])
        }
        childrenByParent.get(parentSlug)!.push(child)
      }
    }
  })

  // Create nav items
  const navItems = parentCategories.map((cat) => {
    const children = childrenByParent.get(cat.slug) || []

    // Filter: exclude parent category itself and any parent categories
    const filteredChildren = children
      .filter((child) => {
        // Critical check: child must not be the parent itself
        if (child.id === cat.id) return false
        // Child must not be a parent category
        if (parentIds.has(child.id)) return false
        // Additional check: same slug means same category
        if (child.slug === cat.slug) return false
        return true
      })
      .map((child) => ({
        label: child.title,
        href: `/categories/${encodeURIComponent(child.slug)}`,
      }))

    return {
      label: cat.title,
      href: `/categories/${encodeURIComponent(cat.slug)}`,
      children: filteredChildren.length > 0 ? filteredChildren : undefined,
    }
  })

  return (
    <HeaderClient data={headerData} items={navItems} menuItemsCount={siteSettings.menuItemsCount} />
  )
}
