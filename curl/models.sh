#!/usr/bin/env bash
# List the model IDs your key can call.
# Usage: bash curl/models.sh
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"

curl -sS --fail-with-body "$BASE_URL/models" \
  -H "Authorization: Bearer $TOKENRA_API_KEY"
echo
