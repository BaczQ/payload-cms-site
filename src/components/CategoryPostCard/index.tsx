import React from 'react'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatCategoryDate } from '@/utilities/formatCategoryDate'
import { formatAuthors } from '@/utilities/formatAuthors'

type Props = {
  post: Post
}

export const CategoryPostCard: React.FC<Props> = ({ post }) => {
  const { title, slug, meta, publishedAt, populatedAuthors, categories } = post
  const { description, image: metaImage } = meta || {}
  const date = formatCategoryDate(publishedAt || null)
  const authors =
    populatedAuthors && populatedAuthors.length > 0
      ? formatAuthors(populatedAuthors.filter((a): a is NonNullable<typeof a> => a !== null))
      : null

  // Get category tag if available
  const categoryTag =
    categories && Array.isArray(categories) && categories.length > 0
      ? typeof categories[0] === 'object' && categories[0] !== null
        ? categories[0].title
        : null
      : null

  return (
    <article className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Text Content */}
      <div className="md:col-span-8 space-y-3">
        {date && <div className="text-sm text-muted-foreground font-medium">{date}</div>}
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          <Link href={`/posts/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        {description && (
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Thumbnail Image */}
      {metaImage && typeof metaImage === 'object' && (
        <div className="md:col-span-4">
          <Link href={`/posts/${slug}`} className="block group">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded bg-muted">
              <Media
                resource={metaImage}
                fill
                imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </div>
      )}
    </article>
  )
}
