import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { writeFrontendFontStylesFile } from '@/lib/fontStyles.server'

async function regenerateFontStyles() {
  let payload
  try {
    console.log('Starting font styles regeneration...')
    console.log('Initializing Payload...')
    try {
      payload = await getPayload({ config: configPromise })
      console.log('Payload initialized successfully')
    } catch (initError) {
      console.error('ERROR initializing Payload:', initError)
      if (initError instanceof Error) {
        console.error('Error message:', initError.message)
        console.error('Error stack:', initError.stack)
      }
      process.exit(1)
    }

    // Получаем текущие настройки
    console.log('Fetching site settings...')
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    if (!siteSettings) {
      console.error('ERROR: Site settings not found!')
      process.exit(1)
    }

    console.log('\n=== Site Settings ===')
    console.log('UpdatedAt:', siteSettings.updatedAt)
    console.log('Fonts:', JSON.stringify(siteSettings.fonts, null, 2))

    if (!siteSettings.fonts) {
      console.error('ERROR: fonts is null or undefined!')
      console.log('This means no font settings are configured in the database.')
      process.exit(1)
    }

    // Проверяем структуру
    console.log('\n=== Font Structure Check ===')
    const fontKeys = ['body', 'h1', 'postText', 'buttonText', 'allPostsLink', 'cardCategory', 'cardText', 'footerMenu', 'footerText', 'headerMenu']
    let hasAnyFont = false
    for (const key of fontKeys) {
      const fontConfig = siteSettings.fonts[key as keyof typeof siteSettings.fonts]
      if (fontConfig && fontConfig.fontFamily) {
        hasAnyFont = true
        console.log(`✓ ${key}: ${fontConfig.fontFamily}`)
      } else {
        console.log(`✗ ${key}: not set`)
      }
    }

    if (!hasAnyFont) {
      console.error('\nERROR: No font settings found! All font elements are empty.')
      console.log('Please configure fonts in admin panel: Global → Site Settings → Шрифты')
      process.exit(1)
    }

    // Генерируем и записываем файл
    console.log('\n=== Writing font styles file ===')
    await writeFrontendFontStylesFile({
      fonts: siteSettings.fonts,
      updatedAt: siteSettings.updatedAt,
    })

    console.log('\n✓ Font styles file generated successfully!')
    console.log('Check: public/site-fonts.css')
    
    process.exit(0)
  } catch (error) {
    console.error('ERROR:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    process.exit(1)
  }
}

regenerateFontStyles()

