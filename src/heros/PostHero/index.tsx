import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import RichText from '@/components/RichText'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { heroImage, populatedAuthors, publishedAt, subTitle, title, category } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  // Build breadcrumbs from category
  const breadcrumbs = React.useMemo(() => {
    if (!category || typeof category === 'string' || typeof category === 'number') {
      return null
    }

    const items: Array<{ label: string; href: string }> = []

    // Add parent category if exists
    const parent = category.parent
    if (parent && typeof parent === 'object' && parent !== null) {
      // Check if parent is populated (has slug property)
      const parentAny = parent as any
      const parentSlug = parentAny?.slug
      const parentTitle = parentAny?.title

      if (parentSlug && typeof parentSlug === 'string') {
        items.push({
          label: parentTitle || parentSlug,
          href: `/categories/${encodeURIComponent(parentSlug)}`,
        })
      }
    }

    // Add current category
    if (category.slug) {
      items.push({
        label: category.title || category.slug,
        href: `/categories/${encodeURIComponent(category.slug)}`,
      })
    }

    return items.length > 0 ? items : null
  }, [category])

  return (
    <div className="text-black dark:text-white">
      <div className="w-full max-w-[48rem] mx-auto lg:mx-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 text-sm text-black/70 dark:text-white/70">
            <ol className="flex items-center gap-2 flex-wrap">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.href}>
                  <li>
                    <Link
                      href={item.href}
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                  {index < breadcrumbs.length - 1 && (
                    <li className="text-black/50 dark:text-white/50">/</li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl text-black dark:text-white text-left">
          {title}
        </h1>
        {subTitle ? (
          <div className="prose md:prose-md dark:prose-invert max-w-none mb-6 payload-richtext">
            <p className="text-left">
              {subTitle}
            </p>
          </div>
        ) : null}
        {publishedAt && (
          <time dateTime={publishedAt} className="block mb-6 text-left">
            {formatDateTime(publishedAt)}
          </time>
        )}
        {heroImage && typeof heroImage !== 'string' && typeof heroImage === 'object' && (
          <div className="w-full lg:max-w-[48rem] lg:mx-auto mb-6">
            <Media
              priority
              resource={heroImage}
              className="relative w-full"
              pictureClassName="relative w-full block"
              imgClassName="w-full h-auto border border-border rounded-[0.8rem] m-0"
            />
            {heroImage.caption && typeof heroImage.caption === 'object' && (
              <div className="mt-1.5 image-caption">
                <RichText data={heroImage.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
        {hasAuthors && (
          <div className="text-left author flex items-center gap-3 flex-wrap">
            {populatedAuthors.map((author, index) => {
              const authorAvatar =
                author && typeof author === 'object' && 'avatar' in author && author.avatar
                  ? typeof author.avatar === 'object' && author.avatar !== null
                    ? author.avatar
                    : null
                  : null

              const avatarUrl =
                authorAvatar && typeof authorAvatar === 'object' && 'url' in authorAvatar
                  ? typeof authorAvatar.url === 'string'
                    ? authorAvatar.url
                    : 'filename' in authorAvatar && typeof authorAvatar.filename === 'string'
                      ? `/media/${authorAvatar.filename}`
                      : null
                  : null

              return (
                <React.Fragment key={author?.id || index}>
                  <div className="flex items-center gap-2">
                    {avatarUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={avatarUrl}
                          alt={author?.name || 'Author avatar'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <span>{author?.name}</span>
                  </div>
                  {index < populatedAuthors.length - 1 && (
                    <span className="text-black/50 dark:text-white/50">
                      {index === populatedAuthors.length - 2 ? ' and ' : ', '}
                    </span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
