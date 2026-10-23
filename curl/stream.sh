#!/usr/bin/env bash
# Streaming chat completion. Each line is a Server-Sent Event: "data: {...}", ending with "data: [DONE]".
# Usage: bash curl/stream.sh
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"
MODEL="${TOKENRA_MODEL:-deepseek-v4.1-flash}"

curl -sS -N --fail-with-body "$BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "$MODEL",
  "stream": true,
  "stream_options": {"include_usage": true},
  "messages": [
    {"role": "user", "content": "Write a four-line poem about shipping code on Friday."}
  ]
}
EOF
