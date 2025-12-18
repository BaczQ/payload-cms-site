/**
 * PM2 ecosystem config for bf-news (no Docker)
 *
 * Uses Next.js "standalone" output.
 * Build first: pnpm build
 */

module.exports = {
  apps: [
    {
      name: 'bf-news',
      cwd: '/var/www/bf-news',
      script: 'node',
      args: '.next/standalone/server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
}
