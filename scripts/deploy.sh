#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/bf-news"
PM2_APP_NAME="bf-news"

cd "$APP_DIR"

echo "==> Installing deps"
pnpm install

echo "==> Building"
pnpm build

echo "==> Copying static files to standalone"
# Ensure standalone directory exists
if [ ! -d "$APP_DIR/.next/standalone" ]; then
  echo "ERROR: Standalone directory not found. Build may have failed."
  exit 1
fi

# Ensure .next directory exists in standalone
mkdir -p "$APP_DIR/.next/standalone/.next"

# Remove existing static directory to avoid conflicts
rm -rf "$APP_DIR/.next/standalone/.next/static"
# Copy entire static directory
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/" || {
  echo "ERROR: Failed to copy static files"
  exit 1
}
# Copy public directory
cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/" || {
  echo "WARNING: Failed to copy public directory"
}
# Copy BUILD_ID
if [ -f "$APP_DIR/.next/BUILD_ID" ]; then
  cp "$APP_DIR/.next/BUILD_ID" "$APP_DIR/.next/standalone/.next/" || true
fi

echo "==> Restarting PM2 app: $PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME"

echo "==> Status"
pm2 list
