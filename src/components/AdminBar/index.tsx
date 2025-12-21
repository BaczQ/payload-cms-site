'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const [user, setUser] = useState<PayloadMeUser | null>(null)
  const [editPostHref, setEditPostHref] = useState<string | null>(null)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()
  const pathname = usePathname()
  const cmsURL = getClientSideURL()

  const onAuthChange = React.useCallback((userData: PayloadMeUser) => {
    setShow(Boolean(userData?.id))
    setUser(userData || null)
  }, [])

  const linkClassName = 'font-medium text-white text-sm hover:opacity-80 transition-opacity'
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }

  React.useEffect(() => {
    const getSlugFromPathname = () => {
      if (!pathname) return null
      const segments = pathname.split('/').filter(Boolean)
      if (segments.length < 2) return null
      const [base] = segments
      if (base !== 'posts' && base !== 'news') return null
      return segments[segments.length - 1]
    }

    const slug = getSlugFromPathname()
    if (!slug || !cmsURL) {
      setEditPostHref(null)
      return
    }

    const controller = new AbortController()
    const loadPostId = async () => {
      const response = await fetch(
        `${cmsURL}/api/posts?depth=0&draft=true&limit=1&where[slug][equals]=${encodeURIComponent(
          slug,
        )}`,
        {
          credentials: 'include',
          signal: controller.signal,
        },
      )

      if (!response.ok) {
        setEditPostHref(null)
        return
      }

      const data = (await response.json()) as { docs?: Array<{ id?: string }> }
      const postId = data.docs?.[0]?.id
      setEditPostHref(postId ? `${cmsURL}/admin/collections/posts/${postId}` : null)
    }

    loadPostId().catch(() => {
      setEditPostHref(null)
    })

    return () => controller.abort()
  }, [cmsURL, pathname])

  return (
    <>
      {/* Hidden PayloadAdminBar for auth detection */}
      <div style={{ display: 'none' }}>
        <PayloadAdminBar
          {...adminBarProps}
          cmsURL={cmsURL}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
        />
      </div>

      {/* Custom Admin Bar */}
      <div
        className={cn(baseClass, 'py-2 bg-black text-white relative z-[9999]', {
          block: show,
          hidden: !show,
        })}
      >
        <div className="container flex items-center justify-between gap-4">
          {/* User email on the left */}
          {user?.email && (
            <div className="font-medium text-white text-sm truncate">{user.email}</div>
          )}

          {/* Links on the right */}
          <div className="flex items-center gap-4">
            {editPostHref && (
              <Link href={editPostHref} className={linkClassName} style={linkStyle}>
                Edit Post
              </Link>
            )}
            <Link
              href={`${cmsURL}/admin/collections/pages/create`}
              className={linkClassName}
              style={linkStyle}
            >
              New Page
            </Link>
            <Link
              href={`${cmsURL}/admin/collections/posts/create`}
              className={linkClassName}
              style={linkStyle}
            >
              New Post
            </Link>
            <Link href={`${cmsURL}/admin/logout`} className={linkClassName} style={linkStyle}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
