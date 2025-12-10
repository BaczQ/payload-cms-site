import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type SiteSettings = {
  siteName: string
  menuItemsCount: number
  seoTitle?: string | null
  seoDescription?: string | null
}

async function getSiteSettingsUncached(): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config: configPromise })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    return {
      siteName: (siteSettings?.siteName as string) || 'BF News',
      menuItemsCount: (siteSettings?.menuItemsCount as number) || 7,
      seoTitle: (siteSettings?.seoTitle as string) || null,
      seoDescription: (siteSettings?.seoDescription as string) || null,
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {
      siteName: 'BF News',
      menuItemsCount: 7,
      seoTitle: null,
      seoDescription: null,
    }
  }
}

export const getSiteSettings = unstable_cache(getSiteSettingsUncached, ['site-settings'], {
  tags: ['global_site-settings'],
})

