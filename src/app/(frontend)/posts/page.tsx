import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import PostsList from './PostsList'

export const dynamic = 'force-dynamic'
// Remove revalidate for dynamic rendering - page will update immediately when posts are published

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      category: true,
      heroImage: true,
      meta: true,
    },
  })

  return (
    <>
      <PageClient />
      <PostsList posts={posts as any} />
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `BF-load Website Template Posts`,
  }
}
