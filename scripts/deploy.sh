#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/bf-news"
PM2_APP_NAME="bf-news"

cd "$APP_DIR"

echo "==> Installing deps"
pnpm install

echo "==> Building"
pnpm build

echo "==> Restarting PM2 app: $PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME"

echo "==> Status"
pm2 list
