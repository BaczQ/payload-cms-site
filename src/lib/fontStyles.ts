import type { SiteSetting } from '@/payload-types'
import path from 'path'

const fontKeys = [
  'body',
  'h1',
  'postText',
  'buttonText',
  'allPostsLink',
  'cardCategory',
  'cardText',
  'footerMenu',
  'footerText',
  'headerMenu',
] as const
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
  lobster: 'var(--font-lobster), cursive',
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
  lobster: '"Lobster", cursive',
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
  lobster: 'cursive',
  'system-ui': 'system-ui, -apple-system, sans-serif',
  'sans-serif': 'sans-serif',
}

const frontendSelectors: Record<FontKey, string> = {
  body: '.site-fonts', // Базовый шрифт применяется ко всему контейнеру
  h1: '.site-fonts h1, .site-fonts .payload-richtext h1',
  postText:
    '.site-fonts .payload-richtext, .site-fonts .payload-richtext p, .site-fonts .payload-richtext li',
  buttonText:
    '.site-fonts a.inline-flex.items-center.justify-center, .site-fonts button.inline-flex.items-center.justify-center, .site-fonts a[class*="inline-flex"][class*="items-center"], .site-fonts button[class*="inline-flex"][class*="items-center"]',
  allPostsLink:
    '.site-fonts a.text-primary.underline[href*="/posts"], .site-fonts a[class*="text-primary"][class*="underline"][href*="/posts"]',
  cardCategory:
    '.site-fonts article[class*="border"] div[class*="uppercase"], .site-fonts article.border div.uppercase',
  cardText: '.site-fonts article[class*="border"] p, .site-fonts article.border p',
  footerMenu:
    '.site-fonts footer div[class*="flex"][class*="flex-col"], .site-fonts footer div.flex.flex-col',
  footerText:
    '.site-fonts footer div[class*="border-t"][class*="text-gray-500"], .site-fonts footer div.border-t.text-gray-500',
  headerMenu: '.site-fonts header nav a, .site-fonts header nav button',
}

const adminSelectors: Record<FontKey, string> = {
  body: '.payload-admin', // Базовый шрифт для админки
  h1: '.payload-admin .payload-rich-text h1',
  postText: '.payload-admin .payload-rich-text p, .payload-admin .payload-rich-text li',
  buttonText: '.payload-admin',
  allPostsLink: '.payload-admin',
  cardCategory: '.payload-admin',
  cardText: '.payload-admin',
  footerMenu: '.payload-admin',
  footerText: '.payload-admin',
  headerMenu: '.payload-admin',
}

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
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
      console.log('[generateFontCSS] fontConfig or fontFamily missing:', { fontConfig, hasFontFamily: !!fontConfig?.fontFamily })
    }
    return rules
  }

  const { family, fallback } = resolveFontFamily(
    fontConfig.fontFamily,
    options.fontFamilyMap,
    options.fallbackMap,
  )
  const importantSuffix = options.useImportant ? ' !important' : ''
  const fontFamilyValue = fallback ? `${family}, ${fallback}` : family

  rules.push(`${selector} { font-family: ${fontFamilyValue}${importantSuffix}; }`)

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
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
      console.log('[buildFontStyles] fonts is null or undefined')
    }
    return ''
  }

  const cssRules: string[] = []

  // Сначала применяем body как базовый стиль
  const bodyConfig = fonts.body
  if (bodyConfig) {
    const bodySelector = options.selectors.body
    const bodyRules = generateFontCSS(bodySelector, bodyConfig, {
      fontFamilyMap: options.fontFamilyMap,
      fallbackMap: options.fallbackMap,
      useImportant: options.useImportant,
    })
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
      console.log('[buildFontStyles] bodyConfig:', bodyConfig, 'generated rules:', bodyRules.length)
    }
    cssRules.push(...bodyRules)
  } else {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
      console.log('[buildFontStyles] bodyConfig is missing')
    }
  }

  // Затем применяем остальные элементы, которые переопределяют базовые значения
  for (const key of fontKeys) {
    if (key === 'body') continue // body уже обработан
    const fontConfig = fonts[key]
    if (!fontConfig) {
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
        console.log(`[buildFontStyles] fontConfig for ${key} is missing`)
      }
      continue
    }
    const selector = options.selectors[key]
    const rules = generateFontCSS(selector, fontConfig, {
      fontFamilyMap: options.fontFamilyMap,
      fallbackMap: options.fallbackMap,
      useImportant: options.useImportant,
    })
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FONTS) {
      console.log(`[buildFontStyles] ${key}:`, fontConfig, 'generated rules:', rules.length)
    }
    cssRules.push(...rules)
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
