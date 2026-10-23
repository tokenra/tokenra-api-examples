#!/usr/bin/env bash
# Step 2 of 2: check a video task. Repeat until data.status is SUCCESS (the video is
# in data.result_url) or FAILURE (the reason is in data.fail_reason).
# Usage: bash curl/video-status.sh <task_id>
set -euo pipefail
: "${TOKENRA_API_KEY:?Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register}"
BASE_URL="${TOKENRA_BASE_URL:-https://tokenra.io/v1}"
TASK_ID="${1:?Usage: bash curl/video-status.sh <task_id>}"

curl -sS --fail-with-body "$BASE_URL/video/generations/$TASK_ID" \
  -H "Authorization: Bearer $TOKENRA_API_KEY"
echo
