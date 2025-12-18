#!/usr/bin/env bash
set -euo pipefail

PM2_APP_NAME="bf-news"

echo "==> Restarting PM2 app: $PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME"

echo "==> Status"
pm2 list
