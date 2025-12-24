import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { authenticated } from '../../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Hook to delete old avatar file when it's replaced
const deleteOldAvatar: CollectionBeforeChangeHook = async ({ data, req, operation, originalDoc }) => {
  // Only process on update operations
  if (operation !== 'update' || !originalDoc) {
    return data
  }

  // Check if avatar is being changed
  const newAvatar = data.avatar
  const oldAvatar = originalDoc.avatar

  // If avatar is being removed or changed, delete the old file
  if (oldAvatar) {
    const oldAvatarId = typeof oldAvatar === 'string' ? oldAvatar : (typeof oldAvatar === 'object' && oldAvatar !== null && 'id' in oldAvatar ? oldAvatar.id : null)
    const newAvatarId = newAvatar
      ? typeof newAvatar === 'string'
        ? newAvatar
        : typeof newAvatar === 'object' && newAvatar !== null && 'id' in newAvatar
          ? newAvatar.id
          : null
      : null

    // If avatar is being removed or changed to a different file
    if (!newAvatarId || oldAvatarId !== newAvatarId) {
      try {
        // Get the old media document
        const oldMedia = await req.payload.findByID({
          collection: 'media',
          id: typeof oldAvatarId === 'string' ? oldAvatarId : String(oldAvatarId),
        })

        if (oldMedia) {
          const mediaDir = path.resolve(dirname, '../../public/media')

          // Delete the main file
          if (oldMedia.filename) {
            const filePath = path.join(mediaDir, oldMedia.filename)
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath)
              req.payload.logger.info(`Deleted old avatar file: ${filePath}`)
            }
          }

          // Delete all resized versions if they exist
          if (oldMedia.sizes && typeof oldMedia.sizes === 'object') {
            const sizes = oldMedia.sizes as Record<string, any>
            for (const sizeName in sizes) {
              const sizeData = sizes[sizeName]
              if (sizeData && sizeData.filename) {
                const sizePath = path.join(mediaDir, sizeData.filename)
                if (fs.existsSync(sizePath)) {
                  fs.unlinkSync(sizePath)
                  req.payload.logger.info(`Deleted old avatar size ${sizeName}: ${sizePath}`)
                }
              }
            }
          }

          // Delete the media document (Payload will handle cleanup, but we do it explicitly)
          await req.payload.delete({
            collection: 'media',
            id: typeof oldAvatarId === 'string' ? oldAvatarId : String(oldAvatarId),
            req,
          })
        }
      } catch (error) {
        req.payload.logger.error(`Error deleting old avatar: ${error instanceof Error ? error.message : String(error)}`)
        // Don't fail the operation if file deletion fails
      }
    }
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    beforeChange: [deleteOldAvatar],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Аватарка автора. Загружается в полном размере без ресайза.',
      },
    },
  ],
  timestamps: true,
}
