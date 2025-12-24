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

    // Всегда записываем файл, даже если контент совпадает (на случай, если файл был повреждён)
    // Но логируем, если контент не изменился
    if (existingContent === content) {
      console.log(`Content unchanged for ${filePath}, but writing anyway to ensure file integrity`)
    }

    await fs.writeFile(filePath, content, 'utf8')
    console.log(`✓ Written ${content.length} bytes to ${filePath}`)
  } catch (error) {
    // Fail silently per-path to avoid breaking the request; log to aid debugging
    console.error(`Failed to write font styles to ${filePath}:`, error)
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`)
      console.error(`Stack: ${error.stack}`)
    }
    throw error
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
  console.log('Fonts type:', typeof fonts)
  console.log('Fonts is null?', fonts === null)
  console.log('Fonts is undefined?', fonts === undefined)
  console.log('Fonts keys:', fonts && typeof fonts === 'object' ? Object.keys(fonts) : 'N/A')
  
  const header = `/* This file is auto-generated. Updated at ${updatedAt ?? new Date().toISOString()} */`
  const styles = buildFrontendFontStyles(fonts)
  const content = `${header}\n${styles}\n`

  console.log('Generated styles length:', styles.length)
  console.log('Generated styles preview:', styles.substring(0, 500) || '(empty)')
  console.log('Full generated styles:', styles || '(empty)')
  console.log('Output paths:', outputPaths)
  console.log('Content to write length:', content.length)

  // Если стили пустые, но fonts не null/undefined, это проблема - логируем предупреждение
  if (styles.length === 0 && fonts && typeof fonts === 'object') {
    console.warn('⚠️ WARNING: Generated styles are empty but fonts data exists!')
    console.warn('This may indicate a problem with font data structure or normalization.')
  }

  // Записываем файлы по отдельности, чтобы ошибка в одном не блокировала другой
  const writeResults = await Promise.allSettled(
    outputPaths.map(async (filePath) => {
      try {
        await writeIfChanged(filePath, content)
        return { filePath, success: true }
      } catch (error) {
        console.error(`Failed to write ${filePath}:`, error)
        return { filePath, success: false, error }
      }
    })
  )

  let successCount = 0
  let failCount = 0
  
  for (const result of writeResults) {
    if (result.status === 'fulfilled' && result.value.success) {
      successCount++
    } else {
      failCount++
      const filePath = result.status === 'fulfilled' ? result.value.filePath : 'unknown'
      console.error(`✗ Failed to write: ${filePath}`)
    }
  }

  console.log(`=== Files written: ${successCount} success, ${failCount} failed ===`)
  
  // Проверяем, что файлы действительно записались
  for (const filePath of outputPaths) {
    try {
      const writtenContent = await fs.readFile(filePath, 'utf8')
      console.log(`✓ Verified: ${filePath} (${writtenContent.length} bytes)`)
    } catch (error) {
      console.error(`✗ Failed to verify: ${filePath}`, error)
    }
  }

  // Если хотя бы один файл не записался, это проблема, но не критическая
  if (failCount > 0) {
    console.warn(`⚠️ WARNING: ${failCount} file(s) failed to write. Check logs above.`)
  }
}

