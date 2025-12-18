import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, category, categories, title, meta } = originalDoc as any

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  // New model: one category or subcategory on the post.
  // Backwards compat: if old `categories` array exists, use the first one.
  const categoryValue = category ?? (Array.isArray(categories) ? categories[0] : undefined)
  if (categoryValue) {
    const doc =
      typeof categoryValue === 'object'
        ? categoryValue
        : await req.payload.findByID({
            collection: 'categories',
            id: categoryValue,
            disableErrors: true,
            depth: 1,
            select: { title: true, slug: true, parent: true },
            req,
          })

    if (doc) {
      modifiedDoc.categories = [
        {
          relationTo: 'categories',
          categoryID: String((doc as any).id),
          slug: (doc as any).slug,
          parentSlug:
            (doc as any).parent && typeof (doc as any).parent === 'object'
              ? (doc as any).parent.slug
              : null,
          title: (doc as any).title,
        },
      ]
    } else {
      console.error(
        `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
      )
    }
  }

  return modifiedDoc
}
