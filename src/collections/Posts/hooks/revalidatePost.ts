import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { getPostPath } from '../../../utilities/getPostPath'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      let path = `/posts/${doc.slug}`
      if (doc.category) {
        if (typeof doc.category === 'string') {
          const category = await payload.findByID({
            collection: 'categories',
            id: doc.category,
            depth: 1,
          })
          path = getPostPath({ slug: doc.slug, category } as any)
        } else {
          path = getPostPath(doc as any)
        }
      }

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      // Also revalidate the posts list page so new posts appear immediately
      revalidatePath('/posts', 'page')
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      let oldPath = `/posts/${previousDoc.slug}`
      const prevCategory = (previousDoc as any).category
      if (prevCategory) {
        if (typeof prevCategory === 'string') {
          const category = await payload.findByID({
            collection: 'categories',
            id: prevCategory,
            depth: 1,
          })
          oldPath = getPostPath({ slug: previousDoc.slug, category } as any)
        } else {
          oldPath = getPostPath(previousDoc as any)
        }
      }

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      // Also revalidate the posts list page when a post is unpublished
      revalidatePath('/posts', 'page')
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc ? getPostPath(doc as any) : '/posts'

    revalidatePath(path)
    // Also revalidate the posts list page when a post is deleted
    revalidatePath('/posts', 'page')
    revalidateTag('posts-sitemap')
  }

  return doc
}
