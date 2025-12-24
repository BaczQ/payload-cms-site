import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function cleanupFontFields() {
  const payload = await getPayload({ config: configPromise })

  try {
    payload.logger.info('Starting font fields cleanup...')

    // Get current global data
    const result = await payload.db.findGlobal({
      slug: 'site-settings',
      req: {
        payload,
        user: null,
      } as any,
    })

    if (!result || !result.fonts) {
      payload.logger.info('No site-settings or fonts found, nothing to clean up')
      return
    }

    const fontKeys = [
      'body',
      'h1',
      'postText',
      'buttonText',
      'allPostsLink',
      'cardCategory',
      'cardText',
      'footerMenu',
      'footerText',
      'headerMenu',
    ] as const

    const cleanedFonts: any = {}

    // Remove selectedElement if it exists
    if ('selectedElement' in result.fonts) {
      delete result.fonts.selectedElement
    }

    // Clean up each font entry - keep only fontFamily
    for (const key of fontKeys) {
      const fontValue = result.fonts[key]

      if (!fontValue) {
        continue
      }

      // If it's a string (old format), keep it as is
      if (typeof fontValue === 'string') {
        cleanedFonts[key] = {
          fontFamily: fontValue,
        }
      }
      // If it's an object, extract only fontFamily
      else if (fontValue && typeof fontValue === 'object') {
        if (fontValue.fontFamily) {
          cleanedFonts[key] = {
            fontFamily: fontValue.fontFamily,
          }
        }
      }
    }

    // Update global with cleaned data
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...result,
        fonts: cleanedFonts,
      },
      req: {
        payload,
        user: null,
      } as any,
    })

    payload.logger.info('Font fields cleanup completed successfully')
    payload.logger.info(`Cleaned fonts: ${Object.keys(cleanedFonts).join(', ')}`)
  } catch (error) {
    payload.logger.error(`Font fields cleanup error: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  } finally {
    if (payload.db?.destroy) {
      await payload.db.destroy()
    }
  }
}

cleanupFontFields()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Cleanup failed:', error)
    process.exit(1)
  })

