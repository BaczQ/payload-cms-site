import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site settings`)

    // Revalidate the cache tag used by getSiteSettings
    revalidateTag('global_site-settings')

    // Revalidate the root path to update the layout which uses site settings
    // This will update the font on all pages since they all use the root layout
    revalidatePath('/', 'layout')

    // Also revalidate common paths to ensure immediate updates
    revalidatePath('/')
    revalidatePath('/posts')
  }

  return doc
}
