import { getCachedGlobal } from '@/utilities/getGlobals'

const googleFontsUrl =
  'https://fonts.googleapis.com/css2?family=Gloock&family=Manufacturing+Consent&display=swap'

export default async function Head() {
  let updatedAt = 'initial'

  try {
    const getSiteSettings = getCachedGlobal('site-settings', 0)
    const siteSettings = await getSiteSettings()
    if (siteSettings?.updatedAt) {
      updatedAt = siteSettings.updatedAt
    }
  } catch {
    updatedAt = 'initial'
  }

  const cacheBuster = `?v=${encodeURIComponent(updatedAt)}`

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href={googleFontsUrl} rel="stylesheet" />
      <link href={`/site-fonts.css${cacheBuster}`} rel="stylesheet" />
    </>
  )
}
