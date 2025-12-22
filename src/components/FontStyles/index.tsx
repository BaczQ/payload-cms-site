'use client'

import { useEffect, useState } from 'react'

// Mapping font values to CSS font-family names
const fontFamilyMap: Record<string, string> = {
  roboto: '"Roboto", sans-serif',
  gloock: '"Gloock", serif',
  antonio: '"Antonio", sans-serif',
  'manufacturing-consent': '"Manufacturing Consent", system-ui',
  'noto-sans-display': '"Noto Sans Display", sans-serif',
  'roboto-flex': '"Roboto Flex", sans-serif',
  'roboto-condensed': '"Roboto Condensed", sans-serif',
  tinos: '"Tinos", serif',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

// Fallback fonts (current fonts)
const fallbackFonts: Record<string, string> = {
  roboto: 'var(--font-sans)',
  gloock: 'var(--font-serif)',
  antonio: 'var(--font-sans)',
  'manufacturing-consent': 'system-ui',
  'noto-sans-display': 'var(--font-sans)',
  'roboto-flex': 'var(--font-sans)',
  'roboto-condensed': 'var(--font-sans)',
  tinos: 'var(--font-serif)',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

// Helper function to normalize font value (handles case variations)
function normalizeFontValue(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null
  // Convert to lowercase and handle variations
  const normalized = value.toLowerCase().trim()
  return normalized
}

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

        const fonts = siteSettings.fonts
        const cssRules: string[] = []

        // Helper function to get font family safely
        const getFontFamily = (fontValue: string | null | undefined) => {
          const normalized = normalizeFontValue(fontValue)
          if (!normalized) return { family: fontFamilyMap.roboto, fallback: fallbackFonts.roboto }
          return {
            family: fontFamilyMap[normalized] || fontFamilyMap.roboto,
            fallback: fallbackFonts[normalized] || fallbackFonts.roboto,
          }
        }

        // H1 styles
        if (fonts.h1) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.h1)
          cssRules.push(
            `.payload-admin .payload-rich-text h1 { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Post text (p, li)
        if (fonts.postText) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.postText)
          cssRules.push(
            `.payload-admin .payload-rich-text p, .payload-admin .payload-rich-text li { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Menu
        if (fonts.menu) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.menu)
          cssRules.push(
            `.payload-admin .nav, .payload-admin .nav *, .payload-admin .nav button, .payload-admin .nav a, .payload-admin .nav .nav__item, .payload-admin [class*="nav"] button, .payload-admin [class*="nav"] a { font-family: ${fontFamily}, ${fallback} !important; }`,
          )
        }

        // Caption
        if (fonts.caption) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.caption)
          cssRules.push(
            `.payload-admin .payload-rich-text figcaption { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // H2-H5
        if (fonts.h2h5) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.h2h5)
          cssRules.push(
            `.payload-admin .payload-rich-text h2, .payload-admin .payload-rich-text h3, .payload-admin .payload-rich-text h4, .payload-admin .payload-rich-text h5 { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Author
        if (fonts.author) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.author)
          cssRules.push(
            `.payload-admin .payload-rich-text .author { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Date
        if (fonts.date) {
          const { family: fontFamily, fallback } = getFontFamily(fonts.date)
          cssRules.push(
            `.payload-admin .payload-rich-text .date { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        if (cssRules.length > 0) {
          setStyles(cssRules.join('\n'))
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
