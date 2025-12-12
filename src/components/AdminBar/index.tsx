'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { usePathname } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const Title: React.FC = () => <span>Admin Panel</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [postId, setPostId] = useState<string | number | null>(null)
  const router = useRouter()

  // Check if we're on a post page (/posts/[slug])
  const isPostPage = pathname?.startsWith('/posts/') && pathname !== '/posts'
  // Extract only the first segment after /posts/ to avoid capturing nested paths
  // Split by /posts/, take the first part, then split by / and take the first segment (the slug)
  const postSlug = isPostPage
    ? (() => {
        const afterPosts = pathname.split('/posts/')[1]
        if (!afterPosts) return null
        const slugSegment = afterPosts.split('/')[0]
        return slugSegment ? decodeURIComponent(slugSegment) : null
      })()
    : null

  // Fetch post ID by slug when on post page
  useEffect(() => {
    if (isPostPage && postSlug) {
      const fetchPostId = async () => {
        try {
          const cmsURL = getClientSideURL()
          const response = await fetch(
            `${cmsURL}/api/posts?where[slug][equals]=${encodeURIComponent(postSlug)}&limit=1`,
            {
              credentials: 'include',
            },
          )
          if (response.ok) {
            const data = await response.json()
            if (data.docs && data.docs.length > 0) {
              setPostId(data.docs[0].id)
            }
          }
        } catch (error) {
          console.error('Failed to fetch post ID:', error)
        }
      }
      fetchPostId()
    } else {
      setPostId(null)
    }
  }, [pathname, isPostPage, postSlug])

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug="posts"
          id={postId ? String(postId) : undefined}
          collectionLabels={{
            plural: 'Posts',
            singular: 'Post',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
