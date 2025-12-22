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
          const fontFamily = fontFamilyMap[fonts.h1] || fontFamilyMap.roboto
          cssRules.push(
            `h1, .payload-richtext h1 { font-family: ${fontFamily} !important; }`,
          )
        }

        // Post text (p, li) - текст поста
        if (fonts.postText) {
          const fontFamily = fontFamilyMap[fonts.postText] || fontFamilyMap.roboto
          cssRules.push(
            `.payload-richtext, .payload-richtext p, .payload-richtext li { font-family: ${fontFamily} !important; }`,
          )
        }

        // Menu - текст в меню
        if (fonts.menu) {
          const fontFamily = fontFamilyMap[fonts.menu] || fontFamilyMap.roboto
          cssRules.push(`header nav, header nav a, header nav button, nav, nav a, nav button, .nav, .nav a, .nav button, [class*="nav"] button { font-family: ${fontFamily} !important; }`)
        }

        // Caption - подпись изображения
        if (fonts.caption) {
          const fontFamily = fontFamilyMap[fonts.caption] || fontFamilyMap.roboto
          cssRules.push(
            `figcaption, .payload-richtext figcaption { font-family: ${fontFamily} !important; }`,
          )
        }

        // H2-H5 - подзаголовки
        if (fonts.h2h5) {
          const fontFamily = fontFamilyMap[fonts.h2h5] || fontFamilyMap.roboto
          cssRules.push(
            `h2, h3, h4, h5, .payload-richtext h2, .payload-richtext h3, .payload-richtext h4, .payload-richtext h5 { font-family: ${fontFamily} !important; }`,
          )
        }

        // Author - автор
        if (fonts.author) {
          const fontFamily = fontFamilyMap[fonts.author] || fontFamilyMap.roboto
          cssRules.push(
            `.author, .payload-richtext .author { font-family: ${fontFamily} !important; }`,
          )
        }

        // Date - дата
        if (fonts.date) {
          const fontFamily = fontFamilyMap[fonts.date] || fontFamilyMap.roboto
          cssRules.push(
            `time, .date, .payload-richtext .date { font-family: ${fontFamily} !important; }`,
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
