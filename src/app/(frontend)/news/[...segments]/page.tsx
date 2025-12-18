import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getPostPath } from '@/utilities/getPostPath'
import { redirect } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    depth: 2,
    select: {
      slug: true,
      category: true,
    },
  })

  return posts.docs
    .filter((post) => Boolean(post?.slug))
    .map((post) => {
      const path = getPostPath(post as any)
      const parts = path.split('/').filter(Boolean) // ['news', ...]
      return { segments: parts.slice(1) } // drop 'news'
    })
}

type Args = {
  params: Promise<{
    segments?: string[]
  }>
}

export default async function NewsPost({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { segments = [] } = await paramsPromise

  const decodedSegments = segments.map((s) => decodeURIComponent(s))
  const decodedSlug = decodedSegments[decodedSegments.length - 1] || ''
  const url = `/news/${decodedSegments.join('/')}`

  const post = await queryPostBySlug({ slug: decodedSlug })
  if (!post) return <PayloadRedirects url={url} />

  const canonicalPath = getPostPath(post as any)
  if (!draft && canonicalPath.startsWith('/news/') && canonicalPath !== url) {
    redirect(canonicalPath)
  }

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { segments = [] } = await paramsPromise
  const decodedSegments = segments.map((s) => decodeURIComponent(s))
  const decodedSlug = decodedSegments[decodedSegments.length - 1] || ''
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
