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
  'libre-franklin': '"Libre Franklin", system-ui, sans-serif',
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
  'libre-franklin': 'system-ui, sans-serif',
}

export default function FontStyles() {
  const [styles, setStyles] = useState<string>('')

  useEffect(() => {
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

        // H1 styles
        if (fonts.h1) {
          const fontFamily = fontFamilyMap[fonts.h1] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.h1] || fallbackFonts.roboto
          cssRules.push(
            `.payload-admin .payload-rich-text h1 { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Post text (p, li)
        if (fonts.postText) {
          const fontFamily = fontFamilyMap[fonts.postText] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.postText] || fallbackFonts.roboto
          cssRules.push(
            `.payload-admin .payload-rich-text p, .payload-admin .payload-rich-text li { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Menu
        if (fonts.menu) {
          const fontFamily = fontFamilyMap[fonts.menu] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.menu] || fallbackFonts.roboto
          cssRules.push(`.payload-admin .nav { font-family: ${fontFamily}, ${fallback}; }`)
        }

        // Caption
        if (fonts.caption) {
          const fontFamily = fontFamilyMap[fonts.caption] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.caption] || fallbackFonts.roboto
          cssRules.push(
            `.payload-admin .payload-rich-text figcaption { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // H2-H5
        if (fonts.h2h5) {
          const fontFamily = fontFamilyMap[fonts.h2h5] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.h2h5] || fallbackFonts.roboto
          cssRules.push(
            `.payload-admin .payload-rich-text h2, .payload-admin .payload-rich-text h3, .payload-admin .payload-rich-text h4, .payload-admin .payload-rich-text h5 { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Author
        if (fonts.author) {
          const fontFamily = fontFamilyMap[fonts.author] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.author] || fallbackFonts.roboto
          cssRules.push(
            `.payload-admin .payload-rich-text .author { font-family: ${fontFamily}, ${fallback}; }`,
          )
        }

        // Date
        if (fonts.date) {
          const fontFamily = fontFamilyMap[fonts.date] || fontFamilyMap.roboto
          const fallback = fallbackFonts[fonts.date] || fallbackFonts.roboto
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

  if (!styles) {
    return null
  }

  return <style dangerouslySetInnerHTML={{ __html: styles }} />
}

