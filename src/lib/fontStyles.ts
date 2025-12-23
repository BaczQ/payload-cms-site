import type { SiteSetting } from '@/payload-types'
import fs from 'fs/promises'
import path from 'path'

const fontKeys = ['h1', 'postText', 'menu', 'caption', 'h2h5', 'author', 'date'] as const
type FontKey = (typeof fontKeys)[number]
type FontConfig = NonNullable<SiteSetting['fonts']>[FontKey]

const frontendFontFamilyMap: Record<string, string> = {
  roboto: 'var(--font-roboto), system-ui, sans-serif',
  gloock: '"Gloock", serif',
  antonio: 'var(--font-antonio), system-ui, sans-serif',
  'manufacturing-consent': '"Manufacturing Consent", system-ui, sans-serif',
  'noto-sans-display': 'var(--font-noto-sans-display), system-ui, sans-serif',
  'roboto-flex': 'var(--font-roboto-flex), system-ui, sans-serif',
  'roboto-condensed': 'var(--font-roboto-condensed), system-ui, sans-serif',
  tinos: 'var(--font-tinos), Georgia, serif',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

const adminFontFamilyMap: Record<string, string> = {
  roboto: '"Roboto", sans-serif',
  gloock: '"Gloock", serif',
  antonio: '"Antonio", sans-serif',
  'manufacturing-consent': '"Manufacturing Consent", system-ui',
  'noto-sans-display': '"Noto Sans Display", sans-serif',
  'roboto-flex': '"Roboto Flex", sans-serif',
  'roboto-condensed': '"Roboto Condensed", sans-serif',
  tinos: '"Tinos", serif',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

const adminFallbackFonts: Record<string, string> = {
  roboto: 'var(--font-sans)',
  gloock: 'var(--font-serif)',
  antonio: 'var(--font-sans)',
  'manufacturing-consent': 'system-ui',
  'noto-sans-display': 'var(--font-sans)',
  'roboto-flex': 'var(--font-sans)',
  'roboto-condensed': 'var(--font-sans)',
  tinos: 'var(--font-serif)',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

const frontendSelectors: Record<FontKey, string> = {
  h1: '.site-fonts h1, .site-fonts .payload-richtext h1',
  postText:
    '.site-fonts .payload-richtext, .site-fonts .payload-richtext p, .site-fonts .payload-richtext li',
  menu:
    '.site-fonts header nav, .site-fonts header nav a, .site-fonts header nav button, .site-fonts nav, .site-fonts nav a, .site-fonts nav button, .site-fonts .nav, .site-fonts .nav a, .site-fonts .nav button, .site-fonts [class*="nav"] button',
  caption: '.site-fonts figcaption, .site-fonts .payload-richtext figcaption',
  h2h5:
    '.site-fonts h2, .site-fonts h3, .site-fonts h4, .site-fonts h5, .site-fonts .payload-richtext h2, .site-fonts .payload-richtext h3, .site-fonts .payload-richtext h4, .site-fonts .payload-richtext h5',
  author: '.site-fonts .author, .site-fonts .payload-richtext .author',
  date: '.site-fonts time, .site-fonts .date, .site-fonts .payload-richtext .date',
}

const adminSelectors: Record<FontKey, string> = {
  h1: '.payload-admin .payload-rich-text h1',
  postText: '.payload-admin .payload-rich-text p, .payload-admin .payload-rich-text li',
  menu:
    '.payload-admin .nav, .payload-admin .nav *, .payload-admin .nav button, .payload-admin .nav a, .payload-admin .nav .nav__item, .payload-admin [class*="nav"] button, .payload-admin [class*="nav"] a',
  caption: '.payload-admin .payload-rich-text figcaption',
  h2h5:
    '.payload-admin .payload-rich-text h2, .payload-admin .payload-rich-text h3, .payload-admin .payload-rich-text h4, .payload-admin .payload-rich-text h5',
  author: '.payload-admin .payload-rich-text .author',
  date: '.payload-admin .payload-rich-text .date',
}

const fontStylesFilePath = path.join(process.cwd(), 'public', 'site-fonts.css')

function normalizeFontValue(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null
  return value.toLowerCase().trim()
}

function resolveFontFamily(
  fontValue: string | null | undefined,
  fontFamilyMap: Record<string, string>,
  fallbackMap?: Record<string, string>,
) {
  const normalized = normalizeFontValue(fontValue)
  const key = normalized && fontFamilyMap[normalized] ? normalized : 'roboto'
  return {
    family: fontFamilyMap[key],
    fallback: fallbackMap?.[key],
  }
}

function generateFontCSS(
  selector: string,
  fontConfig: FontConfig,
  options: {
    fontFamilyMap: Record<string, string>
    fallbackMap?: Record<string, string>
    useImportant: boolean
  },
): string[] {
  const rules: string[] = []

  if (!fontConfig || !fontConfig.fontFamily) {
    return rules
  }

  const { family, fallback } = resolveFontFamily(
    fontConfig.fontFamily,
    options.fontFamilyMap,
    options.fallbackMap,
  )
  const importantSuffix = options.useImportant ? ' !important' : ''
  const fontFamilyValue = fallback ? `${family}, ${fallback}` : family

  const mobileStyles: string[] = []
  mobileStyles.push(`font-family: ${fontFamilyValue}${importantSuffix};`)

  if (fontConfig.mobile?.fontSize) {
    mobileStyles.push(`font-size: ${fontConfig.mobile.fontSize}${importantSuffix};`)
  }
  if (fontConfig.mobile?.lineHeight) {
    mobileStyles.push(`line-height: ${fontConfig.mobile.lineHeight}${importantSuffix};`)
  }
  if (fontConfig.mobile?.fontWeight) {
    mobileStyles.push(`font-weight: ${fontConfig.mobile.fontWeight}${importantSuffix};`)
  }
  if (fontConfig.mobile?.fontStyle) {
    mobileStyles.push(`font-style: ${fontConfig.mobile.fontStyle}${importantSuffix};`)
  }

  if (mobileStyles.length > 0) {
    rules.push(`${selector} { ${mobileStyles.join(' ')} }`)
  }

  if (fontConfig.desktop) {
    const desktopStyles: string[] = []

    if (fontConfig.desktop.fontSize) {
      desktopStyles.push(`font-size: ${fontConfig.desktop.fontSize}${importantSuffix};`)
    }
    if (fontConfig.desktop.lineHeight) {
      desktopStyles.push(`line-height: ${fontConfig.desktop.lineHeight}${importantSuffix};`)
    }
    if (fontConfig.desktop.fontWeight) {
      desktopStyles.push(`font-weight: ${fontConfig.desktop.fontWeight}${importantSuffix};`)
    }
    if (fontConfig.desktop.fontStyle) {
      desktopStyles.push(`font-style: ${fontConfig.desktop.fontStyle}${importantSuffix};`)
    }

    if (desktopStyles.length > 0) {
      rules.push(`@media (min-width: 768px) { ${selector} { ${desktopStyles.join(' ')} } }`)
    }
  }

  return rules
}

function buildFontStyles(
  fonts: SiteSetting['fonts'] | null | undefined,
  options: {
    selectors: Record<FontKey, string>
    fontFamilyMap: Record<string, string>
    fallbackMap?: Record<string, string>
    useImportant: boolean
  },
): string {
  if (!fonts) {
    return ''
  }

  const cssRules: string[] = []

  for (const key of fontKeys) {
    const fontConfig = fonts[key]
    if (!fontConfig) continue
    const selector = options.selectors[key]
    cssRules.push(
      ...generateFontCSS(selector, fontConfig, {
        fontFamilyMap: options.fontFamilyMap,
        fallbackMap: options.fallbackMap,
        useImportant: options.useImportant,
      }),
    )
  }

  return cssRules.join('\n')
}

export function buildFrontendFontStyles(fonts: SiteSetting['fonts'] | null | undefined): string {
  return buildFontStyles(fonts, {
    selectors: frontendSelectors,
    fontFamilyMap: frontendFontFamilyMap,
    useImportant: true,
  })
}

export function buildAdminFontStyles(fonts: SiteSetting['fonts'] | null | undefined): string {
  return buildFontStyles(fonts, {
    selectors: adminSelectors,
    fontFamilyMap: adminFontFamilyMap,
    fallbackMap: adminFallbackFonts,
    useImportant: false,
  })
}

export async function writeFrontendFontStylesFile({
  fonts,
  updatedAt,
}: {
  fonts: SiteSetting['fonts'] | null | undefined
  updatedAt?: string | null
}): Promise<void> {
  const header = `/* This file is auto-generated. Updated at ${updatedAt ?? 'unknown'} */`
  const styles = buildFrontendFontStyles(fonts)
  const content = `${header}\n${styles}\n`

  await fs.mkdir(path.dirname(fontStylesFilePath), { recursive: true })

  let existingContent: string | null = null
  try {
    existingContent = await fs.readFile(fontStylesFilePath, 'utf8')
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code !== 'ENOENT') {
      throw error
    }
  }

  if (existingContent === content) {
    return
  }

  await fs.writeFile(fontStylesFilePath, content, 'utf8')
}
