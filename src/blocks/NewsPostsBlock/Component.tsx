import type { Post, NewsPostsBlock as NewsPostsBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import { CollectionArchive } from '@/components/CollectionArchive'

export const NewsPostsBlock: React.FC<
  NewsPostsBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, title, categorySlug = 'news', limit = 12, showMoreLink, moreLinkText, moreLinkUrl } = props

  const payload = await getPayload({ config: configPromise })

  // Найти категорию "новости" по slug
  const categoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: categorySlug,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  })

  const category = categoryRes.docs?.[0]

  if (!category) {
    // Если категория не найдена, возвращаем пустой блок с предупреждением
    return (
      <div className="my-16" id={`block-${id}`}>
        <div className="container">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-red-500">
              Категория с slug &quot;{categorySlug}&quot; не найдена. Проверьте настройки блока.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Найти все дочерние категории
  const childCategoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      parent: {
        equals: category.id,
      },
    },
  })

  // Собрать все ID категорий (родительская + дочерние)
  const categoryIds = [category.id, ...childCategoryRes.docs.map((childCategory) => childCategory.id)]

  // Получить посты категории "новости" и всех её подкатегорий
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: limit ?? 12,
    overrideAccess: false,
    where: {
      category: {
        in: categoryIds,
      },
    },
    select: {
      title: true,
      slug: true,
      category: true,
      heroImage: true,
      meta: true,
    },
    sort: '-publishedAt',
  })

  return (
    <div className="my-16" id={`block-${id}`}>
      <div className="container mb-8">
        <div className="flex items-center justify-between">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{title || 'Новости'}</h2>
          </div>
          {showMoreLink && moreLinkText && moreLinkUrl && (
            <Link
              href={moreLinkUrl}
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              {moreLinkText}
            </Link>
          )}
        </div>
      </div>

      <CollectionArchive posts={posts.docs} />
    </div>
  )
}

