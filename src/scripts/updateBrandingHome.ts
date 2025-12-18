import config from '@payload-config'
import { getPayload } from 'payload'

const FROM = 'Payload'
const TO = 'BF-load'

function replaceInUnknown(value: unknown): unknown {
  if (typeof value === 'string') return value.replaceAll(FROM, TO)
  if (Array.isArray(value)) return value.map(replaceInUnknown)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = replaceInUnknown(v)
    return out
  }
  return value
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'pages',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: {
      slug: { equals: 'home' },
    },
  })

  const page = res.docs?.[0] as any
  if (!page?.id) {
    payload.logger.warn('Branding update: page with slug "home" not found')
    return
  }

  const nextHero = replaceInUnknown(page.hero)
  const nextMeta = replaceInUnknown(page.meta)

  // Only update if something actually changed
  const changed =
    JSON.stringify(nextHero) !== JSON.stringify(page.hero) ||
    JSON.stringify(nextMeta) !== JSON.stringify(page.meta)

  if (!changed) {
    payload.logger.info('Branding update: no changes needed')
    return
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      // This is a one-off data fix script. We intentionally operate on unknown
      // JSON and cast to satisfy collection typing.
      hero: nextHero as any,
      meta: nextMeta as any,
    },
  })

  payload.logger.info(`Branding update: updated pages/${page.id}`)
}

await main()
