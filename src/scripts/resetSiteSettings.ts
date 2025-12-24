import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function resetSiteSettings() {
  const payload = await getPayload({ config: configPromise })

  try {
    console.log('Resetting site-settings global...')
    
    // Delete old global record using direct SQL
    console.log('Deleting old site-settings record...')
    const db = payload.db as any
    if (db.pool) {
      const client = await db.pool.connect()
      try {
        const result = await client.query('DELETE FROM site_settings WHERE "globalType" = $1', ['site-settings'])
        console.log(`✓ Deleted ${result.rowCount} old site-settings record(s)`)
      } catch (error: any) {
        console.log(`Note: ${error.message}`)
        // If table doesn't exist or column doesn't exist, that's okay
        if (!error.message.includes('does not exist')) {
          throw error
        }
      } finally {
        client.release()
      }
    } else {
      console.log('Warning: Could not access database pool directly')
    }

    // Create new global with correct structure
    console.log('Creating new site-settings global with default values...')
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

    console.log('✓ Successfully created new site-settings global!')
    console.log('You can now access /admin/globals/site-settings')
  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

resetSiteSettings()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed:', error)
    process.exit(1)
  })

