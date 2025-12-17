'use client'

import { useEffect } from 'react'

/**
 * Global error handler to suppress non-critical clipboard errors from Lexical editor
 * This error occurs when Lexical tries to set clipboard data in contexts where
 * the browser security policy doesn't allow it. It's non-critical and doesn't
 * affect editor functionality.
 */
export function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (for async clipboard operations)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason

      // Suppress the specific clipboard modification error from Lexical
      if (
        error instanceof DOMException &&
        error.name === 'NoModificationAllowedError' &&
        error.message === 'Modifications are not allowed for this document'
      ) {
        // This is a known non-critical error from Lexical editor clipboard handling
        // It doesn't affect functionality, so we suppress it
        event.preventDefault()
        console.debug('Suppressed non-critical Lexical clipboard error:', error.message)
        return
      }

      // Allow other errors to propagate normally
    }

    // Handle regular errors
    const handleError = (event: ErrorEvent) => {
      const error = event.error

      // Suppress the specific clipboard modification error from Lexical
      if (
        error instanceof DOMException &&
        error.name === 'NoModificationAllowedError' &&
        error.message === 'Modifications are not allowed for this document'
      ) {
        // This is a known non-critical error from Lexical editor clipboard handling
        event.preventDefault()
        console.debug('Suppressed non-critical Lexical clipboard error:', error.message)
        return
      }

      // Allow other errors to propagate normally
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
