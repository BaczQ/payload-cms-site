import {
  Roboto,
  Roboto_Condensed,
  Roboto_Flex,
  Tinos,
  Antonio,
  Noto_Sans_Display,
  Lobster,
} from 'next/font/google'

// Основные шрифты для fallback
export const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
  preload: true,
})

export const robotoCondensed = Roboto_Condensed({
  weight: ['100', '300', '400', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto-condensed',
  display: 'swap',
  preload: false,
})

export const robotoFlex = Roboto_Flex({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
  preload: false,
})

export const tinos = Tinos({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-tinos',
  display: 'swap',
  preload: false,
})

export const antonio = Antonio({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-antonio',
  display: 'swap',
  preload: false,
})

export const notoSansDisplay = Noto_Sans_Display({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-noto-sans-display',
  display: 'swap',
  preload: false,
})

export const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-lobster',
  display: 'swap',
  preload: false,
})

// Gloock и Manufacturing Consent не доступны в next/font/google
// Они загружаются через теги в frontend head

// CSS переменные для fallback шрифтов
export const fontVariables = [
  roboto.variable,
  robotoCondensed.variable,
  robotoFlex.variable,
  tinos.variable,
  antonio.variable,
  notoSansDisplay.variable,
  lobster.variable,
].join(' ')
