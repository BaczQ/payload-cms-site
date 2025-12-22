import type { Metadata } from 'next/types'

import { notFound } from 'next/navigation'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params
  const sp = (await searchParams) || {}

  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const page = pageParam ? Math.max(1, Number(pageParam) || 1) : 1

  const categoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    select: {
      title: true,
      slug: true,
    },
  })

  const category = categoryRes.docs?.[0]
  if (!category) notFound()

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

  const categoryIds = [
    category.id,
    ...childCategoryRes.docs.map((childCategory) => childCategory.id),
  ]

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page,
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
  })

  return (
    <div className="pt-12 pb-3">
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{category.title}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  const categoryRes = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    select: {
      title: true,
    },
  })

  const category = categoryRes.docs?.[0]
  if (!category) {
    return { title: 'Category' }
  }

  return {
    title: category.title,
  }
}
