import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function createSiteSettings() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized')

  try {
    console.log('Creating site-settings global with default values...')
    
    // This will create the table if it doesn't exist and create a new record
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

    console.log('✓ Successfully created site-settings global!')
    console.log('✓ Table created with correct structure')
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

