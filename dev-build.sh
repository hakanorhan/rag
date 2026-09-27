#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

docker compose --env-file .env.dev -f floci.compose.dev.yml up -d

terraform -chdir=infrastructure/aws init
terraform -chdir=infrastructure/aws apply -auto-approve

docker compose --env-file .env.dev -f compose.dev.yml up -d --build --wait

printf '\n\033[1;33m✓ Ready to use\033[0m\n'

docker compose --env-file .env.dev -f compose.dev.yml watch --no-up