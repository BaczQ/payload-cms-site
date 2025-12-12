import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CategoryHeroGrid } from '@/components/CategoryHeroGrid'
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

  // On first page, show hero grid (hero + 3-4 grid posts), otherwise show all posts in list
  const heroPost = currentPage === 1 && posts.length > 0 ? posts[0] : null
  const gridPosts = currentPage === 1 && posts.length > 1 ? posts.slice(1, 5) : [] // First 4 posts for grid (up to 4)
  const listPosts =
    currentPage === 1 && posts.length > 5
      ? posts.slice(5)
      : currentPage === 1 && posts.length > 1
        ? posts.slice(1)
        : posts

  return (
    <div className="min-h-screen bg-background">
      <PageClient />
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Category Header */}
        <div className="mb-12 lg:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2 leading-tight">
            {category.title}
          </h1>
        </div>

        {/* Hero Grid Section - First Layout (Hero + Grid) */}
        {heroPost && gridPosts.length > 0 && (
          <CategoryHeroGrid heroPost={heroPost} gridPosts={gridPosts} />
        )}

        {/* If only hero post exists, show it in list format */}
        {heroPost && gridPosts.length === 0 && listPosts.length === 0 && (
          <CategoryPostList posts={[heroPost]} />
        )}

        {/* List Posts Section - Second Layout (List with images on right) */}
        {listPosts.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <CategoryPostList posts={listPosts} />
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
