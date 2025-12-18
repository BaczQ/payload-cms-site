import config from '@payload-config'
import { getPayload } from 'payload'

function toNumericID(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return null
}

function getFirstCategoryID(value: unknown): number | null {
  if (!value) return null
  if (!Array.isArray(value)) return null
  const first = value[0]
  if (!first) return null
  if (typeof first === 'string' || typeof first === 'number') return toNumericID(first)
  if (typeof first === 'object' && first !== null && 'id' in first) {
    const id = (first as any).id
    return toNumericID(id)
  }
  return null
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  const batchSize = Number(process.env.MIGRATE_BATCH_SIZE || 200)
  let page = 1

  let updated = 0
  let skipped = 0

  payload.logger.info(
    `Starting migration: set posts.category from legacy posts.categories[0] (batchSize=${batchSize})`,
  )

  // Loop until no more docs match
  // We keep querying with constraints so the result set shrinks as we update.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await payload.find({
      collection: 'posts',
      overrideAccess: true, // one-off admin migration
      depth: 0,
      limit: batchSize,
      page,
      select: {
        id: true,
        slug: true,
        category: true,
        categories: true, // legacy hasMany
      },
      where: {
        and: [
          // category missing or null
          {
            or: [{ category: { exists: false } }, { category: { equals: null } }],
          },
          // legacy categories present
          { categories: { exists: true } },
        ],
      },
    })

    if (!res.docs?.length) break

    for (const doc of res.docs as any[]) {
      const id = toNumericID(doc.id)
      if (id === null) {
        skipped++
        continue
      }
      const legacyID = getFirstCategoryID(doc.categories)

      if (!legacyID) {
        skipped++
        continue
      }

      await payload.update({
        collection: 'posts',
        id,
        overrideAccess: true,
        // prevent massive revalidation runs
        context: { disableRevalidate: true },
        data: {
          category: legacyID,
        },
      })

      updated++
    }

    // If we got a full page, keep going; otherwise we're done.
    if (res.docs.length < batchSize) break
    page++
  }

  payload.logger.info(`Migration done. Updated=${updated}, Skipped=${skipped}`)
}

await main()
