import type { CollectionBeforeChangeHook } from 'payload'

import type { Post } from '../../../payload-types'

export const setDefaultAuthor: CollectionBeforeChangeHook<Post> = ({ data, operation, req }) => {
  // Only set default author on create operation
  if (operation === 'create') {
    // If authors is empty, undefined, or null, set current user as author
    if (
      !data.authors ||
      (Array.isArray(data.authors) && data.authors.length === 0) ||
      data.authors === null
    ) {
      if (req.user?.id) {
        data.authors = [req.user.id]
      }
    }
  }

  return data
}
