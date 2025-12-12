import { DM_Serif_Display, Tinos, Playfair_Display } from 'next/font/google'

export const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-serif-display',
  display: 'swap',
})

export const tinos = Tinos({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-tinos',
  display: 'swap',
})

export const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair-display',
  display: 'swap',
})

export const headingFonts = {
  'dm-serif-display': {
    font: dmSerifDisplay,
    name: 'DM Serif Display',
  },
  tinos: {
    font: tinos,
    name: 'Tinos',
  },
  'playfair-display': {
    font: playfairDisplay,
    name: 'Playfair Display',
  },
} as const

export type HeadingFontKey = keyof typeof headingFonts
