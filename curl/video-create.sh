#!/usr/bin/env bash
# Step 1 of 2: create an asynchronous Seedance video task. The response contains "task_id".
# Then poll it with: bash curl/video-status.sh <task_id>
# Usage: bash curl/video-create.sh
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"
MODEL="${TOKENRA_VIDEO_MODEL:-seedance-2-0-mini}"

curl -sS --fail-with-body "$BASE_URL/video/generations" \
  -H "Authorization: Bearer $TOKENRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "$MODEL",
  "prompt": "A paper boat drifting down a rainy neon street at night, cinematic close-up",
  "resolution": "720p",
  "ratio": "16:9",
  "duration": 5
}
EOF
echo
