import React from 'react'
import type { Post } from '@/payload-types'
import { CategoryPostCard } from '@/components/CategoryPostCard'

type Props = {
  posts: Post[]
}

export const CategoryPostList: React.FC<Props> = ({ posts }) => {
  return (
    <div className="space-y-8">
      {posts.map((post) => {
        if (typeof post === 'object' && post !== null) {
          return <CategoryPostCard key={post.id} post={post} />
        }
        return null
      })}
    </div>
  )
}
