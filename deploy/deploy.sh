#!/usr/bin/env bash
# Запускать из корня репозитория product_live на VM.
set -e
cd "$(dirname "$0")/.."
branch=$(git branch --show-current)
git fetch origin
# Деплой только если на origin есть новые коммиты (мы отстаём)
count=$(git rev-list HEAD..origin/$branch --count 2>/dev/null || echo 0)
if [ "${count:-0}" -gt 0 ]; then
  git pull origin "$branch"
  docker compose up -d --build
  echo "Деплой завершён."
else
  echo "Нет новых коммитов, деплой не требуется."
fi
