import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getSiteNameUncached(): Promise<string> {
  try {
    const payload = await getPayload({ config: configPromise })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    return (siteSettings?.siteName as string) || 'BF News'
  } catch (error) {
    console.error('Error fetching site name:', error)
    return 'BF News'
  }
}

export const getSiteName = unstable_cache(getSiteNameUncached, ['site-name'], {
  tags: ['global_site-settings'],
})

