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
    // If the site is served over HTTPS but the media URL is HTTP,
    // upgrade it to HTTPS to avoid mixed-content blocks in the browser.
    if (canUseDOM && window.location.protocol === 'https:' && url.startsWith('http://')) {
      const upgraded = url.replace(/^http:\/\//, 'https://')
      return cacheTag ? `${upgraded}?${cacheTag}` : upgraded
    }
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // Convert /api/media/file/ paths to direct /media/ paths for better compatibility
  // This is especially important in standalone mode where Payload API may not work correctly
  if (url.startsWith('/api/media/file/')) {
    const filename = url.replace('/api/media/file/', '')
    const directUrl = `/media/${filename}`
    return cacheTag ? `${directUrl}?${cacheTag}` : directUrl
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
