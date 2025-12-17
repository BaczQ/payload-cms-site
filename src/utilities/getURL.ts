import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `http://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4000')

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
    return `http://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
