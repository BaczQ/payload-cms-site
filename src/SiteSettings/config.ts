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

const fontWeightOptions = [
  { label: '100 - Thin', value: '100' },
  { label: '200 - Extra Light', value: '200' },
  { label: '300 - Light', value: '300' },
  { label: '400 - Normal', value: '400' },
  { label: '500 - Medium', value: '500' },
  { label: '600 - Semi Bold', value: '600' },
  { label: '700 - Bold', value: '700' },
  { label: '800 - Extra Bold', value: '800' },
  { label: '900 - Black', value: '900' },
]

const fontStyleOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic', value: 'italic' },
  { label: 'Oblique', value: 'oblique' },
]

// Helper function to create responsive typography fields for a font element
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
    {
      type: 'row',
      fields: [
        {
          name: 'mobile',
          type: 'group',
          label: 'Мобильная версия (до 768px)',
          admin: {
            width: '50%',
          },
          fields: [
            {
              name: 'fontSize',
              type: 'text',
              label: 'Размер шрифта',
              defaultValue: '16px',
              admin: {
                description: 'Например: 16px, 1rem, 1.2em',
              },
            },
            {
              name: 'lineHeight',
              type: 'text',
              label: 'Высота строки',
              defaultValue: '1.5',
              admin: {
                description: 'Например: 1.5, 24px, 1.5em',
              },
            },
            {
              name: 'fontWeight',
              type: 'select',
              label: 'Насыщенность',
              defaultValue: '400',
              options: fontWeightOptions,
            },
            {
              name: 'fontStyle',
              type: 'select',
              label: 'Начертание',
              defaultValue: 'normal',
              options: fontStyleOptions,
            },
          ],
        },
        {
          name: 'desktop',
          type: 'group',
          label: 'Десктоп версия (768px+)',
          admin: {
            width: '50%',
          },
          fields: [
            {
              name: 'fontSize',
              type: 'text',
              label: 'Размер шрифта',
              defaultValue: '16px',
              admin: {
                description: 'Например: 16px, 1rem, 1.2em',
              },
            },
            {
              name: 'lineHeight',
              type: 'text',
              label: 'Высота строки',
              defaultValue: '1.5',
              admin: {
                description: 'Например: 1.5, 24px, 1.5em',
              },
            },
            {
              name: 'fontWeight',
              type: 'select',
              label: 'Насыщенность',
              defaultValue: '400',
              options: fontWeightOptions,
            },
            {
              name: 'fontStyle',
              type: 'select',
              label: 'Начертание',
              defaultValue: 'normal',
              options: fontStyleOptions,
            },
          ],
        },
      ],
    },
  ]
}

// Helper function to migrate font data
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

  for (const key of fontKeys) {
    const fontValue = migratedFonts[key]

    // If it's a string (old format), convert to new format
    if (typeof fontValue === 'string') {
      migratedFonts[key] = {
        fontFamily: fontValue,
        mobile: {
          fontSize: key === 'body' ? '16px' : key === 'h1' ? '24px' : key === 'postText' ? '16px' : '16px',
          lineHeight: '1.5',
          fontWeight: key === 'h1' ? '700' : '400',
          fontStyle: 'normal',
        },
        desktop: {
          fontSize: key === 'body' ? '16px' : key === 'h1' ? '32px' : key === 'postText' ? '18px' : '16px',
          lineHeight: '1.5',
          fontWeight: key === 'h1' ? '700' : '400',
          fontStyle: 'normal',
        },
      }
    }
    // If it's an object but missing required fields, ensure defaults
    else if (fontValue && typeof fontValue === 'object') {
      if (!fontValue.fontFamily) {
        continue
      }
      if (!fontValue.mobile) {
        fontValue.mobile = {
          fontSize: key === 'body' ? '16px' : key === 'h1' ? '24px' : key === 'postText' ? '16px' : '16px',
          lineHeight: '1.5',
          fontWeight: key === 'h1' ? '700' : '400',
          fontStyle: 'normal',
        }
      }
      if (!fontValue.desktop) {
        fontValue.desktop = {
          fontSize: key === 'body' ? '16px' : key === 'h1' ? '32px' : key === 'postText' ? '18px' : '16px',
          lineHeight: '1.5',
          fontWeight: key === 'h1' ? '700' : '400',
          fontStyle: 'normal',
        }
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
      async ({ doc }) => {
        await writeFrontendFontStylesFile({
          fonts: doc?.fonts,
          updatedAt: doc?.updatedAt,
        })
        revalidateTag('global_site-settings')
      },
    ],
    beforeValidate: [
      async ({ data }) => {
        // Migrate old font structure (strings) to new structure (objects)
        if (data?.fonts && typeof data.fonts === 'object') {
          data.fonts = migrateFontData(data.fonts)
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
                {
                  name: 'selectedElement',
                  type: 'select',
                  label: 'Выберите элемент для настройки',
                  defaultValue: 'body',
                  options: [
                    { label: 'Базовый шрифт (Body)', value: 'body' },
                    { label: 'Заголовок поста H1', value: 'h1' },
                    { label: 'Текст поста', value: 'postText' },
                    { label: 'Текст кнопок', value: 'buttonText' },
                    { label: 'Ссылка "Все новости"', value: 'allPostsLink' },
                    { label: 'Рубрики в карточках', value: 'cardCategory' },
                    { label: 'Текст карточек', value: 'cardText' },
                    { label: 'Меню в футере', value: 'footerMenu' },
                    { label: 'Текст в футере', value: 'footerText' },
                    { label: 'Header menu', value: 'headerMenu' },
                  ],
                  admin: {
                    description: 'Выберите элемент, настройки которого вы хотите изменить. Базовый шрифт применяется ко всем элементам по умолчанию.',
                  },
                },
                // Body настройки (базовый шрифт)
                {
                  name: 'body',
                  type: 'group',
                  label: 'Настройки базового шрифта (Body)',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'body'
                    },
                    description: 'Базовый шрифт применяется ко всем элементам по умолчанию. Элементы с индивидуальными настройками будут переопределять эти значения.',
                  },
                  fields: createFontElementFields(
                    'body',
                    'Базовый шрифт',
                    'Шрифт по умолчанию для всех элементов сайта',
                  ),
                },
                // H1 настройки
                {
                  name: 'h1',
                  type: 'group',
                  label: 'Настройки заголовка H1',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'h1'
                    },
                  },
                  fields: createFontElementFields(
                    'h1',
                    'Заголовок поста H1',
                    'Шрифт для заголовков H1 в редакторе',
                  ),
                },
                // PostText настройки
                {
                  name: 'postText',
                  type: 'group',
                  label: 'Настройки текста поста',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'postText'
                    },
                  },
                  fields: createFontElementFields(
                    'postText',
                    'Текст поста',
                    'Шрифт для текста поста (p, li)',
                  ),
                },
                // ButtonText настройки
                {
                  name: 'buttonText',
                  type: 'group',
                  label: 'Настройки текста кнопок',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'buttonText'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'buttonText',
                    'Текст кнопок',
                    'Шрифт для текста кнопок (использует настройки Body)',
                  ),
                },
                // AllPostsLink настройки
                {
                  name: 'allPostsLink',
                  type: 'group',
                  label: 'Настройки ссылки "Все новости"',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'allPostsLink'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'allPostsLink',
                    'Ссылка "Все новости"',
                    'Шрифт для ссылки "Все новости" (использует настройки Body)',
                  ),
                },
                // CardCategory настройки
                {
                  name: 'cardCategory',
                  type: 'group',
                  label: 'Настройки рубрик в карточках',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'cardCategory'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'cardCategory',
                    'Рубрики в карточках',
                    'Шрифт для рубрик в карточках (использует настройки Body)',
                  ),
                },
                // CardText настройки
                {
                  name: 'cardText',
                  type: 'group',
                  label: 'Настройки текста карточек',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'cardText'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'cardText',
                    'Текст карточек',
                    'Шрифт для текста в карточках (использует настройки Body)',
                  ),
                },
                // FooterMenu настройки
                {
                  name: 'footerMenu',
                  type: 'group',
                  label: 'Настройки меню в футере',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'footerMenu'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'footerMenu',
                    'Меню в футере',
                    'Шрифт для меню в футере (использует настройки Body)',
                  ),
                },
                // FooterText настройки
                {
                  name: 'footerText',
                  type: 'group',
                  label: 'Настройки текста в футере',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'footerText'
                    },
                    description: 'Использует настройки базового шрифта (Body)',
                  },
                  fields: createFontElementFields(
                    'footerText',
                    'Текст в футере',
                    'Шрифт для текста в футере (использует настройки Body)',
                  ),
                },
                // HeaderMenu настройки
                {
                  name: 'headerMenu',
                  type: 'group',
                  label: 'Настройки меню в хедере',
                  admin: {
                    condition: (data, siblingData) => {
                      const selected = siblingData?.selectedElement || data?.fonts?.selectedElement || 'body'
                      return selected === 'headerMenu'
                    },
                    description: 'Применяется к элементам a и button внутри элемента класса nav_font',
                  },
                  fields: createFontElementFields(
                    'headerMenu',
                    'Header menu',
                    'Шрифт для элементов меню в хедере (a и button внутри nav_font)',
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
