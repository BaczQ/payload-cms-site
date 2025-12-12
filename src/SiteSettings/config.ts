import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'BF News',
      label: 'Site Name',
      admin: {
        description: 'Site name used in meta tags, page titles and Open Graph',
      },
    },
    {
      name: 'menuItemsCount',
      type: 'number',
      required: true,
      defaultValue: 7,
      label: 'Menu Items Count',
      admin: {
        description:
          'Number of menu items (consisting of site categories) displayed in the menu, with the rest shown in the More dropdown',
      },
      validate: (value: number | null | undefined) => {
        if (value === undefined || value === null) {
          return 'This field is required'
        }
        if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
          return 'Must be a positive integer'
        }
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Homepage SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO Title',
              admin: {
                description: 'SEO title for the homepage (displayed in browser and search engines)',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO Description',
              admin: {
                description: 'SEO description for the homepage (used in meta description tag)',
              },
            },
          ],
        },
      ],
    },
  ],
}
