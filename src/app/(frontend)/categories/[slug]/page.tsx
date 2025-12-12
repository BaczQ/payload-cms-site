import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CategoryHero } from '@/components/CategoryHero'
import { CategoryPostList } from '@/components/CategoryPostList'
import { CategoryPagination } from '@/components/CategoryPagination'
import { getSiteName } from '@/utilities/getSiteName'
import PageClient from '@/app/(frontend)/posts/page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
  }>
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise, searchParams }: Args) {
  const { slug } = await paramsPromise
  const { page } = (await searchParams) || {}
  const payload = await getPayload({ config: configPromise })

  // Decode slug to support special characters
  const decodedSlug = decodeURIComponent(slug)

  // Get category
  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const category = categoryResult.docs?.[0]
  if (!category) {
    notFound()
  }

  // Get posts for this category
  const currentPage = page ? parseInt(page, 10) : 1
  const limit = 12

  const postsResult = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    page: currentPage,
    overrideAccess: false,
    where: {
      categories: {
        equals: category.id,
      },
    },
    sort: '-publishedAt',
  })

  const posts = postsResult.docs || []

  // On first page, show hero post, otherwise show all posts in list
  const heroPost = currentPage === 1 && posts.length > 0 ? posts[0] : null
  const morePosts = currentPage === 1 && posts.length > 1 ? posts.slice(1) : posts

  return (
    <div className="min-h-screen bg-background">
      <PageClient />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Category Header */}
        <div className="mb-12 lg:mb-16">
          <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Category
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-2 leading-tight">
            {category.title}
          </h1>
        </div>

        {/* Hero Post */}
        {heroPost && <CategoryHero post={heroPost} />}

        {/* More Stories Section */}
        {morePosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">More Articles</h2>
            <CategoryPostList posts={morePosts} />
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No articles in this category yet.</p>
          </div>
        )}

        {/* Pagination */}
        {postsResult.totalPages > 1 && postsResult.page && (
          <CategoryPagination
            page={postsResult.page}
            totalPages={postsResult.totalPages}
            categorySlug={decodedSlug}
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const decodedSlug = decodeURIComponent(slug)

  const categoryResult = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const category = categoryResult.docs?.[0]
  const siteName = await getSiteName()

  if (!category) {
    return {
      title: `${siteName} - Category Not Found`,
    }
  }

  return {
    title: `${category.title} | ${siteName}`,
    description: `Articles in category ${category.title}`,
  }
}
