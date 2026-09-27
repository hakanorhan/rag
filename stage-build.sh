#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Reuse the development Floci instance and its persisted data.
docker compose --env-file .env.dev -f floci.compose.dev.yml up -d

# Uses the rag-dev project and its databases. Replaces running dev app services.
docker compose --env-file .env.dev -f compose.dev.yml -f compose.stage.yml up -d --build --wait

printf '\n\033[1;33m✓ Ready to use\033[0m\n'
