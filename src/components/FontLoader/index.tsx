'use client'

import { useEffect } from 'react'

export default function FontLoader() {
  useEffect(() => {
    // Only load in admin panel
    if (typeof window === 'undefined' || !window.location.pathname.includes('/admin')) {
      return
    }

    try {
      // Google Fonts URL with all fonts
      const googleFontsUrl =
        'https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Gloock&family=Lobster&family=Manufacturing+Consent&family=Noto+Sans+Display:ital,wght@0,100..900;1,100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto+Flex:opsz,wght,XOPQ,XTRA,YOPQ,YTDE,YTFI,YTLC,YTUC@8..144,100..1000,96,468,79,-203,738,514,712&family=Roboto:ital,wght@0,100..900;1,100..900&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap'

      // Check if links already exist
      const existingPreconnect1 = document.querySelector('link[href="https://fonts.googleapis.com"]')
      const existingPreconnect2 = document.querySelector('link[href="https://fonts.gstatic.com"]')
      const existingStylesheet = document.querySelector(`link[href="${googleFontsUrl}"]`)

      if (!existingPreconnect1) {
        const preconnect1 = document.createElement('link')
        preconnect1.rel = 'preconnect'
        preconnect1.href = 'https://fonts.googleapis.com'
        document.head.appendChild(preconnect1)
      }

      if (!existingPreconnect2) {
        const preconnect2 = document.createElement('link')
        preconnect2.rel = 'preconnect'
        preconnect2.href = 'https://fonts.gstatic.com'
        preconnect2.crossOrigin = 'anonymous'
        document.head.appendChild(preconnect2)
      }

      if (!existingStylesheet) {
        const stylesheet = document.createElement('link')
        stylesheet.href = googleFontsUrl
        stylesheet.rel = 'stylesheet'
        document.head.appendChild(stylesheet)
      }
    } catch (error) {
      // Silently fail - don't break the app
      console.error('Failed to load fonts:', error)
    }
  }, [])

  return null
}

