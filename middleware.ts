import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Force HTTP -> HTTPS in production.
 *
 * This is implemented in middleware to preserve the incoming host and path
 * (important when running behind a proxy / multiple domains).
 */
export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') return NextResponse.next()

  // Prefer proxy header when present; otherwise fall back to Next's parsed protocol.
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const isHttp = forwardedProto
    ? forwardedProto.split(',')[0]?.trim().toLowerCase() === 'http'
    : req.nextUrl.protocol === 'http:'

  if (!isHttp) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.protocol = 'https:'

  // Ensure we don't accidentally keep default http port in the URL.
  url.port = ''

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    /**
     * Apply to everything except:
     * - Next internals
     */
    '/((?!_next/).*)',
  ],
}
