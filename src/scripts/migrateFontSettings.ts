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
            h1: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '24px',
                lineHeight: '1.2',
                fontWeight: '700',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '32px',
                lineHeight: '1.2',
                fontWeight: '700',
                fontStyle: 'normal',
              },
            },
            postText: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: '400',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '18px',
                lineHeight: '1.6',
                fontWeight: '400',
                fontStyle: 'normal',
              },
            },
            menu: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '14px',
                lineHeight: '1.5',
                fontWeight: '500',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: '500',
                fontStyle: 'normal',
              },
            },
            caption: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '12px',
                lineHeight: '1.4',
                fontWeight: '400',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '14px',
                lineHeight: '1.4',
                fontWeight: '400',
                fontStyle: 'normal',
              },
            },
            h2h5: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '20px',
                lineHeight: '1.3',
                fontWeight: '600',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '24px',
                lineHeight: '1.3',
                fontWeight: '600',
                fontStyle: 'normal',
              },
            },
            author: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '14px',
                lineHeight: '1.5',
                fontWeight: '400',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: '400',
                fontStyle: 'normal',
              },
            },
            date: {
              fontFamily: 'roboto',
              mobile: {
                fontSize: '12px',
                lineHeight: '1.5',
                fontWeight: '400',
                fontStyle: 'normal',
              },
              desktop: {
                fontSize: '14px',
                lineHeight: '1.5',
                fontWeight: '400',
                fontStyle: 'normal',
              },
            },
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
            h1: {
              fontFamily: 'roboto',
              mobile: { fontSize: '24px', lineHeight: '1.2', fontWeight: '700', fontStyle: 'normal' },
              desktop: { fontSize: '32px', lineHeight: '1.2', fontWeight: '700', fontStyle: 'normal' },
            },
            postText: {
              fontFamily: 'roboto',
              mobile: { fontSize: '16px', lineHeight: '1.5', fontWeight: '400', fontStyle: 'normal' },
              desktop: { fontSize: '18px', lineHeight: '1.6', fontWeight: '400', fontStyle: 'normal' },
            },
            menu: {
              fontFamily: 'roboto',
              mobile: { fontSize: '14px', lineHeight: '1.5', fontWeight: '500', fontStyle: 'normal' },
              desktop: { fontSize: '16px', lineHeight: '1.5', fontWeight: '500', fontStyle: 'normal' },
            },
            caption: {
              fontFamily: 'roboto',
              mobile: { fontSize: '12px', lineHeight: '1.4', fontWeight: '400', fontStyle: 'normal' },
              desktop: { fontSize: '14px', lineHeight: '1.4', fontWeight: '400', fontStyle: 'normal' },
            },
            h2h5: {
              fontFamily: 'roboto',
              mobile: { fontSize: '20px', lineHeight: '1.3', fontWeight: '600', fontStyle: 'normal' },
              desktop: { fontSize: '24px', lineHeight: '1.3', fontWeight: '600', fontStyle: 'normal' },
            },
            author: {
              fontFamily: 'roboto',
              mobile: { fontSize: '14px', lineHeight: '1.5', fontWeight: '400', fontStyle: 'normal' },
              desktop: { fontSize: '16px', lineHeight: '1.5', fontWeight: '400', fontStyle: 'normal' },
            },
            date: {
              fontFamily: 'roboto',
              mobile: { fontSize: '12px', lineHeight: '1.5', fontWeight: '400', fontStyle: 'normal' },
              desktop: { fontSize: '14px', lineHeight: '1.5', fontWeight: '400', fontStyle: 'normal' },
            },
          },
        },
      })
      return
    }

    // Migrate old structure to new
    const fontKeys = ['h1', 'postText', 'menu', 'caption', 'h2h5', 'author', 'date'] as const
    let needsUpdate = false
    const migratedFonts: any = {}

    for (const key of fontKeys) {
      const fontValue = fonts[key]

      // If it's a string (old format), convert to new format
      if (typeof fontValue === 'string') {
        needsUpdate = true
        migratedFonts[key] = {
          fontFamily: fontValue,
          mobile: {
            fontSize: key === 'h1' ? '24px' : key === 'postText' ? '16px' : '14px',
            lineHeight: '1.5',
            fontWeight: key === 'h1' || key === 'h2h5' ? '700' : '400',
            fontStyle: 'normal',
          },
          desktop: {
            fontSize: key === 'h1' ? '32px' : key === 'postText' ? '18px' : '16px',
            lineHeight: '1.5',
            fontWeight: key === 'h1' || key === 'h2h5' ? '700' : '400',
            fontStyle: 'normal',
          },
        }
      }
      // If it's already in new format, keep it
      else if (fontValue && typeof fontValue === 'object' && fontValue.fontFamily) {
        migratedFonts[key] = fontValue
      }
      // If missing, set default
      else {
        needsUpdate = true
        migratedFonts[key] = {
          fontFamily: 'roboto',
          mobile: {
            fontSize: key === 'h1' ? '24px' : key === 'postText' ? '16px' : '14px',
            lineHeight: '1.5',
            fontWeight: key === 'h1' || key === 'h2h5' ? '700' : '400',
            fontStyle: 'normal',
          },
          desktop: {
            fontSize: key === 'h1' ? '32px' : key === 'postText' ? '18px' : '16px',
            lineHeight: '1.5',
            fontWeight: key === 'h1' || key === 'h2h5' ? '700' : '400',
            fontStyle: 'normal',
          },
        }
      }
    }

    if (needsUpdate || Object.keys(migratedFonts).length > 0) {
      payload.logger.info('Updating font settings with new structure...')
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

