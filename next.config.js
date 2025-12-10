import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

// ===============================
// Основной URL сервера
// В продакшене прописывается в .env:
// NEXT_PUBLIC_SERVER_URL=https://bfnews.ru
// ===============================
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'
const serverUrl = new URL(SERVER_URL)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Разрешаем загрузку картинок с твоего домена
      {
        protocol: serverUrl.protocol.replace(':', ''),
        hostname: serverUrl.hostname,
        port: serverUrl.port || undefined,
      },

      // Если хочешь разрешить загрузку с локального дев-сервера — оставь
      // {
      //   protocol: 'http',
      //   hostname: '10.0.85.2',
      //   port: '3000',
      // },
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
