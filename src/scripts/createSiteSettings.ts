import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function createSiteSettings() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized')

  try {
    // Check if global already exists
    let existingGlobal
    try {
      existingGlobal = await payload.findGlobal({
        slug: 'site-settings',
      })
      console.log('Found existing site-settings global')
    } catch (error) {
      console.log('No existing site-settings global found, will create new one')
    }

    if (existingGlobal) {
      console.log('Site-settings already exists. Updating with body font settings...')
      // Update existing with body if missing
      const updatedFonts = {
        ...existingGlobal.fonts,
        body: existingGlobal.fonts?.body || {
          fontFamily: 'roboto',
          mobile: {
            fontSize: '16px',
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
      }

      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          fonts: updatedFonts,
        },
      })
      console.log('✓ Successfully updated site-settings with body font!')
    } else {
      console.log('Creating site-settings global with default values...')
      
      // This will create the table if it doesn't exist and create a new record
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
        fonts: {
          body: {
            fontFamily: 'roboto',
          },
          h1: {
            fontFamily: 'roboto',
          },
          postText: {
            fontFamily: 'roboto',
          },
          buttonText: {
            fontFamily: 'roboto',
          },
          allPostsLink: {
            fontFamily: 'roboto',
          },
          cardCategory: {
            fontFamily: 'roboto',
          },
          cardText: {
            fontFamily: 'roboto',
          },
          footerMenu: {
            fontFamily: 'roboto',
          },
          footerText: {
            fontFamily: 'roboto',
          },
          headerMenu: {
            fontFamily: 'roboto',
          },
        },
      },
    })

      console.log('✓ Successfully created site-settings global!')
      console.log('✓ Table created with correct structure')
    }
    
    console.log('')
    console.log('You can now access /admin/globals/site-settings')
  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack)
    }
    throw error
  }
}

createSiteSettings()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })

