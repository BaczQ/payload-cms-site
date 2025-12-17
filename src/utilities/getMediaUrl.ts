import { getClientSideURL, getServerSideURL } from '@/utilities/getURL'
import canUseDOM from '@/utilities/canUseDOM'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // For relative URLs (starting with /), use them as-is for Next.js Image optimization
  // Next.js will handle relative URLs correctly during SSR and client-side
  if (url.startsWith('/')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // For relative paths without leading slash, use consistent URL source
  // Use server-side URL during SSR, client-side URL on client to avoid hydration mismatch
  const baseUrl = canUseDOM ? getClientSideURL() : getServerSideURL()
  return cacheTag ? `${baseUrl}${url}?${cacheTag}` : `${baseUrl}${url}`
}
