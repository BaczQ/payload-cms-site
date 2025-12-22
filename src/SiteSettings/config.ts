import type { GlobalConfig } from 'payload'

const fontOptions = [
  {
    label: 'Roboto',
    value: 'roboto',
  },
  {
    label: 'Gloock',
    value: 'gloock',
  },
  {
    label: 'Antonio',
    value: 'antonio',
  },
  {
    label: 'Manufacturing Consent',
    value: 'manufacturing-consent',
  },
  {
    label: 'Noto Sans Display',
    value: 'noto-sans-display',
  },
  {
    label: 'Roboto Flex',
    value: 'roboto-flex',
  },
  {
    label: 'Roboto Condensed',
    value: 'roboto-condensed',
  },
  {
    label: 'Tinos',
    value: 'tinos',
  },
  {
    label: 'System UI',
    value: 'system-ui',
  },
  {
    label: 'Sans Serif',
    value: 'sans-serif',
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Шрифты',
          fields: [
            {
              name: 'fonts',
              type: 'group',
              label: 'Выбор шрифтов',
              fields: [
                {
                  name: 'h1',
                  type: 'select',
                  label: 'Заголовок поста H1',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для заголовков H1 в редакторе',
                  },
                },
                {
                  name: 'postText',
                  type: 'select',
                  label: 'Текст поста',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для текста поста (p, li)',
                  },
                },
                {
                  name: 'menu',
                  type: 'select',
                  label: 'Текст в меню',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для навигационного меню',
                  },
                },
                {
                  name: 'caption',
                  type: 'select',
                  label: 'Подпись изображения',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для подписей к изображениям (figcaption)',
                  },
                },
                {
                  name: 'h2h5',
                  type: 'select',
                  label: 'Подзаголовки H2–H5',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для подзаголовков H2, H3, H4, H5',
                  },
                },
                {
                  name: 'author',
                  type: 'select',
                  label: 'Автор',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для имени автора',
                  },
                },
                {
                  name: 'date',
                  type: 'select',
                  label: 'Дата',
                  defaultValue: 'roboto',
                  options: fontOptions,
                  admin: {
                    description: 'Шрифт для даты публикации',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

