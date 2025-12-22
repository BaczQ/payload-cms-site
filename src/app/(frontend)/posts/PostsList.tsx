import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import type { Post } from '@/payload-types'

type PostsListProps = {
  posts: {
    docs: Post[]
    page?: number
    totalPages?: number
    totalDocs?: number
  }
}

export default function PostsList({ posts }: PostsListProps) {
  return (
    <div className="pt-12 pb-3">
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page || 1}
          limit={12}
          totalDocs={posts.totalDocs || 0}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages && posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

