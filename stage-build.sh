#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

docker compose --env-file .env.dev -f compose.stage.yml down --remove-orphans

docker compose --env-file .env.dev -f compose.floci.yml up -d --wait

terraform -chdir=infrastructure/aws init
terraform -chdir=infrastructure/aws apply -auto-approve

docker compose --env-file .env.dev -f compose.stage.yml up -d --build --wait

printf '\n\033[1;33m✓ Ready to use\033[0m\n'
