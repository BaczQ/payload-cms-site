import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function migrateFontSettings() {
  const payload = await getPayload({ config: configPromise })

  try {
    payload.logger.info('Starting font settings migration...')

    // Get current global data using raw database query
    const result = await payload.db.findGlobal({
      slug: 'site-settings',
      req: {
        payload,
        user: null,
      } as any,
    })

    if (!result) {
      payload.logger.info('No site-settings global found, creating new one...')
      // Create new global with default structure
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          fonts: {
            body: { fontFamily: 'roboto' },
            h1: { fontFamily: 'roboto' },
            postText: { fontFamily: 'roboto' },
            buttonText: { fontFamily: 'roboto' },
            allPostsLink: { fontFamily: 'roboto' },
            cardCategory: { fontFamily: 'roboto' },
            cardText: { fontFamily: 'roboto' },
            footerMenu: { fontFamily: 'roboto' },
            footerText: { fontFamily: 'roboto' },
            headerMenu: { fontFamily: 'roboto' },
          },
        },
      })
      payload.logger.info('Created new site-settings global with default font structure')
      return
    }

    // Check if migration is needed
    const fonts = result.fonts
    if (!fonts || typeof fonts !== 'object') {
      payload.logger.info('No fonts data found, setting defaults...')
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          fonts: {
            body: { fontFamily: 'roboto' },
            h1: { fontFamily: 'roboto' },
            postText: { fontFamily: 'roboto' },
            buttonText: { fontFamily: 'roboto' },
            allPostsLink: { fontFamily: 'roboto' },
            cardCategory: { fontFamily: 'roboto' },
            cardText: { fontFamily: 'roboto' },
            footerMenu: { fontFamily: 'roboto' },
            footerText: { fontFamily: 'roboto' },
            headerMenu: { fontFamily: 'roboto' },
          },
        },
      })
      return
    }

    // Migrate old structure to new (extract only fontFamily)
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
    let needsUpdate = false
    const migratedFonts: any = {}

    for (const key of fontKeys) {
      const fontValue = fonts[key]

      // If it's a string (old format), convert to new format
      if (typeof fontValue === 'string') {
        needsUpdate = true
        migratedFonts[key] = {
          fontFamily: fontValue,
        }
      }
      // If it's an object, extract only fontFamily
      else if (fontValue && typeof fontValue === 'object') {
        if (fontValue.fontFamily) {
          // Check if it has old mobile/desktop fields that need cleanup
          if (fontValue.mobile || fontValue.desktop) {
            needsUpdate = true
            migratedFonts[key] = {
              fontFamily: fontValue.fontFamily,
            }
          } else {
            migratedFonts[key] = {
              fontFamily: fontValue.fontFamily,
            }
          }
        } else {
          // Missing fontFamily, set default
          needsUpdate = true
          migratedFonts[key] = {
            fontFamily: 'roboto',
          }
        }
      }
      // If missing, set default
      else {
        needsUpdate = true
        migratedFonts[key] = {
          fontFamily: 'roboto',
        }
      }
    }

    if (needsUpdate) {
      payload.logger.info('Updating font settings with simplified structure (fontFamily only)...')
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          fonts: migratedFonts,
        },
      })
      payload.logger.info('Font settings migration completed successfully!')
    } else {
      payload.logger.info('No migration needed, font settings are already in correct format')
    }
  } catch (error) {
    payload.logger.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

// Run migration
migrateFontSettings()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration error:', error)
    process.exit(1)
  })

