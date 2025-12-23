'use client'

import { useEffect, useState } from 'react'

// Mapping font values to CSS font-family declarations
// Для шрифтов, загружаемых через next/font/google, используем CSS переменные
// Для остальных (Gloock, Manufacturing Consent) используем строковые имена
const fontFamilyMap: Record<string, string> = {
  roboto: 'var(--font-roboto), system-ui, sans-serif',
  gloock: '"Gloock", serif',
  antonio: 'var(--font-antonio), system-ui, sans-serif',
  'manufacturing-consent': '"Manufacturing Consent", system-ui, sans-serif',
  'noto-sans-display': 'var(--font-noto-sans-display), system-ui, sans-serif',
  'roboto-flex': 'var(--font-roboto-flex), system-ui, sans-serif',
  'roboto-condensed': 'var(--font-roboto-condensed), system-ui, sans-serif',
  tinos: 'var(--font-tinos), Georgia, serif',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

// Helper function to get font family safely
function getFontFamily(fontValue: string | null | undefined): string {
  if (!fontValue || typeof fontValue !== 'string') {
    return fontFamilyMap.roboto
  }
  return fontFamilyMap[fontValue] || fontFamilyMap.roboto
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

  const fontFamily = getFontFamily(fontConfig.fontFamily)

  // Mobile styles (default, up to 767px)
  const mobileStyles: string[] = []
  mobileStyles.push(`font-family: ${fontFamily} !important;`)

  if (fontConfig.mobile?.fontSize) {
    mobileStyles.push(`font-size: ${fontConfig.mobile.fontSize} !important;`)
  }
  if (fontConfig.mobile?.lineHeight) {
    mobileStyles.push(`line-height: ${fontConfig.mobile.lineHeight} !important;`)
  }
  if (fontConfig.mobile?.fontWeight) {
    mobileStyles.push(`font-weight: ${fontConfig.mobile.fontWeight} !important;`)
  }
  if (fontConfig.mobile?.fontStyle) {
    mobileStyles.push(`font-style: ${fontConfig.mobile.fontStyle} !important;`)
  }

  if (mobileStyles.length > 0) {
    rules.push(`${selector} { ${mobileStyles.join(' ')} }`)
  }

  // Desktop styles (768px and above)
  if (fontConfig.desktop) {
    const desktopStyles: string[] = []

    if (fontConfig.desktop.fontSize) {
      desktopStyles.push(`font-size: ${fontConfig.desktop.fontSize} !important;`)
    }
    if (fontConfig.desktop.lineHeight) {
      desktopStyles.push(`line-height: ${fontConfig.desktop.lineHeight} !important;`)
    }
    if (fontConfig.desktop.fontWeight) {
      desktopStyles.push(`font-weight: ${fontConfig.desktop.fontWeight} !important;`)
    }
    if (fontConfig.desktop.fontStyle) {
      desktopStyles.push(`font-style: ${fontConfig.desktop.fontStyle} !important;`)
    }

    if (desktopStyles.length > 0) {
      rules.push(`@media (min-width: 768px) { ${selector} { ${desktopStyles.join(' ')} } }`)
    }
  }

  return rules
}

export default function FontStylesFrontend() {
  const [styles, setStyles] = useState<string>('')

  useEffect(() => {
    async function loadFontStyles() {
      try {
        // Only load on frontend (not in admin)
        if (typeof window === 'undefined' || window.location.pathname.includes('/admin')) {
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

        // H1 styles - заголовок поста (внутри RichText и вне его)
        if (fonts.h1) {
          cssRules.push(...generateFontCSS('h1, .payload-richtext h1', fonts.h1))
        }

        // Post text (p, li) - текст поста
        if (fonts.postText) {
          cssRules.push(
            ...generateFontCSS(
              '.payload-richtext, .payload-richtext p, .payload-richtext li',
              fonts.postText,
            ),
          )
        }

        // Menu - текст в меню
        if (fonts.menu) {
          cssRules.push(
            ...generateFontCSS(
              'header nav, header nav a, header nav button, nav, nav a, nav button, .nav, .nav a, .nav button, [class*="nav"] button',
              fonts.menu,
            ),
          )
        }

        // Caption - подпись изображения
        if (fonts.caption) {
          cssRules.push(
            ...generateFontCSS('figcaption, .payload-richtext figcaption', fonts.caption),
          )
        }

        // H2-H5 - подзаголовки
        if (fonts.h2h5) {
          cssRules.push(
            ...generateFontCSS(
              'h2, h3, h4, h5, .payload-richtext h2, .payload-richtext h3, .payload-richtext h4, .payload-richtext h5',
              fonts.h2h5,
            ),
          )
        }

        // Author - автор
        if (fonts.author) {
          cssRules.push(
            ...generateFontCSS('.author, .payload-richtext .author', fonts.author),
          )
        }

        // Date - дата
        if (fonts.date) {
          cssRules.push(
            ...generateFontCSS('time, .date, .payload-richtext .date', fonts.date),
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
