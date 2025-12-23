// Simple script to delete site-settings record directly
import { readFileSync } from 'fs'
import { Pool } from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
const envPath = join(__dirname, '../../.env')
try {
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '')
    }
  })
} catch (e) {
  console.log('No .env file found, using environment variables')
}

const databaseUri = process.env.DATABASE_URI

if (!databaseUri) {
  console.error('✗ DATABASE_URI environment variable is not set')
  process.exit(1)
}

console.log('Connecting to database...')
const pool = new Pool({ connectionString: databaseUri })

pool.query('DELETE FROM site_settings WHERE "globalType" = $1', ['site-settings'])
  .then(result => {
    console.log(`✓ Successfully deleted ${result.rowCount} record(s) from site_settings table`)
    console.log('✓ Old site-settings record removed')
    console.log('')
    console.log('Next steps:')
    console.log('1. The server should automatically detect the change')
    console.log('2. Open /admin/globals/site-settings in your browser')
    console.log('3. Payload will automatically create a new record with the correct structure')
    return pool.end()
  })
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(`✗ Error: ${error.message}`)
    if (error.code) {
      console.error(`✗ Error code: ${error.code}`)
    }
    pool.end().then(() => process.exit(1))
  })

