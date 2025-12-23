'use client'

import { useEffect, useState } from 'react'
import { buildAdminFontStyles } from '@/lib/fontStyles'

export default function FontStyles() {
  const [styles, setStyles] = useState<string>('')
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true)

    async function loadFontStyles() {
      try {
        // Only load in admin panel
        if (typeof window === 'undefined' || !window.location.pathname.includes('/admin')) {
          return
        }

        const response = await fetch('/api/globals/site-settings?depth=0', {
          credentials: 'include',
        })

        if (!response.ok) {
          // If global doesn't exist yet, that's okay
          return
        }

        const siteSettings = await response.json()

        if (!siteSettings || typeof siteSettings !== 'object') {
          return
        }

        if (!siteSettings?.fonts) {
          return
        }

        const cssRules = buildAdminFontStyles(siteSettings.fonts)

        if (cssRules) {
          setStyles(cssRules)
        }
      } catch (error) {
        // Silently fail - don't break the app
        console.error('Failed to load font styles:', error)
      }
    }

    loadFontStyles()
  }, [])

  // Prevent hydration mismatch: only render style tag after mounting on client
  if (!mounted || !styles) {
    return null
  }

  return <style dangerouslySetInnerHTML={{ __html: styles }} />
}
