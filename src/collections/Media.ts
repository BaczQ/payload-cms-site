import type { CollectionConfig, CollectionAfterReadHook, CollectionAfterChangeHook } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Hook to check if files exist and handle missing files gracefully
const checkFileExists: CollectionAfterReadHook = async ({ doc, req }) => {
  if (!doc || typeof doc !== 'object' || !('url' in doc)) {
    return doc
  }

  const mediaDir = path.resolve(dirname, '../../public/media')

  // Check if main file exists
  if (doc.url && typeof doc.url === 'string' && !doc.url.startsWith('http')) {
    // Handle both /media/ and /api/media/file/ URL formats
    let filename = ''
    if (doc.url.includes('/api/media/file/')) {
      filename = doc.url.replace('/api/media/file/', '')
    } else {
      filename = doc.url.replace(/^\/media\//, '')
    }
    const filePath = path.join(mediaDir, filename)

    if (!fs.existsSync(filePath)) {
      req.payload.logger.warn(
        `Media file ${doc.url} is missing on disk. Expected path: ${filePath}`,
      )
      // Don't fail, just log - the URL will still be returned but the file won't load
    } else {
      // Update URL to correct format if it was /api/media/file/
      if (doc.url.includes('/api/media/file/')) {
        ;(doc as any).url = `/media/${filename}`
      }
    }
  }

  // Check if image sizes exist
  if (doc.sizes && typeof doc.sizes === 'object') {
    const mainUrl = doc.url as string
    // Extract filename from URL - handle both /media/ and /api/media/file/ formats
    let mainFilename = ''
    if (mainUrl) {
      if (mainUrl.includes('/api/media/file/')) {
        mainFilename = mainUrl.replace('/api/media/file/', '')
      } else {
        mainFilename = path.basename(mainUrl.replace(/^\/media\//, ''))
      }
    }
    const mainFilenameWithoutExt = mainFilename ? path.parse(mainFilename).name : ''
    const mainExt = mainFilename ? path.parse(mainFilename).ext : ''

    Object.entries(doc.sizes).forEach(([sizeName, sizeData]) => {
      if (sizeData && typeof sizeData === 'object' && 'url' in sizeData && sizeData.url) {
        const sizeUrl = sizeData.url as string
        if (!sizeUrl.startsWith('http')) {
          // Extract filename from sizeUrl - handle /api/media/file/ format
          let thumbnailFilename = ''
          if (sizeUrl.includes('/api/media/file/')) {
            thumbnailFilename = sizeUrl.replace('/api/media/file/', '')
          } else {
            thumbnailFilename = sizeUrl.replace(/^\/media\//, '').replace(/^\//, '')
          }

          // Build alternative paths based on Payload's naming convention
          const alternativePaths: string[] = [
            path.join(mediaDir, thumbnailFilename), // direct filename from URL
          ]

          // If we have the main filename, try to construct expected thumbnail paths
          if (mainFilenameWithoutExt && mainExt) {
            const sizeConfig = {
              thumbnail: { width: 300 },
              square: { width: 500, height: 500 },
              small: { width: 600 },
              medium: { width: 900 },
              large: { width: 1400 },
              xlarge: { width: 1920 },
              og: { width: 1200, height: 630 },
            }[sizeName]

            if (sizeConfig) {
              // Try format: filename-widthxheight.ext (most common Payload format)
              if (sizeConfig.height) {
                alternativePaths.push(
                  path.join(
                    mediaDir,
                    `${mainFilenameWithoutExt}-${sizeConfig.width}x${sizeConfig.height}${mainExt}`,
                  ),
                )
              } else {
                // For thumbnail without height, try with calculated height or just width
                alternativePaths.push(
                  path.join(mediaDir, `${mainFilenameWithoutExt}-${sizeConfig.width}${mainExt}`),
                )
              }
              // Try format: filename-sizename.ext
              alternativePaths.push(
                path.join(mediaDir, `${mainFilenameWithoutExt}-${sizeName}${mainExt}`),
              )
            }
          }

          const existingPaths = alternativePaths.filter((p) => fs.existsSync(p))
          const fileExists = existingPaths.length > 0

          if (!fileExists) {
            req.payload.logger.warn(
              `❌ Media thumbnail "${sizeName}" MISSING for ${mainFilename || 'unknown'}. ` +
                `URL in DB: "${sizeUrl}". ` +
                `Checked ${alternativePaths.length} paths: ${alternativePaths.slice(0, 3).join(', ')}`,
            )
            // Remove the missing size from the response to prevent broken image URLs
            if (sizeData && typeof sizeData === 'object') {
              delete (doc.sizes as any)[sizeName]
            }
          } else {
            // Update the URL in the document to point to the correct file path
            const foundPath = existingPaths[0]
            const relativePath = `/media/${path.basename(foundPath)}`
            if (sizeData && typeof sizeData === 'object') {
              ;(sizeData as any).url = relativePath
            }
            req.payload.logger.debug(
              `✅ Found thumbnail "${sizeName}" for ${mainFilename} at: ${foundPath}, updated URL to: ${relativePath}`,
            )
          }
        }
      }
    })
  }

  return doc
}

// Hook to log when thumbnails are missing for debugging
// Payload should automatically generate thumbnails for all image formats including WebP
const logMissingThumbnails: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  // Only process on create operations
  if (
    operation !== 'create' ||
    !doc ||
    typeof doc !== 'object' ||
    !('url' in doc) ||
    !('mimeType' in doc)
  ) {
    return doc
  }

  // Only process image files
  const mimeType = doc.mimeType as string
  if (!mimeType || !mimeType.startsWith('image/')) {
    return doc
  }

  const mediaDir = path.resolve(dirname, '../../public/media')
  const url = doc.url as string

  if (url && typeof url === 'string' && !url.startsWith('http')) {
    const filePath = path.join(mediaDir, url.replace(/^\/media\//, ''))

    // Check if file exists and if thumbnails are missing
    if (fs.existsSync(filePath)) {
      const sizes = (doc.sizes as Record<string, any>) || {}
      const expectedSizes = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og']
      const missingSizes: string[] = []

      for (const sizeName of expectedSizes) {
        if (!sizes[sizeName] || !sizes[sizeName].url) {
          missingSizes.push(sizeName)
        }
      }

      if (missingSizes.length > 0) {
        req.payload.logger.warn(
          `⚠️ Missing thumbnails for ${url} (${mimeType}): ${missingSizes.join(', ')}. ` +
            `Payload should generate them automatically.`,
        )
      } else {
        // Log what thumbnails were created and their paths
        const createdSizes = Object.entries(sizes)
          .filter(([name]) => expectedSizes.includes(name))
          .map(([name, data]: [string, any]) => `${name}: ${data?.url || 'no URL'}`)
          .join(', ')

        req.payload.logger.info(`✅ Thumbnails created for ${url} (${mimeType}): ${createdSizes}`)
      }
    }
  }

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterRead: [checkFileExists],
    afterChange: [logMissingThumbnails],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Ensure all image formats are processed, including WebP
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        // Don't specify format - let Payload preserve original format or convert as needed
        // This ensures thumbnails are generated for all formats including WebP
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
