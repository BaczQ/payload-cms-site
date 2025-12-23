import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function deleteSiteSettings() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized')

  try {
    console.log('Deleting old site-settings record from database...')
    
    const db = payload.db as any
    console.log('Database adapter type:', db.constructor?.name)
    
    if (db.pool) {
      console.log('Connecting to database pool...')
      const client = await db.pool.connect()
      console.log('Connected to database')
      
      try {
        // Delete the old record
        console.log('Executing DELETE query...')
        const result = await client.query('DELETE FROM site_settings WHERE "globalType" = $1', ['site-settings'])
        console.log(`✓ Successfully deleted ${result.rowCount} record(s) from site_settings table`)
        console.log('✓ Old site-settings record removed')
        console.log('')
        console.log('Next steps:')
        console.log('1. Restart the server: pm2 restart bf-news')
        console.log('2. Open /admin/globals/site-settings in your browser')
        console.log('3. Payload will automatically create a new record with the correct structure')
      } catch (error: any) {
        console.error(`✗ SQL Error: ${error.message}`)
        console.error(`✗ Error code: ${error.code}`)
        console.error(`✗ Error detail: ${error.detail || 'N/A'}`)
        throw error
      } finally {
        client.release()
        console.log('Database connection released')
      }
    } else {
      console.error('✗ Could not access database pool')
      console.error('Database object:', Object.keys(db))
      throw new Error('Could not access database pool')
    }
  } catch (error) {
    console.error('Failed to delete site-settings:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    throw error
  }
}

deleteSiteSettings()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })

