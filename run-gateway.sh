#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
  echo "IMPORTANT: Set JWT_ACCESS_SECRET to the same secret used by IAM."
fi

if [ ! -d node_modules ]; then
  npm install
fi

npm run dev
