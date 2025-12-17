import { unstable_cache } from 'next/cache'

export interface SiteSettings {
  menuItemsCount: number
}

/**
 * Returns site settings with default values
 * Can be extended to read from a global or environment variables
 */
async function getSiteSettingsInternal(): Promise<SiteSettings> {
  // Default value for menu items count
  // This can be extended to read from a global or environment variable
  return {
    menuItemsCount: 5,
  }
}

/**
 * Cached version of getSiteSettings
 */
export const getSiteSettings = unstable_cache(
  async () => getSiteSettingsInternal(),
  ['site-settings'],
  {
    tags: ['site-settings'],
  },
)
