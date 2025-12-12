import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fontsDir = path.join(__dirname, '..', 'public', 'fonts')

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true })
}

// Font configurations
const fonts = [
  {
    name: 'DM Serif Display',
    family: 'DM+Serif+Display',
    weights: [400, 700],
  },
  {
    name: 'Tinos',
    family: 'Tinos',
    weights: [400, 700],
  },
  {
    name: 'Playfair Display',
    family: 'Playfair+Display',
    weights: [400, 700],
  },
]

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirect
          return downloadFile(response.headers.location, filepath).then(resolve).catch(reject)
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {})
        reject(err)
      })
  })
}

async function downloadFont(font) {
  console.log(`Downloading ${font.name}...`)

  for (const weight of font.weights) {
    const fontName = font.name.replace(/\s+/g, '')
    const filename = `${fontName}-${weight === 400 ? 'Regular' : 'Bold'}.woff2`
    const filepath = path.join(fontsDir, filename)

    // Google Fonts API URL
    const url = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${weight}&display=swap`

    try {
      // First, get the CSS to find the actual font file URL
      const cssResponse = await fetch(url)
      const css = await cssResponse.text()

      // Extract WOFF2 URL from CSS
      const woff2Match = css.match(/url\(([^)]+\.woff2[^)]*)\)/)
      if (woff2Match && woff2Match[1]) {
        let fontUrl = woff2Match[1].replace(/['"]/g, '')

        // Handle relative URLs
        if (fontUrl.startsWith('//')) {
          fontUrl = 'https:' + fontUrl
        } else if (fontUrl.startsWith('/')) {
          fontUrl = 'https://fonts.gstatic.com' + fontUrl
        }

        console.log(`  Downloading ${filename}...`)
        await downloadFile(fontUrl, filepath)
        console.log(`  ✓ Downloaded ${filename}`)
      } else {
        console.log(`  ✗ Could not find WOFF2 URL for ${font.name} ${weight}`)
      }
    } catch (error) {
      console.error(`  ✗ Error downloading ${font.name} ${weight}:`, error.message)
    }
  }
}

async function main() {
  console.log('Starting font download...\n')

  for (const font of fonts) {
    await downloadFont(font)
    console.log('')
  }

  console.log('Font download complete!')
}

main().catch(console.error)
