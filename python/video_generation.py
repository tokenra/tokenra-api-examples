"""Generate a video with Seedance through TokenRa's asynchronous task API.

1. POST /v1/video/generations creates a task and returns its task_id.
2. GET /v1/video/generations/{task_id} reports the status until SUCCESS or FAILURE.

Usage:
    python video_generation.py "A paper boat drifting down a rainy neon street"
"""

import os
import sys
import time

import httpx

api_key = os.getenv("TOKENRA_API_KEY")
if not api_key:
    sys.exit("Set TOKENRA_API_KEY first. Create a key at https://tokenra.io/register")

base_url = os.getenv("TOKENRA_BASE_URL", "https://tokenra.io/v1").rstrip("/")
model = os.getenv("TOKENRA_VIDEO_MODEL", "seedance-2-0-mini")
prompt = " ".join(sys.argv[1:]) or "A paper boat drifting down a rainy neon street at night, cinematic close-up"

payload = {
    "model": model,
    "prompt": prompt,
    "resolution": "720p",
    "ratio": "16:9",
    "duration": 5,
    # Image-to-video: add "images": ["https://.../first-frame.png"]
}

with httpx.Client(headers={"Authorization": f"Bearer {api_key}"}, timeout=60) as http:
    created = http.post(f"{base_url}/video/generations", json=payload)
    if created.is_error:
        sys.exit(f"Create failed: HTTP {created.status_code} {created.text}")
    task_id = created.json()["task_id"]
    print(f"Task {task_id} created. Polling every 10 seconds...")

    # Polling is safe to retry; creating is not, because every created task is billed.
    deadline = time.monotonic() + 15 * 60
    while time.monotonic() < deadline:
        time.sleep(10)
        try:
            polled = http.get(f"{base_url}/video/generations/{task_id}")
        except httpx.TransportError as error:
            print(f"  network error, retrying: {error}")
            continue
        if polled.status_code >= 500:
            print(f"  HTTP {polled.status_code}, retrying")
            continue
        if polled.is_error:
            sys.exit(f"Status check failed: HTTP {polled.status_code} {polled.text}")
        task = polled.json()["data"]
        print(f"  {task['status']} {task.get('progress', '')}")
        if task["status"] == "SUCCESS":
            print(f"Video URL: {task['result_url']}")
            break
        if task["status"] == "FAILURE":
            sys.exit(f"Task failed: {task.get('fail_reason')}")
    else:
        sys.exit(f"Still running after 15 minutes. Check again later: GET {base_url}/video/generations/{task_id}")
