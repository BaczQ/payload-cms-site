import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:4000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      ...(NEXT_PUBLIC_SERVER_URL ? [NEXT_PUBLIC_SERVER_URL] : [])
        .map((item) => {
          if (!item) return null
          try {
            const url = new URL(item)

            return {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', ''),
              port: url.port || '',
            }
          } catch (_error) {
            console.warn(`Failed to create URL object from URL: ${item}, skipping`)
            return null
          }
        })
        .filter(Boolean),
      // Allow localhost for development
      {
        hostname: 'localhost',
        protocol: 'http',
      },
      // Allow production domain
      {
        hostname: 'bfnews.ru',
        protocol: 'http',
      },
      {
        hostname: 'bfnews.ru',
        protocol: 'https',
      },
      {
        hostname: 'www.bfnews.ru',
        protocol: 'http',
      },
      {
        hostname: 'www.bfnews.ru',
        protocol: 'https',
      },
    ],
    // Disable image optimization to fix 400 errors with /api/media/file/
    // Images will be served directly without optimization
    unoptimized: true,
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ignore source map warnings for Payload CMS packages
    if (isServer) {
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /@payloadcms/,
          message: /Invalid source map/,
        },
      ]
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
