import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

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

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - только для ≥1024px */}
            <aside className="hidden lg:block lg:w-[300px] lg:flex-shrink-0">
              <div className="sticky top-8">{/* Пустой сайдбар для отступа */}</div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <PostHero post={post} />
              <RichText
                className="max-w-[48rem] mx-auto lg:mx-0"
                data={post.content}
                enableGutter={false}
              />
            </div>
          </div>
        </div>
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="container mt-12">
            <RelatedPosts
              className="max-w-[52rem] mx-auto lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          </div>
        )}
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
    depth: 4, // Increased depth to load category.parent as object (depth 4 ensures parent is fully populated)
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
