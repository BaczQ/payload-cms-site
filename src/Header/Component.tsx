import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Header, Category } from '@/payload-types'

export async function Header() {
  const payload = await getPayload({ config: configPromise })
  const headerData: Header = await getCachedGlobal('header', 1)()

  // Получаем все категории с parent, сортируем по menuOrder
  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
    depth: 2,
    sort: 'menuOrder',
    select: {
      title: true,
      slug: true,
      parent: true,
      menuOrder: true,
      showInMenu: true,
    },
  })

  // Фильтруем категории: показываем те, у которых showInMenu !== false
  // (по умолчанию показываем, если поле не задано)
  const categories = categoriesResult.docs.filter((cat) => cat.showInMenu !== false) as Category[]

  // Разделяем на родительские и дочерние
  // Родительская категория - та, у которой parent === null или undefined
  const parentCategories = categories
    .filter((cat) => !cat.parent || cat.parent === null)
    .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0)) as Category[]

  // Создаем структуру меню: родительские категории с дочерними
  const menuItems = parentCategories.map((parent) => {
    const children = categories
      .filter((cat) => {
        if (!cat.parent) return false
        if (typeof cat.parent === 'object' && cat.parent !== null) {
          return cat.parent.id === parent.id
        }
        return cat.parent === parent.id
      })
      .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0)) as Category[]

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
