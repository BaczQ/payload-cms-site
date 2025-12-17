import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Header, Category } from '@/payload-types'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const headerData: Header = await getCachedGlobal('header', 1)()

  // Получаем все категории с parent
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
    depth: 2,
    select: {
      title: true,
      slug: true,
      parent: true,
    },
  })

  // Разделяем на родительские и дочерние
  // Родительская категория - та, у которой parent === null или undefined
  const parentCategories = categories.docs.filter(
    (cat) => !cat.parent || cat.parent === null,
  ) as Category[]

  // Создаем структуру меню: родительские категории с дочерними
  const menuItems = parentCategories.map((parent) => {
    const children = categories.docs.filter((cat) => {
      if (!cat.parent) return false
      if (typeof cat.parent === 'object' && cat.parent !== null) {
        return cat.parent.id === parent.id
      }
      return cat.parent === parent.id
    }) as Category[]

    return {
      label: parent.title,
      href: `/categories/${encodeURIComponent(parent.slug)}`,
      children: children.map((child) => ({
        label: child.title,
        href: `/categories/${encodeURIComponent(child.slug)}`,
      })),
    }
  })

  return <HeaderClient data={headerData} menuItems={menuItems} />
}
