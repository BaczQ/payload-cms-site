'use client'

import { useEffect } from 'react'

export default function FontLoaderFrontend() {
  useEffect(() => {
    // Only load on frontend (not in admin)
    if (typeof window === 'undefined' || window.location.pathname.includes('/admin')) {
      return
    }

    try {
      // Загружаем только шрифты, которые не доступны через next/font/google
      // Gloock и Manufacturing Consent
      const googleFontsUrl =
        'https://fonts.googleapis.com/css2?family=Gloock&family=Manufacturing+Consent&display=swap'

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
        stylesheet.media = 'print'
        stylesheet.onload = function () {
          if (this instanceof HTMLLinkElement) {
            this.media = 'all'
          }
        }
        document.head.appendChild(stylesheet)
      }

      // Load local font Libre Franklin
      const existingLibreFranklin = document.querySelector('style[data-font="libre-franklin"]')
      if (!existingLibreFranklin) {
        const fontStyle = document.createElement('style')
        fontStyle.setAttribute('data-font', 'libre-franklin')
        fontStyle.textContent = `
          @font-face {
            font-family: 'Libre Franklin';
            src: url('/fonts/1.woff2') format('woff2');
            font-display: swap;
            font-weight: normal;
            font-style: normal;
          }
        `
        document.head.appendChild(fontStyle)
      }
    } catch (error) {
      // Silently fail - don't break the app
      console.error('Failed to load fonts:', error)
    }
  }, [])

  return null
}

