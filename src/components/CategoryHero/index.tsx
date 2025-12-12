import React from 'react'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatCategoryDate } from '@/utilities/formatCategoryDate'
import { formatAuthors } from '@/utilities/formatAuthors'

type Props = {
  post: Post
}

export const CategoryHero: React.FC<Props> = ({ post }) => {
  const { title, slug, meta, publishedAt, populatedAuthors, heroImage } = post
  const { description } = meta || {}
  const image = heroImage || meta?.image
  const date = formatCategoryDate(publishedAt || null)
  const authors =
    populatedAuthors && populatedAuthors.length > 0
      ? formatAuthors(populatedAuthors.filter((a): a is NonNullable<typeof a> => a !== null))
      : null

  return (
    <article className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="space-y-4">
            {date && <div className="text-sm text-muted-foreground">{date}</div>}
            {authors && <div className="text-sm text-muted-foreground">{authors}</div>}
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              <Link href={`/posts/${slug}`} className="hover:text-primary transition-colors">
                {title}
              </Link>
            </h2>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Image */}
        {image && typeof image === 'object' && (
          <div className="lg:col-span-5">
            <Link href={`/posts/${slug}`} className="block group">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Media
                  resource={image}
                  size="50vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
