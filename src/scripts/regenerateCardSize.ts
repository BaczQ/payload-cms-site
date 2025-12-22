import config from '@payload-config'
import { getPayload } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  // Use process.cwd() to get the project root, then resolve to public/media
  const mediaDir = path.resolve(process.cwd(), 'public/media')
  const batchSize = Number(process.env.REGENERATE_BATCH_SIZE || 50)
  let page = 1

  let processed = 0
  let generated = 0
  let skipped = 0
  let errors = 0

  payload.logger.info(
    `Starting regeneration of 'card' size (600x338, 16:9) for existing images (batchSize=${batchSize})`,
  )

  // Loop through all media files
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await payload.find({
      collection: 'media',
      overrideAccess: true,
      depth: 0,
      limit: batchSize,
      page,
      where: {
        mimeType: {
          contains: 'image/',
        },
      },
    })

    if (!res.docs?.length) break

    for (const doc of res.docs as any[]) {
      try {
        processed++

        // Check if card size already exists
        const sizes = (doc.sizes && typeof doc.sizes === 'object') ? doc.sizes : {}
        if (sizes.card && typeof sizes.card === 'object' && sizes.card.url) {
          // Check if file actually exists
          const cardUrl = sizes.card.url as string
          let cardPath = ''
          if (cardUrl.startsWith('/media/')) {
            cardPath = path.join(mediaDir, cardUrl.replace(/^\/media\//, ''))
          } else if (cardUrl.startsWith('/api/media/file/')) {
            const filename = cardUrl.replace('/api/media/file/', '')
            cardPath = path.join(mediaDir, filename)
          }

          if (cardPath && fs.existsSync(cardPath)) {
            skipped++
            continue
          }
        }

        // Get original file path - try multiple strategies
        const originalUrl = doc.url as string
        if (!originalUrl || originalUrl.startsWith('http')) {
          skipped++
          continue
        }

        // Try to find original file using multiple strategies
        let originalPath = ''
        let originalFilename = ''

        // Strategy 1: Direct path from URL
        if (originalUrl.startsWith('/media/')) {
          const filename = decodeURIComponent(originalUrl.replace(/^\/media\//, ''))
          const testPath = path.join(mediaDir, filename)
          if (fs.existsSync(testPath)) {
            originalPath = testPath
            originalFilename = filename
          }
        } else if (originalUrl.startsWith('/api/media/file/')) {
          const filename = decodeURIComponent(originalUrl.replace('/api/media/file/', ''))
          const testPath = path.join(mediaDir, filename)
          if (fs.existsSync(testPath)) {
            originalPath = testPath
            originalFilename = filename
          }
        }

        // Strategy 2: If not found, try to extract from existing sizes
        if (!originalFilename && sizes && typeof sizes === 'object') {
          // Try to find any existing size to get the base filename
          const existingSizes = ['medium', 'large', 'small', 'thumbnail', 'square', 'og', 'xlarge']
          for (const sizeName of existingSizes) {
            const sizeData = sizes[sizeName]
            if (sizeData && typeof sizeData === 'object' && sizeData.url) {
              const sizeUrl = sizeData.url as string
              let sizeFilename = ''
              if (sizeUrl.startsWith('/media/')) {
                sizeFilename = decodeURIComponent(sizeUrl.replace(/^\/media\//, ''))
              } else if (sizeUrl.startsWith('/api/media/file/')) {
                sizeFilename = decodeURIComponent(sizeUrl.replace('/api/media/file/', ''))
              }

              if (sizeFilename) {
                // Extract base filename (remove size suffix like -600x400)
                const sizePath = path.join(mediaDir, sizeFilename)
                if (fs.existsSync(sizePath)) {
                  // Try to find original by removing size suffix
                  const sizeBase = path.parse(sizeFilename).name
                  // Remove patterns like -600x400, -600, -thumbnail, etc.
                  const baseName = sizeBase.replace(/-\d+x\d+$/, '').replace(/-\d+$/, '').replace(/-thumbnail$/, '').replace(/-square$/, '').replace(/-small$/, '').replace(/-medium$/, '').replace(/-large$/, '').replace(/-xlarge$/, '').replace(/-og$/, '')
                  const ext = path.extname(sizeFilename)
                  
                  // Try original filename
                  const possibleOriginal = `${baseName}${ext}`
                  const possiblePath = path.join(mediaDir, possibleOriginal)
                  if (fs.existsSync(possiblePath)) {
                    originalPath = possiblePath
                    originalFilename = possibleOriginal
                    break
                  }
                }
              }
            }
          }
        }

        // Strategy 3: Use filename from doc if available
        if (!originalFilename && doc.filename) {
          const possiblePath = path.join(mediaDir, doc.filename as string)
          if (fs.existsSync(possiblePath)) {
            originalPath = possiblePath
            originalFilename = doc.filename as string
          }
        }

        // Strategy 4: If original not found, use largest available size as source
        if (!originalPath || !fs.existsSync(originalPath)) {
          if (sizes && typeof sizes === 'object') {
            // Try sizes from largest to smallest
            const sizeOrder = ['xlarge', 'large', 'medium', 'og', 'small', 'square', 'thumbnail']
            for (const sizeName of sizeOrder) {
              const sizeData = sizes[sizeName]
              if (sizeData && typeof sizeData === 'object' && sizeData.url) {
                const sizeUrl = sizeData.url as string
                let sizeFilename = ''
                if (sizeUrl.startsWith('/media/')) {
                  sizeFilename = decodeURIComponent(sizeUrl.replace(/^\/media\//, ''))
                } else if (sizeUrl.startsWith('/api/media/file/')) {
                  sizeFilename = decodeURIComponent(sizeUrl.replace('/api/media/file/', ''))
                }

                if (sizeFilename) {
                  const sizePath = path.join(mediaDir, sizeFilename)
                  if (fs.existsSync(sizePath)) {
                    originalPath = sizePath
                    originalFilename = sizeFilename
                    payload.logger.info(`✅ Using ${sizeName} size as source for card generation: ${sizeFilename}`)
                    break
                  } else {
                    payload.logger.debug(`Size file not found: ${sizePath} (from URL: ${sizeUrl})`)
                  }
                }
              }
            }
          } else {
            payload.logger.debug(`No sizes object found for doc ${doc.id}`)
          }
        }

        if (!originalPath || !fs.existsSync(originalPath)) {
          payload.logger.warn(`Original file not found: ${originalUrl} (tried multiple strategies)`)
          skipped++
          continue
        }

        // Generate card size (600x338, 16:9)
        // Use originalFilename if available, otherwise extract from originalPath
        const finalFilename = originalFilename || path.basename(originalPath)
        const originalExt = path.extname(finalFilename)
        const originalName = path.parse(finalFilename).name

        // Generate filename for card size
        // Payload typically uses format: filename-600x338.ext
        const cardFilename = `${originalName}-600x338${originalExt}`
        const cardPath = path.join(mediaDir, cardFilename)

        // Generate the image using sharp
        await sharp(originalPath)
          .resize(600, 338, {
            fit: 'cover',
            position: 'center',
          })
          .toFile(cardPath)

        // Get file stats
        const stats = fs.statSync(cardPath)

        // Update the media document with the new size
        const cardUrl = `/media/${cardFilename}`
        const updatedSizes = {
          ...sizes,
          card: {
            url: cardUrl,
            width: 600,
            height: 338,
            mimeType: doc.mimeType,
            filesize: stats.size,
            filename: cardFilename,
          },
        }

        await payload.update({
          collection: 'media',
          id: doc.id,
          overrideAccess: true,
          data: {
            sizes: updatedSizes,
          },
        })

        generated++
        payload.logger.info(`✅ Generated card size for: ${originalFilename}`)
      } catch (error: any) {
        errors++
        payload.logger.error(
          `❌ Error processing ${doc.id} (${doc.filename || 'unknown'}): ${error.message}`,
        )
      }
    }

    // If we got a full page, keep going; otherwise we're done.
    if (res.docs.length < batchSize) break
    page++
  }

  payload.logger.info(
    `Regeneration done. Processed=${processed}, Generated=${generated}, Skipped=${skipped}, Errors=${errors}`,
  )
}

await main()

