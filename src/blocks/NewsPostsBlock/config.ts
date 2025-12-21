import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const NewsPosts: Block = {
  slug: 'newsPosts',
  interfaceName: 'NewsPostsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Новости',
      admin: {
        description: 'Заголовок для секции новостей на главной странице',
      },
    },
    {
      name: 'categorySlug',
      type: 'text',
      label: 'Slug категории новостей',
      defaultValue: 'news',
      admin: {
        description: 'Slug категории "новости". По умолчанию: "news". Блок найдет эту категорию и все её подкатегории.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      label: 'Количество постов',
      admin: {
        step: 1,
        description: 'Сколько постов показывать на главной странице',
      },
    },
    {
      name: 'showMoreLink',
      type: 'checkbox',
      label: 'Показать ссылку "Все новости"',
      defaultValue: true,
      admin: {
        description: 'Показывать ли ссылку на страницу со всеми новостями',
      },
    },
    {
      name: 'moreLinkText',
      type: 'text',
      label: 'Текст ссылки',
      defaultValue: 'Все новости',
      admin: {
        condition: (_, siblingData) => siblingData.showMoreLink === true,
      },
    },
    {
      name: 'moreLinkUrl',
      type: 'text',
      label: 'URL ссылки',
      defaultValue: '/posts',
      admin: {
        condition: (_, siblingData) => siblingData.showMoreLink === true,
        description: 'Куда ведет ссылка "Все новости"',
      },
    },
  ],
  labels: {
    plural: 'Блоки новостей',
    singular: 'Блок новостей',
  },
}

