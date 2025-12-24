import type { Endpoint, Field, GlobalConfig } from 'payload'
import { APIError } from 'payload'
import { revalidateTag } from 'next/cache'
import { writeFrontendFontStylesFile } from '@/lib/fontStyles.server'

const fontOptions = [
  {
    label: 'Roboto',
    value: 'roboto',
  },
  {
    label: 'Gloock',
    value: 'gloock',
  },
  {
    label: 'Antonio',
    value: 'antonio',
  },
  {
    label: 'Manufacturing Consent',
    value: 'manufacturing-consent',
  },
  {
    label: 'Noto Sans Display',
    value: 'noto-sans-display',
  },
  {
    label: 'Roboto Flex',
    value: 'roboto-flex',
  },
  {
    label: 'Roboto Condensed',
    value: 'roboto-condensed',
  },
  {
    label: 'Tinos',
    value: 'tinos',
  },
  {
    label: 'Lobster',
    value: 'lobster',
  },
  {
    label: 'System UI',
    value: 'system-ui',
  },
  {
    label: 'Sans Serif',
    value: 'sans-serif',
  },
]

// Helper function to create font family field for a font element
function createFontElementFields(
  name: string,
  label: string,
  description: string,
): Field[] {
  return [
    {
      name: 'fontFamily',
      type: 'select',
      label: 'Шрифт',
      defaultValue: 'roboto',
      options: fontOptions,
      admin: {
        description,
      },
    },
  ]
}

// Helper function to migrate font data - extract only fontFamily
function migrateFontData(fonts: any): any {
  if (!fonts || typeof fonts !== 'object') {
    return fonts
  }

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
  const migratedFonts = { ...fonts }

  // Remove selectedElement if it exists
  if ('selectedElement' in migratedFonts) {
    delete migratedFonts.selectedElement
  }

  for (const key of fontKeys) {
    const fontValue = migratedFonts[key]

    // If it's a string (old format), convert to new format
    if (typeof fontValue === 'string') {
      migratedFonts[key] = {
        fontFamily: fontValue,
      }
    }
    // If it's an object, extract only fontFamily
    else if (fontValue && typeof fontValue === 'object') {
      if (fontValue.fontFamily) {
        migratedFonts[key] = {
          fontFamily: fontValue.fontFamily,
        }
      } else {
        // If no fontFamily, remove this key
        delete migratedFonts[key]
      }
    }
  }

  // Remove old font keys that are no longer used
  const oldKeys = ['menu', 'caption', 'h2h5', 'author', 'date']
  for (const oldKey of oldKeys) {
    if (oldKey in migratedFonts) {
      delete migratedFonts[oldKey]
    }
  }

  return migratedFonts
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  endpoints: [
    {
      path: '/regenerate-font-styles',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        try {
          const siteSettings = await req.payload.findGlobal({
            slug: 'site-settings',
            req,
          })

          await writeFrontendFontStylesFile({
            fonts: siteSettings?.fonts,
            updatedAt: siteSettings?.updatedAt,
          })

          return Response.json({
            message: 'Font styles regenerated successfully',
            success: true,
          })
        } catch (error) {
          req.payload.logger.error(`Font regeneration error: ${error instanceof Error ? error.message : String(error)}`)
          throw new APIError('Regeneration failed', 500)
        }
      },
    } as Endpoint,
    {
      path: '/migrate-fonts',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        try {
          // Get current global data using raw database query to bypass validation
          const result = await req.payload.db.findGlobal({
            slug: 'site-settings',
            req,
          })

          if (!result || !result.fonts) {
            return Response.json({ message: 'No fonts data to migrate', success: true })
          }

          const migratedFonts = migrateFontData(result.fonts)

          // Check if migration is needed
          const needsUpdate = JSON.stringify(result.fonts) !== JSON.stringify(migratedFonts)

          if (needsUpdate) {
            await req.payload.updateGlobal({
              slug: 'site-settings',
              data: {
                fonts: migratedFonts,
              },
              req,
            })

            return Response.json({
              message: 'Fonts migrated successfully',
              success: true,
              migrated: true,
            })
          }

          return Response.json({
            message: 'No migration needed',
            success: true,
            migrated: false,
          })
        } catch (error) {
          req.payload.logger.error(`Font migration error: ${error instanceof Error ? error.message : String(error)}`)
          throw new APIError('Migration failed', 500)
        }
      },
    } as Endpoint,
    {
      path: '/delete-old-record',
      method: 'post',
      handler: async (req) => {
        // Simple secret check (you can change this)
        const secret = req.headers.get('x-secret-key')
        if (secret !== process.env.MIGRATION_SECRET && secret !== 'temp-secret-123') {
          throw new APIError('Unauthorized', 401)
        }

        try {
          const db = req.payload.db as any
          if (db.pool) {
            const client = await db.pool.connect()
            try {
              const result = await client.query('DELETE FROM site_settings WHERE "globalType" = $1', ['site-settings'])
              return Response.json({
                message: `Successfully deleted ${result.rowCount} record(s)`,
                success: true,
                deleted: result.rowCount,
              })
            } finally {
              client.release()
            }
          }
          throw new APIError('Database pool not available', 500)
        } catch (error) {
          req.payload.logger.error(`Delete error: ${error instanceof Error ? error.message : String(error)}`)
          throw new APIError('Delete failed', 500)
        }
      },
    } as Endpoint,
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Migrate old font structure (strings) to new structure (objects) when reading
        if (doc?.fonts && typeof doc.fonts === 'object') {
          const migratedFonts = migrateFontData(doc.fonts)
          const needsUpdate = JSON.stringify(doc.fonts) !== JSON.stringify(migratedFonts)

          if (needsUpdate) {
            doc.fonts = migratedFonts
            // Auto-save migrated data in background
            if (req.user) {
              req.payload
                .updateGlobal({
                  slug: 'site-settings',
                  data: doc,
                  req,
                })
                .catch((err) => {
                  req.payload.logger.error('Failed to auto-migrate font settings:', err)
                })
            }
          }
        }

        return doc
      },
      async ({ doc }) => {
        await writeFrontendFontStylesFile({
          fonts: doc?.fonts,
          updatedAt: doc?.updatedAt,
        })
        return doc
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Используем console.log для гарантированного вывода в PM2 логи
        console.log('=== SiteSettings afterChange HOOK CALLED ===')
        console.log('Doc fonts:', JSON.stringify(doc?.fonts, null, 2))
        console.log('Doc updatedAt:', doc?.updatedAt)
        console.log('Doc fonts type:', typeof doc?.fonts)
        console.log('Doc fonts is null?', doc?.fonts === null)
        console.log('Doc fonts is undefined?', doc?.fonts === undefined)
        
        // Также записываем в файл для диагностики
        try {
          const fs = await import('fs/promises')
          const debugLog = `[${new Date().toISOString()}] afterChange called\nFonts: ${JSON.stringify(doc?.fonts, null, 2)}\nUpdatedAt: ${doc?.updatedAt}\n\n`
          await fs.appendFile('/tmp/bf-news-fonts-debug.log', debugLog).catch(() => {})
        } catch {}
        
        try {
          // Используем doc напрямую, так как он уже содержит актуальные данные после сохранения
          // Но также получаем latestSettings для проверки
          const latestSettings = await req.payload.findGlobal({
            slug: 'site-settings',
            depth: 0,
            overrideAccess: false,
            req,
          })

          console.log('Latest settings fonts:', JSON.stringify(latestSettings?.fonts, null, 2))
          
          // Используем fonts из doc, так как это самые свежие данные
          const fontsToUse = doc?.fonts ?? latestSettings?.fonts
          const updatedAtToUse = doc?.updatedAt ?? latestSettings?.updatedAt

          console.log('Using fonts:', JSON.stringify(fontsToUse, null, 2))
          console.log('Using updatedAt:', updatedAtToUse)

          if (!fontsToUse || (typeof fontsToUse === 'object' && Object.keys(fontsToUse).length === 0)) {
            console.warn('⚠️ WARNING: fontsToUse is empty or null! This may cause empty CSS file.')
          }

          await writeFrontendFontStylesFile({
            fonts: fontsToUse,
            updatedAt: updatedAtToUse,
          })
          console.log('=== File written successfully ===')
        } catch (error) {
          console.error('=== Error writing file ===', error)
          if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
          }
          // Не пробрасываем ошибку дальше, чтобы не сломать сохранение настроек
        }
        revalidateTag('global_site-settings')
        return doc
      },
    ],
    beforeValidate: [
      async ({ data, req }) => {
        console.log('=== SiteSettings beforeValidate HOOK CALLED ===')
        console.log('Data fonts:', JSON.stringify(data?.fonts, null, 2))
        console.log('Data fonts type:', typeof data?.fonts)
        console.log('Data fonts is null?', data?.fonts === null)
        console.log('Data fonts is undefined?', data?.fonts === undefined)
        
        // Migrate old font structure (strings) to new structure (objects)
        if (data?.fonts && typeof data.fonts === 'object') {
          const migratedFonts = migrateFontData(data.fonts)
          console.log('Migrated fonts:', JSON.stringify(migratedFonts, null, 2))
          data.fonts = migratedFonts
        } else if (data?.fonts === null || data?.fonts === undefined) {
          console.warn('⚠️ WARNING: data.fonts is null or undefined in beforeValidate!')
          // Не устанавливаем fonts в null, оставляем как есть - возможно, это частичное обновление
        }

        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Шрифты',
          fields: [
            {
              name: 'fonts',
              type: 'group',
              label: 'Настройки шрифтов',
              fields: [
                // Body настройки (базовый шрифт) - показываем первым
                {
                  name: 'body',
                  type: 'group',
                  label: 'ALL (base)',
                  admin: {
                    description: 'Базовый шрифт применяется ко всем элементам по умолчанию',
                  },
                  fields: createFontElementFields(
                    'body',
                    'ALL (base)',
                    'Шрифт по умолчанию для всех элементов сайта',
                  ),
                },
                // HeaderMenu настройки
                {
                  name: 'headerMenu',
                  type: 'group',
                  label: 'HEADER > MENU',
                  admin: {
                    description: 'Применяется к элементам a и button внутри элемента класса nav_font',
                  },
                  fields: createFontElementFields(
                    'headerMenu',
                    'HEADER > MENU',
                    'Шрифт для элементов меню в хедере',
                  ),
                },
                // H1 настройки
                {
                  name: 'h1',
                  type: 'group',
                  label: 'POST (h1)',
                  admin: {
                    description: 'Шрифт для заголовков H1 в редакторе',
                  },
                  fields: createFontElementFields(
                    'h1',
                    'POST (h1)',
                    'Шрифт для заголовков H1 в редакторе',
                  ),
                },
                // PostText настройки
                {
                  name: 'postText',
                  type: 'group',
                  label: 'POST (p, subtitle)',
                  admin: {
                    description: 'Шрифт для текста поста (p, li)',
                  },
                  fields: createFontElementFields(
                    'postText',
                    'POST (p, subtitle)',
                    'Шрифт для текста поста (p, li)',
                  ),
                },
                // AllPostsLink настройки
                {
                  name: 'allPostsLink',
                  type: 'group',
                  label: 'HOME ("all news")',
                  admin: {
                    description: 'Шрифт для ссылки "Все новости"',
                  },
                  fields: createFontElementFields(
                    'allPostsLink',
                    'HOME ("all news")',
                    'Шрифт для ссылки "Все новости"',
                  ),
                },
                // CardCategory настройки
                {
                  name: 'cardCategory',
                  type: 'group',
                  label: 'HOME > CARD (category)',
                  admin: {
                    description: 'Шрифт для рубрик в карточках',
                  },
                  fields: createFontElementFields(
                    'cardCategory',
                    'HOME > CARD (category)',
                    'Шрифт для рубрик в карточках',
                  ),
                },
                // CardText настройки
                {
                  name: 'cardText',
                  type: 'group',
                  label: 'HOME > CARD (subtitle)',
                  admin: {
                    description: 'Шрифт для текста в карточках',
                  },
                  fields: createFontElementFields(
                    'cardText',
                    'HOME > CARD (subtitle)',
                    'Шрифт для текста в карточках',
                  ),
                },
                // FooterMenu настройки
                {
                  name: 'footerMenu',
                  type: 'group',
                  label: 'FOOTER > MENU',
                  admin: {
                    description: 'Шрифт для меню в футере',
                  },
                  fields: createFontElementFields(
                    'footerMenu',
                    'FOOTER > MENU',
                    'Шрифт для меню в футере',
                  ),
                },
                // FooterText настройки
                {
                  name: 'footerText',
                  type: 'group',
                  label: 'FOOTER > TEXT',
                  admin: {
                    description: 'Шрифт для текста в футере',
                  },
                  fields: createFontElementFields(
                    'footerText',
                    'FOOTER > TEXT',
                    'Шрифт для текста в футере',
                  ),
                },
                // ButtonText настройки
                {
                  name: 'buttonText',
                  type: 'group',
                  label: 'ALL (buttons)',
                  admin: {
                    description: 'Шрифт для текста кнопок',
                  },
                  fields: createFontElementFields(
                    'buttonText',
                    'ALL (buttons)',
                    'Шрифт для текста кнопок',
                  ),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
