import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Links',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 6,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
        {
          label: 'Social links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 10,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
        {
          label: 'Footer text',
          fields: [
            {
              name: 'copyrightText',
              type: 'textarea',
              defaultValue: '© 2025 BF News',
              admin: {
                description: 'Left-side footer text (supports any plain text).',
                rows: 2,
              },
            },
            {
              name: 'builtWithText',
              type: 'textarea',
              defaultValue: 'Built with BF-load & Next.js',
              admin: {
                description: 'Right-side footer text (supports any plain text).',
                rows: 2,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
