'use client'

import { useEffect } from 'react'

/**
 * Handles ChunkLoadError that occurs when Next.js chunks are missing
 * (common after deployment when old chunks are referenced but removed)
 * Automatically reloads the page once to fetch the latest chunks
 */
export function ChunkLoadErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error || event.message

      // Check if this is a ChunkLoadError
      const isChunkLoadError =
        error?.message?.includes('ChunkLoadError') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.name === 'ChunkLoadError'

      if (isChunkLoadError) {
        // Only reload once to prevent infinite loops
        const hasReloaded = sessionStorage.getItem('chunk-error-reloaded')
        if (!hasReloaded) {
          sessionStorage.setItem('chunk-error-reloaded', 'true')
          console.warn('ChunkLoadError detected, reloading page to fetch latest chunks...')
          window.location.reload()
        } else {
          // If we already reloaded and still have errors, clear the flag and show error
          sessionStorage.removeItem('chunk-error-reloaded')
          console.error('ChunkLoadError persisted after reload:', error)
        }
      }
    }

    // Handle unhandled errors
    window.addEventListener('error', handleError)

    // Handle unhandled promise rejections (chunk loading can fail as promises)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const errorMessage = reason?.message || String(reason)

      const isChunkLoadError =
        errorMessage.includes('ChunkLoadError') ||
        errorMessage.includes('Loading chunk') ||
        errorMessage.includes('Failed to fetch dynamically imported module')

      if (isChunkLoadError) {
        const hasReloaded = sessionStorage.getItem('chunk-error-reloaded')
        if (!hasReloaded) {
          sessionStorage.setItem('chunk-error-reloaded', 'true')
          console.warn('ChunkLoadError detected (promise rejection), reloading page...')
          window.location.reload()
        } else {
          sessionStorage.removeItem('chunk-error-reloaded')
          console.error('ChunkLoadError persisted after reload:', reason)
        }
        event.preventDefault() // Prevent default error logging
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup: clear the reload flag on successful page load
    // This ensures the handler works again if the user navigates away and comes back
    const clearReloadFlag = () => {
      // Clear after a short delay to allow the page to fully load
      setTimeout(() => {
        sessionStorage.removeItem('chunk-error-reloaded')
      }, 5000)
    }

    if (document.readyState === 'complete') {
      clearReloadFlag()
    } else {
      window.addEventListener('load', clearReloadFlag)
    }

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('load', clearReloadFlag)
    }
  }, [])

  return null
}
