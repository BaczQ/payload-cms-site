import { getPayload } from 'payload'
import config from '@payload-config'
import { buildFrontendFontStyles } from '@/lib/fontStyles'
import { writeFrontendFontStylesFile } from '@/lib/fontStyles.server'

async function testFontGeneration() {
  try {
    console.log('Starting font generation test...')
    const payload = await getPayload({ config })

    // Получаем текущие настройки
    console.log('Fetching site settings...')
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    if (!siteSettings) {
      console.error('Site settings not found!')
      process.exit(1)
    }

    console.log('\n=== Site Settings (first 500 chars) ===')
    const settingsStr = JSON.stringify(siteSettings, null, 2)
    console.log(settingsStr.substring(0, 500))

    console.log('\n=== Fonts Data ===')
    const fontsStr = JSON.stringify(siteSettings?.fonts, null, 2)
    console.log(fontsStr || '(null or undefined)')

    if (!siteSettings?.fonts) {
      console.error('\nERROR: fonts is null or undefined!')
      process.exit(1)
    }

    // Проверяем структуру
    console.log('\n=== Font Structure Check ===')
    const fontKeys = ['body', 'h1', 'postText', 'buttonText', 'allPostsLink', 'cardCategory', 'cardText', 'footerMenu', 'footerText', 'headerMenu']
    for (const key of fontKeys) {
      const fontConfig = siteSettings.fonts[key as keyof typeof siteSettings.fonts]
      if (fontConfig) {
        console.log(`${key}:`, {
          hasFontFamily: !!fontConfig.fontFamily,
          fontFamily: fontConfig.fontFamily,
          fullConfig: fontConfig,
        })
      } else {
        console.log(`${key}: (not set)`)
      }
    }

    // Генерируем CSS
    console.log('\n=== Generating CSS ===')
    const css = buildFrontendFontStyles(siteSettings?.fonts)
    console.log('CSS length:', css.length)
    console.log('CSS content:')
    console.log(css || '(empty)')

    // Записываем файл
    console.log('\n=== Writing file ===')
    await writeFrontendFontStylesFile({
      fonts: siteSettings?.fonts,
      updatedAt: siteSettings?.updatedAt,
    })
    console.log('File written successfully')

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    process.exit(1)
  }
}

testFontGeneration()

