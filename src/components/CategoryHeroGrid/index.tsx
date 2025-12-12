import React from 'react'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatCategoryDate } from '@/utilities/formatCategoryDate'

type Props = {
  heroPost: Post
  gridPosts: Post[]
}

export const CategoryHeroGrid: React.FC<Props> = ({ heroPost, gridPosts }) => {
  const { title, slug, meta, publishedAt, heroImage } = heroPost
  const { description } = meta || {}
  const image = heroImage || meta?.image
  const date = formatCategoryDate(publishedAt || null)

  return (
    <div className="mb-16 lg:mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Hero Post - Left Column */}
        <div className="lg:col-span-7">
          <article>
            <Link href={`/posts/${slug}`} className="block group">
              {image && typeof image === 'object' && (
                <div className="relative w-full aspect-[4/3] lg:aspect-[3/2] overflow-hidden mb-4">
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
              )}
              <div className="space-y-3">
                {date && <div className="text-sm text-muted-foreground font-medium">{date}</div>}
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {title}
                </h2>
                {description && (
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
              </div>
            </Link>
          </article>
        </div>

        {/* Grid Posts - Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {gridPosts.map((post) => {
            if (typeof post !== 'object' || post === null) return null

            const {
              id,
              title: postTitle,
              slug: postSlug,
              meta: postMeta,
              publishedAt: postPublishedAt,
              heroImage: postHeroImage,
            } = post
            const postImage = postHeroImage || postMeta?.image
            const postDate = formatCategoryDate(postPublishedAt || null)
            const categoryTag =
              post.categories && Array.isArray(post.categories) && post.categories.length > 0
                ? typeof post.categories[0] === 'object' && post.categories[0] !== null
                  ? post.categories[0].title
                  : null
                : null

            return (
              <article key={id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                <Link href={`/posts/${postSlug}`} className="block group">
                  <div className="flex gap-4">
                    {postImage && typeof postImage === 'object' && (
                      <div className="flex-shrink-0 relative w-24 h-24 lg:w-28 lg:h-28 overflow-hidden rounded">
                        <Media
                          resource={postImage}
                          fill
                          imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-2">
                      {categoryTag && (
                        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                          {categoryTag}
                        </div>
                      )}
                      <h3 className="text-base lg:text-lg font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {postTitle}
                      </h3>
                      {postDate && <div className="text-xs text-muted-foreground">{postDate}</div>}
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
