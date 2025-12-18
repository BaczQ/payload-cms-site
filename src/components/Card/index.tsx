'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { getPostPath } from '@/utilities/getPostPath'

export type CardPostData = Pick<Post, 'slug' | 'category' | 'meta' | 'title' | 'heroImage'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { category, meta, title, heroImage } = doc || {}
  const { description, image: metaImage } = meta || {}
  const imageToUse = metaImage || heroImage

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = relationTo === 'posts' && doc ? getPostPath(doc) : '/'

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!imageToUse && <div className="">No image</div>}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media resource={imageToUse} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showCategories && category && typeof category === 'object' && (
          <div className="uppercase text-sm mb-4">
            <div>
              {category?.parent && typeof category.parent === 'object' && category.parent.title ? (
                <Fragment>
                  {category.parent.title}
                  <Fragment> / </Fragment>
                </Fragment>
              ) : null}
              {category.title || 'Untitled category'}
            </div>
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
