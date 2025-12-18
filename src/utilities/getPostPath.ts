import type { Category, Post } from '@/payload-types'

type MaybeCategory =
  | string
  | number
  | null
  | undefined
  | (Pick<Category, 'slug' | 'parent'> & {
      parent?: string | number | null | (Pick<Category, 'slug'> & { slug: string }) | undefined
    })

type MaybeLegacyCategories = Array<
  string | number | null | undefined | { id?: string | number | null } | Category
>

export function getPostPath(
  post: Pick<Post, 'slug'> & { category?: MaybeCategory; categories?: MaybeLegacyCategories },
): string {
  const slug = post?.slug
  if (!slug) return '/posts'

  const category =
    post.category ?? (Array.isArray(post.categories) ? (post.categories[0] as any) : undefined)
  if (!category || typeof category === 'string' || typeof category === 'number')
    return `/posts/${slug}`

  const catSlug = category.slug
  if (!catSlug) return `/posts/${slug}`

  const parent = category.parent
  if (parent && typeof parent !== 'string' && typeof parent !== 'number' && parent.slug) {
    return `/news/${parent.slug}/${catSlug}/${slug}`
  }

  return `/news/${catSlug}/${slug}`
}
