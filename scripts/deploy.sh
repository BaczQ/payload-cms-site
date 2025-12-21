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

# Use atomic copy approach: copy to temp directory first, then move
TEMP_STATIC_DIR="$APP_DIR/.next/standalone/.next/static.tmp"
# Remove temp directory if it exists from previous failed deploy
rm -rf "$TEMP_STATIC_DIR"

# Copy entire static directory to temp location
cp -r "$APP_DIR/.next/static" "$TEMP_STATIC_DIR" || {
  echo "ERROR: Failed to copy static files"
  exit 1
}

# Verify critical files exist in temp directory
if [ ! -d "$TEMP_STATIC_DIR/chunks" ] || [ ! -d "$TEMP_STATIC_DIR/css" ]; then
  echo "ERROR: Static directory structure is incomplete"
  rm -rf "$TEMP_STATIC_DIR"
  exit 1
fi

# Atomically replace old static directory with new one
rm -rf "$APP_DIR/.next/standalone/.next/static"
mv "$TEMP_STATIC_DIR" "$APP_DIR/.next/standalone/.next/static" || {
  echo "ERROR: Failed to move static files to final location"
  exit 1
}

# Copy public directory
if [ -d "$APP_DIR/public" ]; then
  cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/" || {
    echo "WARNING: Failed to copy public directory"
  }
fi

# Copy BUILD_ID to ensure version consistency
if [ -f "$APP_DIR/.next/BUILD_ID" ]; then
  cp "$APP_DIR/.next/BUILD_ID" "$APP_DIR/.next/standalone/.next/" || {
    echo "WARNING: Failed to copy BUILD_ID"
  }
fi

echo "==> Static files copied successfully"

echo "==> Restarting PM2 app: $PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME"

echo "==> Status"
pm2 list
