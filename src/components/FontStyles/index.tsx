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

// Helper function to get font family safely
function getFontFamily(fontValue: string | null | undefined) {
  const normalized = normalizeFontValue(fontValue)
  if (!normalized) return { family: fontFamilyMap.roboto, fallback: fallbackFonts.roboto }
  return {
    family: fontFamilyMap[normalized] || fontFamilyMap.roboto,
    fallback: fallbackFonts[normalized] || fallbackFonts.roboto,
  }
}

// Helper function to generate CSS for a font element
function generateFontCSS(
  selector: string,
  fontConfig: {
    fontFamily?: string | null
    mobile?: {
      fontSize?: string | null
      lineHeight?: string | null
      fontWeight?: string | null
      fontStyle?: string | null
    }
    desktop?: {
      fontSize?: string | null
      lineHeight?: string | null
      fontWeight?: string | null
      fontStyle?: string | null
    }
  },
): string[] {
  const rules: string[] = []

  if (!fontConfig || !fontConfig.fontFamily) {
    return rules
  }

  const { family: fontFamily, fallback } = getFontFamily(fontConfig.fontFamily)

  // Mobile styles (default, up to 767px)
  const mobileStyles: string[] = []
  mobileStyles.push(`font-family: ${fontFamily}, ${fallback};`)

  if (fontConfig.mobile?.fontSize) {
    mobileStyles.push(`font-size: ${fontConfig.mobile.fontSize};`)
  }
  if (fontConfig.mobile?.lineHeight) {
    mobileStyles.push(`line-height: ${fontConfig.mobile.lineHeight};`)
  }
  if (fontConfig.mobile?.fontWeight) {
    mobileStyles.push(`font-weight: ${fontConfig.mobile.fontWeight};`)
  }
  if (fontConfig.mobile?.fontStyle) {
    mobileStyles.push(`font-style: ${fontConfig.mobile.fontStyle};`)
  }

  if (mobileStyles.length > 0) {
    rules.push(`${selector} { ${mobileStyles.join(' ')} }`)
  }

  // Desktop styles (768px and above)
  if (fontConfig.desktop) {
    const desktopStyles: string[] = []

    if (fontConfig.desktop.fontSize) {
      desktopStyles.push(`font-size: ${fontConfig.desktop.fontSize};`)
    }
    if (fontConfig.desktop.lineHeight) {
      desktopStyles.push(`line-height: ${fontConfig.desktop.lineHeight};`)
    }
    if (fontConfig.desktop.fontWeight) {
      desktopStyles.push(`font-weight: ${fontConfig.desktop.fontWeight};`)
    }
    if (fontConfig.desktop.fontStyle) {
      desktopStyles.push(`font-style: ${fontConfig.desktop.fontStyle};`)
    }

    if (desktopStyles.length > 0) {
      rules.push(`@media (min-width: 768px) { ${selector} { ${desktopStyles.join(' ')} } }`)
    }
  }

  return rules
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

        // H1 styles
        if (fonts.h1) {
          cssRules.push(...generateFontCSS('.payload-admin .payload-rich-text h1', fonts.h1))
        }

        // Post text (p, li)
        if (fonts.postText) {
          cssRules.push(
            ...generateFontCSS(
              '.payload-admin .payload-rich-text p, .payload-admin .payload-rich-text li',
              fonts.postText,
            ),
          )
        }

        // Menu
        if (fonts.menu) {
          cssRules.push(
            ...generateFontCSS(
              '.payload-admin .nav, .payload-admin .nav *, .payload-admin .nav button, .payload-admin .nav a, .payload-admin .nav .nav__item, .payload-admin [class*="nav"] button, .payload-admin [class*="nav"] a',
              fonts.menu,
            ),
          )
        }

        // Caption
        if (fonts.caption) {
          cssRules.push(
            ...generateFontCSS('.payload-admin .payload-rich-text figcaption', fonts.caption),
          )
        }

        // H2-H5
        if (fonts.h2h5) {
          cssRules.push(
            ...generateFontCSS(
              '.payload-admin .payload-rich-text h2, .payload-admin .payload-rich-text h3, .payload-admin .payload-rich-text h4, .payload-admin .payload-rich-text h5',
              fonts.h2h5,
            ),
          )
        }

        // Author
        if (fonts.author) {
          cssRules.push(
            ...generateFontCSS('.payload-admin .payload-rich-text .author', fonts.author),
          )
        }

        // Date
        if (fonts.date) {
          cssRules.push(...generateFontCSS('.payload-admin .payload-rich-text .date', fonts.date))
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
