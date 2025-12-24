import fs from 'fs/promises'
import path from 'path'
import { buildFrontendFontStyles } from './fontStyles'

const outputPaths = [
  // Runtime public directory (used when running `next dev` or in repo root)
  path.join(process.cwd(), 'public', 'site-fonts.css'),
  // Standalone bundle public directory (used by PM2 / production start)
  path.join(process.cwd(), '.next', 'standalone', 'public', 'site-fonts.css'),
]

async function writeIfChanged(filePath: string, content: string) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    let existingContent: string | null = null
    try {
      existingContent = await fs.readFile(filePath, 'utf8')
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException
      if (nodeError.code !== 'ENOENT') {
        throw error
      }
    }

    if (existingContent === content) {
      return
    }

    await fs.writeFile(filePath, content, 'utf8')
  } catch (error) {
    // Fail silently per-path to avoid breaking the request; log to aid debugging
    console.error(`Failed to write font styles to ${filePath}:`, error)
  }
}

export async function writeFrontendFontStylesFile({
  fonts,
  updatedAt,
}: {
  fonts: Parameters<typeof buildFrontendFontStyles>[0]
  updatedAt?: string | null
}): Promise<void> {
  // Всегда логируем для диагностики - используем console.log для гарантированного вывода
  console.log('=== writeFrontendFontStylesFile CALLED ===')
  console.log('Fonts data:', JSON.stringify(fonts, null, 2))
  console.log('UpdatedAt:', updatedAt)
  
  const header = `/* This file is auto-generated. Updated at ${updatedAt ?? 'unknown'} */`
  const styles = buildFrontendFontStyles(fonts)
  const content = `${header}\n${styles}\n`

  console.log('Generated styles length:', styles.length)
  console.log('Generated styles preview:', styles.substring(0, 200) || '(empty)')
  console.log('Output paths:', outputPaths)

  try {
    await Promise.all(outputPaths.map((filePath) => writeIfChanged(filePath, content)))
    console.log('=== Files written successfully ===')
  } catch (error) {
    console.error('=== Error writing files ===', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

