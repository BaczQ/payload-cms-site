import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // основной origin (localhost / прод)
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          port: url.port || undefined,
        }
      }),
      // твой дев-сервер по IP
      {
        protocol: 'http',
        hostname: '10.0.85.2',
        port: '3000',
        // можно без pathname, но так ещё точнее:
        // pathname: '/api/media/**',
      },
    ],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
