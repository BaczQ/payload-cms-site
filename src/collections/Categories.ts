import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        // Prevent selecting itself to avoid circular references
        if (id) {
          return {
            id: {
              not_equals: id,
            },
          }
        }
        return true
      },
      maxDepth: 1, // Limit depth to prevent infinite nesting
    },
    {
      name: 'menuOrder',
      type: 'number',
      label: 'Порядок в меню',
      admin: {
        description: 'Число для сортировки категорий в меню. Меньшие числа отображаются первыми.',
        position: 'sidebar',
      },
      defaultValue: 0,
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      label: 'Показывать в меню',
      admin: {
        description: 'Отображать ли эту категорию в верхнем меню',
        position: 'sidebar',
      },
      defaultValue: true,
    },
  ],
}
