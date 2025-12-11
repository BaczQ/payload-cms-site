import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'BF News',
      label: 'Название сайта',
      admin: {
        description: 'Название сайта, используется в мета-тегах, заголовках страниц и Open Graph',
      },
    },
    {
      name: 'menuItemsCount',
      type: 'number',
      required: true,
      defaultValue: 7,
      label: 'Количество элементов меню',
      admin: {
        description:
          'Число элементов меню (состоящее из рубрик сайта), которое отображаются в меню, а остальные отображаются в выпадающем списке More',
      },
      validate: (value: unknown) => {
        if (value === undefined || value === null) {
          return 'Поле обязательно для заполнения'
        }
        if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
          return 'Должно быть положительным целым числом'
        }
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO для главной страницы',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO заголовок',
              admin: {
                description:
                  'SEO заголовок для главной страницы (отображается в браузере и поисковых системах)',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO описание',
              admin: {
                description:
                  'SEO описание для главной страницы (используется в мета-теге description)',
              },
            },
          ],
        },
      ],
    },
  ],
}
