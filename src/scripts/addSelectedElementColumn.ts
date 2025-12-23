// Script to add fonts_selected_element column to site_settings table
import { readFileSync } from 'fs'
import { Pool } from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

pool.query(`
  ALTER TABLE site_settings 
  ADD COLUMN IF NOT EXISTS fonts_selected_element VARCHAR(255) DEFAULT 'h1';
`)
  .then(result => {
    console.log('✓ Successfully added fonts_selected_element column')
    console.log('✓ Column added with default value "h1"')
    return pool.end()
  })
  .then(() => {
    console.log('')
    console.log('Next steps:')
    console.log('1. Restart the server')
    console.log('2. Open /admin/globals/site-settings in your browser')
    process.exit(0)
  })
  .catch(error => {
    console.error(`✗ Error: ${error.message}`)
    if (error.code) {
      console.error(`✗ Error code: ${error.code}`)
    }
    pool.end().then(() => process.exit(1))
  })
