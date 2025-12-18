import canUseDOM from './canUseDOM'

const normalizeServerURL = (raw: string): string => {
  const trimmed = raw?.trim()
  if (!trimmed) return ''

  // If server URL is provided without protocol, assume https in production
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    const assumed = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${trimmed}`
    return assumed
  }

  // In production, avoid generating http URLs (unless explicitly localhost)
  if (
    process.env.NODE_ENV === 'production' &&
    trimmed.startsWith('http://') &&
    !trimmed.startsWith('http://localhost') &&
    !trimmed.startsWith('http://127.0.0.1')
  ) {
    return trimmed.replace(/^http:\/\//, 'https://')
  }

  return trimmed
}

export const getServerSideURL = () => {
  const raw =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NODE_ENV === 'production'
        ? 'https://bfnews.ru'
        : 'http://localhost:4000')

  const url = normalizeServerURL(raw)

  // Validate URL format
  if (!url || url.trim() === '') {
    console.warn('NEXT_PUBLIC_SERVER_URL is empty, falling back to http://localhost:4000')
    return 'http://localhost:4000'
  }

  return url
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return normalizeServerURL(process.env.NEXT_PUBLIC_SERVER_URL || '')
}
