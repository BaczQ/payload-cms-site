import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { getSiteName } from '@/utilities/getSiteName'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type PageProps = {
  searchParams?: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const payload = await getPayload({ config: configPromise })

  const { category } = (await searchParams) || {}

  let categoryFilterId: string | number | null = null
  let categoryTitle: string | null = null

  if (category) {
    const catDoc = await payload.find({
      collection: 'categories',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: category,
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    const found = catDoc.docs?.[0]
    if (found) {
      categoryFilterId = found.id
      categoryTitle = found.title
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    where: categoryFilterId
      ? {
          categories: {
            equals: categoryFilterId,
          },
        }
      : undefined,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
          {categoryTitle && (
            <p className="text-lg text-muted-foreground">Category: {categoryTitle}</p>
          )}
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

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  return {
    title: `${siteName} Posts`,
  }
}
