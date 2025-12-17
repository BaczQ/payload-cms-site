import type { CollectionConfig, CollectionAfterReadHook } from 'payload'

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
    const filePath = path.join(mediaDir, doc.url.replace(/^\/media\//, ''))

    if (!fs.existsSync(filePath)) {
      req.payload.logger.warn(
        `Media file ${doc.url} is missing on disk. Expected path: ${filePath}`,
      )
      // Don't fail, just log - the URL will still be returned but the file won't load
    }
  }

  // Check if image sizes exist
  if (doc.sizes && typeof doc.sizes === 'object') {
    Object.entries(doc.sizes).forEach(([sizeName, sizeData]) => {
      if (sizeData && typeof sizeData === 'object' && 'url' in sizeData && sizeData.url) {
        const sizeUrl = sizeData.url as string
        if (!sizeUrl.startsWith('http')) {
          const sizeFilePath = path.join(mediaDir, sizeUrl.replace(/^\/media\//, ''))

          if (!fs.existsSync(sizeFilePath)) {
            req.payload.logger.warn(
              `Media file ${sizeUrl} for size "${sizeName}" is missing on disk. Expected path: ${sizeFilePath}`,
            )
            // Remove the missing size from the response to prevent broken image URLs
            if (sizeData && typeof sizeData === 'object') {
              delete (doc.sizes as any)[sizeName]
            }
          }
        }
      }
    })
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
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
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
