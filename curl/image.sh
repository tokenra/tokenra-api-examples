#!/usr/bin/env bash
# Generate an image with GPT Image 2.5. The JSON response is saved to output/image-response.json
# because it can carry the whole image as base64 (data[0].b64_json) instead of a link (data[0].url).
# Usage: bash curl/image.sh
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"
MODEL="${TOKENRA_IMAGE_MODEL:-gpt-image-2.5-flare}"
PAYLOAD="{\"model\": \"$MODEL\", \"prompt\": \"A clean editorial illustration of a sunrise over a city skyline\"}"

mkdir -p output
if ! curl -sS --fail-with-body "$BASE_URL/images/generations" \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -o output/image-response.json; then
  cat output/image-response.json >&2
  echo >&2
  exit 1
fi
echo "Saved output/image-response.json"
