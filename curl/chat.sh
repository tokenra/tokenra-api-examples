#!/usr/bin/env bash
# Chat completion through TokenRa's OpenAI-compatible endpoint.
# Usage: bash curl/chat.sh
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"
MODEL="${TOKENRA_MODEL:-deepseek-v4.1-flash}"

curl -sS --fail-with-body "$BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "$MODEL",
  "messages": [
    {"role": "system", "content": "You are a concise technical assistant."},
    {"role": "user", "content": "Explain what an API gateway does in two sentences."}
  ]
}
EOF
echo
